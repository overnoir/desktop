<script setup lang="ts">
import type { CSSProperties } from "vue";

definePageMeta({
  layout: "overlay",
});

const { getByLabel, getCurrent, create } = useWebviewWindow();
const { filtredStreamers, streamers } = storeToRefs(useKickStore());
const { onDragStart, listenDrag } = getCurrent();
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
const { connect, listen } = useDiscord();
const { getStreamers } = useKick();
const { logError } = useLogs();
const isOnline = useOnline();
const { open } = useStream();
const { get } = useSystem();

const styles = computed<CSSProperties>(() => ({
  flexDirection:
    general.value.orientation === Orientation.Vertical ? "column" : "row",
  gap: `${Math.round((general.value.size * general.value.gap) / 100)}px`,
}));

await listen();
listenDrag();

try {
  if (isConnected.value) {
    connectedUser.value = await connect();
  }
} catch (error) {
  await logError({ error, source: LogSource.Discord });
  connectedUser.value = null;
  isConnected.value = false;
}

async function openMainWebviewWindow() {
  try {
    const mainWebviewWindow = await getByLabel({
      label: WebviewWindowLabel.Main,
    });

    if (mainWebviewWindow) {
      await mainWebviewWindow.show();
      await mainWebviewWindow.unminimize();
      await mainWebviewWindow.setFocus();
    } else {
      await create({
        ...mainWebviewWindowOptions,
        label: WebviewWindowLabel.Main,
        canBecomeKeyWindow: true,
      });
    }
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

async function openStreamWebviewWindow(stream: Stream) {
  try {
    await open(stream);
  } catch (error) {
    await logError({ error, source: LogSource.Stream });
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
      await logError({ error, source: LogSource.Kick });
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
        const data = await get({
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
      await logError({ error, source: LogSource.System });
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
        @click="
          openStreamWebviewWindow({
            slug: streamer.slug,
            platform: StreamPlatform.Kick,
          })
        "
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
