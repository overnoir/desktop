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
    <Button class="select-none" variant="ghost" size="icon" @click="open">
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
