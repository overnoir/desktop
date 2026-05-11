<script setup lang="ts">
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const dragArea = ref<HTMLElement | null>(null);
const { open } = useMainWebviewWindow();

useMousePressed({
  async onReleased() {
    const { x, y } = await overlayWebviewWindow.outerPosition();
    settings.value.x = x;
    settings.value.y = y;
    overlayWebviewWindow.setPosition(new LogicalPosition(x + 1, y + 1));
    overlayWebviewWindow.setPosition(new LogicalPosition(x, y));
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
      class="rounded-lg select-none pointer-events-none"
      :style="{
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      alt="Avatar"
    />
    <Button
      class="select-none hover:bg-transparent dark:hover:bg-transparent active:bg-accent dark:active:bg-accent/50"
      :class="{
        'ring ring-border ring-inset': settings.background === false,
      }"
      :style="{
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      variant="ghost"
      size="icon"
      @click="open"
    >
      <Icon name="lucide:settings" class="size-1/2" />
    </Button>
    <Button
      v-show="settings.drag"
      ref="dragArea"
      class="select-none hover:bg-transparent dark:hover:bg-transparent active:bg-accent dark:active:bg-accent/50"
      :class="{
        'ring ring-border ring-inset': settings.background === false,
      }"
      :style="{
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
