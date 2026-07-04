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

async function generateWebviewWindowPosition(width: number, height: number) {
  const position = await overlayWebviewWindow.outerPosition();
  const size = await overlayWebviewWindow.outerSize();
  const monitor = await tauriWindowCurrentMonitor();
  const gap = 10;
  let x = 0;
  let y = 0;

  if (general.value.orientation === Orientation.Vertical) {
    if (monitor) {
      const rightX = position.x + size.width + gap;
      const leftX = position.x - width - gap;
      const monitorRight = monitor.position.x + monitor.size.width;
      const monitorLeft = monitor.position.x;

      if (rightX + width <= monitorRight) {
        x = rightX;
      } else if (leftX >= monitorLeft) {
        x = leftX;
      } else {
        x = rightX;
      }
    } else {
      x = position.x + size.width + gap;
    }

    y = position.y;
  }

  if (general.value.orientation === Orientation.Horizontal) {
    if (monitor) {
      const monitorBottom = monitor.position.y + monitor.size.height;
      const bottomY = position.y + size.height + gap;
      const topY = position.y - height - gap;
      const monitorTop = monitor.position.y;

      if (bottomY + height <= monitorBottom) {
        y = bottomY;
      } else if (topY >= monitorTop) {
        y = topY;
      } else {
        y = bottomY;
      }
    } else {
      y = position.y + size.height + gap;
    }

    x = position.x;
  }

  return { x, y };
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

  const { x, y } = await generateWebviewWindowPosition(
    streamWebviewWindowOptions.width!,
    streamWebviewWindowOptions.height!,
  );

  new TauriWebviewWindowWebviewWindow(WebviewWindowLabel.Stream, {
    ...streamWebviewWindowOptions,
    url: `/stream?slug=${slug}`,
    x,
    y,
  });
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
    const { x, y } = await generateWebviewWindowPosition(
      mainWebviewWindowOptions.width!,
      mainWebviewWindowOptions.height!,
    );

    new TauriWebviewWindowWebviewWindow(WebviewWindowLabel.Main, {
      ...mainWebviewWindowOptions,
      x,
      y,
    });
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
    <OverlaySystemNetwork
      v-if="systemSettings.showNetwork && network"
      :network
    />
    <OverlaySystemBattery
      v-if="systemSettings.showBattery && battery"
      :battery
    />
    <OverlayOffline v-if="!isOnline" />
    <OverlaySettings
      v-if="general.showSettings"
      @click="openMainWebviewWindow"
    />
    <OverlayDrag v-if="general.showDrag" @mousedown="onDragStart" />
  </section>
</template>
