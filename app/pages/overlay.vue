<script setup lang="ts">
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
  },
  async onPressed() {
    await overlayWebviewWindow.startDragging();
  },
  target: dragArea,
});

const iconStyle = computed(() => ({
  height: `${settings.value.size / 2.2}px`,
  width: `${settings.value.size / 2.2}px`,
}));

const squareStyle = computed(() => ({
  height: `${settings.value.size}px`,
  width: `${settings.value.size}px`,
}));
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
      class="rounded-lg select-none pointer-events-none"
      :style="squareStyle"
      alt="Avatar"
    />
    <Button
      :style="squareStyle"
      class="select-none"
      variant="ghost"
      size="icon"
      @click="open"
    >
      <Icon name="lucide:settings" :style="iconStyle" />
    </Button>
    <Button
      v-show="settings.drag"
      ref="dragArea"
      class="select-none cursor-grab active:cursor-grabbing"
      :style="squareStyle"
      variant="ghost"
    >
      <Icon name="lucide-grip" class="pointer-events-none" :style="iconStyle" />
    </Button>
  </div>
</template>
