<script setup lang="ts">
import type { CSSProperties } from "vue";

definePageMeta({
  layout: "overlay",
});

const discordStore = useDiscordStore();
const { filtredUsers, guild, settings, connectedUser, isConnected } =
  storeToRefs(discordStore);
const { filtredStreamers, streamers } = storeToRefs(useKickStore());
const { getByLabel, getCurrent, create } = useWebviewWindow();
const { onDragStart, listenDrag } = getCurrent();
const { general } = storeToRefs(useSettingsStore());
const { connect, listen } = useDiscord();
const { getStreamers } = useKick();
const { logError } = useLogs();
const isOnline = useOnline();
const { open } = useStream();
const { get } = useSystem();
const {
  settings: systemSettings,
  battery,
  network,
  memory,
  cpu,
} = storeToRefs(useSystemStore());

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
        network.value = data.network;
        battery.value = data.battery;
        memory.value = data.memory;
        cpu.value = data.cpu;
      }
    } catch (error) {
      await logError({ error, source: LogSource.System });
      network.value = null;
      battery.value = null;
      memory.value = null;
      cpu.value = null;
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
            platform: StreamPlatform.Kick,
            slug: streamer.slug,
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
