<script setup lang="ts">
import type { CSSProperties } from "vue";

definePageMeta({
  layout: "overlay",
});

const { filtredStreamers, streamers } = storeToRefs(useKickStore());
const { getByLabel, getCurrent, create } = useWebviewWindow();
const overlayWebviewWindow = getCurrent();
const discordStore = useDiscordStore();
const { filtredUsers, guild, settings, connectedUser, isConnected } =
  storeToRefs(discordStore);
const {
  settings: systemSettings,
  battery,
  network,
  memory,
  cpu,
} = storeToRefs(useSystemStore());
const { general } = storeToRefs(useSettingsStore());
const { onDragStart } = useWebviewWindowDrag();
const errorsStore = useErrorsStore();
const { connect, listen } = useDiscord();
const { getStreamers } = useKick();
const isOnline = useOnline();

const styles = computed<CSSProperties>(() => ({
  flexDirection:
    general.value.orientation === Orientation.Vertical ? "column" : "row",
  gap: `${Math.round((general.value.size * general.value.gap) / 100)}px`,
}));

await listen();

try {
  if (isConnected.value) {
    connectedUser.value = await connect();
  }
} catch (error) {
  errorsStore.addError({
    message: JSON.stringify(error),
    source: ErrorSource.Discord,
  });
  connectedUser.value = null;
  isConnected.value = false;
}

async function openStreamWebviewWindow(slug: string) {
  const streamWebviewWindow = await getByLabel({
    label: WebviewWindowLabel.Stream,
  });

  if (streamWebviewWindow) {
    await streamWebviewWindow.emitTo(WebviewWindowLabel.Stream, "slug-update", {
      slug,
    });

    return;
  }

  const position = await overlayWebviewWindow.outerPosition();
  const size = await overlayWebviewWindow.outerSize();
  const monitor = await tauriWindowCurrentMonitor();

  const { x, y } = generateOverlaySidePosition({
    size: {
      height: streamWebviewWindowOptions.height!,
      width: streamWebviewWindowOptions.width!,
    },
    orientation: general.value.orientation,
    overlay: { position, size },
    monitor,
  });

  await create({
    ...streamWebviewWindowOptions,
    label: WebviewWindowLabel.Stream,
    url: `/stream?slug=${slug}`,
    x,
    y,
  });
}

async function openMainWebviewWindow() {
  const mainWebviewWindow = await getByLabel({
    label: WebviewWindowLabel.Main,
  });

  if (mainWebviewWindow) {
    await mainWebviewWindow.show();
    await mainWebviewWindow.unminimize();
    await mainWebviewWindow.setFocus();
  } else {
    const position = await overlayWebviewWindow.outerPosition();
    const size = await overlayWebviewWindow.outerSize();
    const monitor = await tauriWindowCurrentMonitor();

    const { x, y } = generateOverlaySidePosition({
      size: {
        width: mainWebviewWindowOptions.width!,
        height: mainWebviewWindowOptions.height!,
      },
      overlay: { position, size },
      monitor,
      orientation: general.value.orientation,
    });

    await create({
      ...mainWebviewWindowOptions,
      label: WebviewWindowLabel.Main,
      canBecomeKeyWindow: true,
      x,
      y,
    });
  }
}

useIntervalFn(
  async () => {
    try {
      if (streamers.value.length) {
        const data = await getStreamers({
          slugs: streamers.value.map(({ slug }) => slug),
        });
        streamers.value = data;
      }
    } catch (error) {
      errorsStore.addError({
        message: JSON.stringify(error),
        source: ErrorSource.Kick,
      });
      streamers.value = [];
    }
  },
  300000,
  { immediateCallback: true },
);

useIntervalFn(
  async () => {
    try {
      if (
        systemSettings.value.showNetwork ||
        systemSettings.value.showBattery ||
        systemSettings.value.showMemory ||
        systemSettings.value.showCpu
      ) {
        const data = await tauriCoreInvoke<{
          network: SystemNetwork | null;
          battery: SystemBattery | null;
          memory: SystemMemory | null;
          cpu: SystemCpu | null;
        }>("get_system", {
          network: systemSettings.value.showNetwork,
          battery: systemSettings.value.showBattery,
          memory: systemSettings.value.showMemory,
          cpu: systemSettings.value.showCpu,
        });
        network.value = data.network ?? undefined;
        battery.value = data.battery ?? undefined;
        memory.value = data.memory ?? undefined;
        cpu.value = data.cpu ?? undefined;
      }
    } catch (error) {
      errorsStore.addError({
        message: JSON.stringify(error),
        source: ErrorSource.System,
      });
      network.value = undefined;
      battery.value = undefined;
      memory.value = undefined;
      cpu.value = undefined;
    }
  },
  1000,
  { immediateCallback: true },
);
</script>

<template>
  <section class="flex" :style="styles">
    <template v-if="isOnline">
      <OverlayDiscordGuild
        v-if="guild?.id && settings.showGuild"
        :guild="{
          channel: {
            name: guild.channel.name,
          },
          iconUrl: guild.iconUrl,
          name: guild.name,
        }"
      />
      <OverlayDiscordUser v-for="user in filtredUsers" :key="user.id" :user />
      <OverlayKickStreamer
        v-for="streamer in filtredStreamers"
        :key="streamer.id"
        :streamer
        @click="openStreamWebviewWindow(streamer.slug)"
      />
    </template>
    <OverlaySystemCpu v-if="cpu" :cpu />
    <OverlaySystemMemory v-if="memory" :memory />
    <OverlaySystemBattery v-if="battery" :battery />
    <OverlaySystemNetwork v-if="network" :network />
    <OverlayOffline v-if="!isOnline" />
    <OverlaySettings
      v-if="general.showSettings"
      @click="openMainWebviewWindow"
    />
    <OverlayDrag v-if="general.showDrag" @mousedown="onDragStart" />
  </section>
</template>
