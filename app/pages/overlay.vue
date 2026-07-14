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
const { general } = storeToRefs(useSettingsStore());
const { onDragStart, listenDrag } = getCurrent();
const { connect, listen } = useDiscord();
const { resume, system } = useSystem();
const { getStreamers } = useKick();
const { logError } = useLogs();
const isOnline = useOnline();
const { open } = useStream();

const styles = computed<CSSProperties>(() => ({
  flexDirection:
    general.value.orientation === Orientation.Vertical ? "column" : "row",
  gap: `${Math.round((general.value.size * general.value.gap) / 100)}px`,
}));

await listen();
listenDrag();
resume();

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
    <OverlaySystemCpu v-if="system?.cpu" :cpu="system.cpu" />
    <OverlaySystemMemory v-if="system?.memory" :memory="system.memory" />
    <OverlaySystemBattery v-if="system?.battery" :battery="system.battery" />
    <OverlaySystemNetwork v-if="system?.network" :network="system.network" />
    <OverlayOffline v-if="!isOnline" />
    <OverlaySettings
      v-if="general.showSettings"
      @click="openMainWebviewWindow"
    />
    <OverlayDrag v-if="general.showDrag" @mousedown="onDragStart" />
  </section>
</template>
