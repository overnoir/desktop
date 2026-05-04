<script setup lang="ts">
import {
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";

definePageMeta({
  layout: "bar",
});

const { settings } = useSettings();

async function openMain() {
  const allWebviewWindows = await getAllWebviewWindows();
  const mainWebviewWindow = allWebviewWindows.find(
    ({ label }) => label === "main",
  );
  if (mainWebviewWindow) {
    await mainWebviewWindow.show();
  } else {
    new WebviewWindow("main");
  }
}
</script>

<template>
  <div
    class="flex items-center gap-0.5"
    :class="{
      'flex-row': settings.orientation === 'horizontal',
      'flex-col': settings.orientation === 'vertical',
    }"
  >
    <NuxtImg
      v-for="i in 3"
      :key="i"
      src="https://avatars.githubusercontent.com/u/121391005?v=4"
      class="size-9 rounded-lg select-none pointer-events-none"
      alt="Avatar"
    />
    <Button class="select-none" variant="ghost" size="icon" @click="openMain">
      <Icon name="lucide:settings" />
    </Button>
    <div
      v-if="settings.drag"
      class="bg-muted rounded-md size-9 grid place-items-center select-none cursor-grab active:cursor-grabbing"
      data-tauri-drag-region
    >
      <Icon name="lucide:move" class="pointer-events-none" />
    </div>
  </div>
</template>
