<script setup lang="ts">
import type { CSSProperties } from "vue";

definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { filtredStreamers, streamers } = storeToRefs(useKickStore());
const discordStore = useDiscordStore();
const { filtredUsers, guild, settings, connectedUser } =
  storeToRefs(discordStore);
const {
  settings: systemSettings,
  isConnected,
  battery,
  network,
  memory,
  cpu,
} = storeToRefs(useSystemStore());
const { general } = storeToRefs(useSettingsStore());
const { onDragStart } = useWebviewWindowDrag();
const isMacOS = tauriOSType() === "macos";
const errorsStore = useErrorsStore();
const isOnline = useOnline();

const styles = computed<CSSProperties>(() => ({
  flexDirection:
    general.value.orientation === Orientation.Vertical ? "column" : "row",
  gap: `${Math.round((general.value.size * general.value.gap) / 100)}px`,
}));

await tauriEventListen<DiscordGuild | null>("guild-update", ({ payload }) => {
  guild.value = payload || undefined;
});

await tauriEventListen<{
  network: SystemNetwork;
  battery: SystemBattery;
  memory: SystemMemory;
  cpu: SystemCpu;
} | null>("system-update", ({ payload }) => {
  console.log({ payload });
  network.value = payload?.network;
  battery.value = payload?.battery;
  memory.value = payload?.memory;
  cpu.value = payload?.cpu;
});

try {
  if (connectedUser.value) {
    connectedUser.value =
      await tauriCoreInvoke<DiscordConnectedUser>("connect_discord");
  }
} catch (error) {
  errorsStore.addError({
    message: JSON.stringify(error),
    source: ErrorSource.Discord,
  });
  connectedUser.value = null;
}

try {
  if (isConnected.value) {
    await tauriCoreInvoke("connect_system");
  }
} catch (error) {
  errorsStore.addError({
    message: JSON.stringify(error),
    source: ErrorSource.System,
  });
  isConnected.value = false;
}

async function openStreamWebviewWindow(slug: string) {
  const streamWebviewWindow = await TauriWebviewWindowWebviewWindow.getByLabel(
    WebviewWindowLabel.Stream,
  );

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

  if (isMacOS) {
    await tauriCoreInvoke("create_nspanel", {
      height: streamWebviewWindowOptions.height,
      width: streamWebviewWindowOptions.width,
      label: WebviewWindowLabel.Stream,
      url: `/stream?slug=${slug}`,
      x,
      y,
    });
  } else {
    new TauriWebviewWindowWebviewWindow(WebviewWindowLabel.Stream, {
      ...streamWebviewWindowOptions,
      url: `/stream?slug=${slug}`,
      x,
      y,
    });
  }
}

async function openMainWebviewWindow() {
  const mainWebviewWindow = await TauriWebviewWindowWebviewWindow.getByLabel(
    WebviewWindowLabel.Main,
  );

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

    if (isMacOS) {
      await tauriCoreInvoke("create_nspanel", {
        height: mainWebviewWindowOptions.height,
        width: mainWebviewWindowOptions.width,
        url: mainWebviewWindowOptions.url,
        label: WebviewWindowLabel.Main,
        canBecomeKeyWindow: true,
        x,
        y,
      });
    } else {
      new TauriWebviewWindowWebviewWindow(WebviewWindowLabel.Main, {
        ...mainWebviewWindowOptions,
        x,
        y,
      });
    }
  }
}

useIntervalFn(
  async () => {
    try {
      if (streamers.value.length) {
        const data = await tauriCoreInvoke<KickStreamer[]>(
          "get_kick_streamers",
          { slugs: streamers.value.map(({ slug }) => slug) },
        );
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
    <OverlaySystemCpu v-if="systemSettings.showCpu && cpu" :cpu />
    <OverlaySystemMemory v-if="systemSettings.showMemory && memory" :memory />
    <OverlaySystemBattery
      v-if="systemSettings.showBattery && battery"
      :battery
    />
    <OverlaySystemNetwork
      v-if="systemSettings.showNetwork && network"
      :network
    />
    <OverlayOffline v-if="!isOnline" />
    <OverlaySettings
      v-if="general.showSettings"
      @click="openMainWebviewWindow"
    />
    <OverlayDrag v-if="general.showDrag" @mousedown="onDragStart" />
  </section>
</template>
