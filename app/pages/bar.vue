<script setup lang="ts">
import {
  getCurrentWebviewWindow,
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";

definePageMeta({
  layout: "bar",
});

const dragArea = ref<HTMLElement | null>(null);
const window = getCurrentWebviewWindow();
const { settings } = useSettings();

async function openMain() {
  const allWebviewWindows = await getAllWebviewWindows();
  const mainWebviewWindow = allWebviewWindows.find(
    ({ label }) => label === "main",
  );
  if (mainWebviewWindow) {
    await mainWebviewWindow.unminimize();
    await mainWebviewWindow.show();
    await mainWebviewWindow.setFocus();
  } else {
    const window = new WebviewWindow("main");
    await window.unminimize();
    await window.show();
    await window.setFocus();
  }
}

useMousePressed({
  async onReleased() {
    const { x, y } = await window.outerPosition();
    settings.value.x = x;
    settings.value.y = y;
  },
  async onPressed() {
    await window.startDragging();
  },
  target: dragArea,
});
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
      v-show="settings.drag"
      ref="dragArea"
      class="bg-muted rounded-md grid place-items-center select-none cursor-grab active:cursor-grabbing"
      :class="{
        'h-9 w-6': settings.orientation === 'horizontal',
        'h-6 w-9': settings.orientation === 'vertical',
      }"
    >
      <Icon
        :name="
          settings.orientation === 'horizontal'
            ? 'lucide:grip-vertical'
            : 'lucide:grip-horizontal'
        "
        class="pointer-events-none"
      />
    </div>
  </div>
</template>
