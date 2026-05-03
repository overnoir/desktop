<script setup lang="ts">
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/window";
import {
  getCurrentWebviewWindow,
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";

definePageMeta({
  layout: false,
});

const currentWebviewWindow = getCurrentWebviewWindow();
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

async function updateSize() {
  const { scrollWidth, scrollHeight } = document.body;
  await currentWebviewWindow.setSize(
    new LogicalSize(scrollWidth, scrollHeight),
  );
}

onNuxtReady(async () => {
  await updateSize();

  await currentWebviewWindow.setPosition(
    new LogicalPosition(settings.value.x, settings.value.y),
  );

  await currentWebviewWindow.onMoved(async ({ payload }) => {
    settings.value.x = payload.x;
    settings.value.y = payload.y;
  });
});

useResizeObserver(document.body, async () => {
  await updateSize();
});
</script>

<template>
  <Html
    class="rounded-lg hover:opacity-100!"
    :style="{
      opacity: `${settings.opacity}%`,
    }"
  >
    <Body class="size-max overflow-hidden">
      <main
        class="size-max rounded-lg p-0.5 gap-0.5 bg-background border-2 flex items-center"
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
        <Button
          class="select-none"
          variant="ghost"
          size="icon"
          @click="openMain"
        >
          <Icon name="lucide:settings" />
        </Button>
        <div
          v-if="settings.drag"
          class="bg-muted rounded-md size-9 grid place-items-center select-none cursor-grab active:cursor-grabbing"
          data-tauri-drag-region
        >
          <Icon name="lucide:move" class="pointer-events-none" />
        </div>
      </main>
    </Body>
  </Html>
</template>
