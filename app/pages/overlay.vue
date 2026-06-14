<script setup lang="ts">
import { PhysicalPosition } from "@tauri-apps/api/dpi";

definePageMeta({
  layout: "overlay",
});

const { users, channel, settings } = storeToRefs(useDiscordStore());
const { general } = storeToRefs(useSettingsStore());
const isMacOS = tauriOSType() === "macos";
const { overlayStyles } = useUi();
const dragButton = ref();

async function openMainWebviewWindow() {
  const mainWebviewWindow = (
    await tauriWebviewWindowGetAllWebviewWindows()
  ).find(({ label }) => label === WebviewWindow.Main);

  if (mainWebviewWindow) {
    await mainWebviewWindow.show();
    await mainWebviewWindow.unminimize();
    await mainWebviewWindow.setFocus();
  } else {
    new TauriWebviewWindowWebviewWindow(
      WebviewWindow.Main,
      mainWebviewWindowOptions,
    );
  }
}

if (isMacOS) {
  const overlayWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
  const isDragging = ref(false);
  const offsetX = ref(0);
  const offsetY = ref(0);

  useEventListener(dragButton, "mousedown", async (e) => {
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();

    const pos = await overlayWebviewWindow.outerPosition();

    offsetX.value = e.screenX - pos.x;
    offsetY.value = e.screenY - pos.y;
    isDragging.value = true;
  });

  useEventListener(window, "mousemove", async (e) => {
    if (!isDragging.value) {
      return;
    }

    overlayWebviewWindow.setPosition(
      new PhysicalPosition(
        e.screenX - offsetX.value,
        e.screenY - offsetY.value,
      ),
    );
  });

  useEventListener(window, "mouseup", async () => {
    isDragging.value = false;
  });
}
</script>

<template>
  <section
    :class="{
      'flex-col': general.orientation === Orientation.Vertical,
    }"
    :style="{
      gap: overlayStyles.gap,
    }"
    class="flex"
  >
    <DiscordChannel
      v-if="channel && settings.showGuild"
      :channel="{
        guildIconUrl: channel.guildIconUrl,
        guildName: channel.guildName,
        name: channel.name,
      }"
    />
    <DiscordUser v-for="user in users" :key="user.id" :user />
    <Button
      v-if="general.showSettings"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      class="bg-background!"
      variant="outline"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:sliders-horizontal" class="size-1/2" />
    </Button>
    <Button
      v-if="general.showDrag"
      ref="dragButton"
      :style="{
        borderRadius: overlayStyles.borderRadius,
        height: overlayStyles.size,
        width: overlayStyles.size,
      }"
      :data-tauri-drag-region="!isMacOS"
      class="bg-background!"
      variant="outline"
      size="icon"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
