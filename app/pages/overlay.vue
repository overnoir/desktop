<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition } from "@tauri-apps/api/dpi";

definePageMeta({
  layout: "overlay",
});

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const dragArea = ref<HTMLElement | null>(null);
const { open } = useMainWebviewWindow();

const radius = computed(
  () => (settings.value.size * settings.value.radius) / 100 / 2,
);

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
      class="select-none pointer-events-none"
      :style="{
        'border-radius': `${radius}px`,
        height: `${settings.size}px`,
        width: `${settings.size}px`,
      }"
      alt="Avatar"
    />
    <Button
      v-if="settings.settings"
      :class="{
        'ring ring-inset ring-border': settings.background === false,
      }"
      class="select-none bg-background! active:bg-muted!"
      :style="{
        'border-radius': `${radius}px`,
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
      :class="{
        'ring ring-inset ring-border': settings.background === false,
      }"
      class="select-none bg-background! active:bg-muted!"
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
