<script setup lang="ts">
import { LogicalPosition } from "@tauri-apps/api/dpi";
import {
  WebviewWindow as WebviewWindowClass,
  getCurrentWebviewWindow,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";

definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const dragArea = ref<HTMLElement | null>(null);

const radius = computed(
  () => (settings.value.size * settings.value.radius) / 100 / 2,
);

async function openMainWebviewWindow() {
  const mainWebviewWindow = (await getAllWebviewWindows()).find(
    ({ label }) => label === WebviewWindow.Main,
  );

  if (mainWebviewWindow) {
    await mainWebviewWindow.show();
    await mainWebviewWindow.unminimize();
    await mainWebviewWindow.setFocus();
  } else {
    new WebviewWindowClass(WebviewWindow.Main, mainWebviewWindowOptions);
  }
}

useMousePressed({
  async onReleased() {
    const { x, y } = await overlayWebviewWindow.outerPosition();
    settings.value.x = x;
    settings.value.y = y;
    overlayWebviewWindow.setPosition(
      new LogicalPosition(settings.value.x + 1, settings.value.y + 1),
    );
    overlayWebviewWindow.setPosition(
      new LogicalPosition(settings.value.x, settings.value.y),
    );
  },
  async onPressed() {
    await overlayWebviewWindow.startDragging();
  },
  target: dragArea,
});
</script>

<template>
  <section
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
      class="select-none pointer-events-none"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      alt="Avatar"
    />
    <Button
      v-if="settings.showSettings"
      :class="{
        'ring ring-inset ring-border': !settings.showBackground,
      }"
      class="bg-background! active:bg-muted! select-none"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      variant="ghost"
      size="icon"
      @click="openMainWebviewWindow"
    >
      <Icon name="lucide:settings" class="size-1/2" />
    </Button>
    <Button
      v-show="settings.isDraggable"
      ref="dragArea"
      :class="{
        'ring ring-inset ring-border': !settings.showBackground,
      }"
      class="bg-background! active:bg-muted! select-none"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      variant="ghost"
      size="icon"
    >
      <Icon name="lucide:grip" class="pointer-events-none size-1/2" />
    </Button>
  </section>
</template>
