<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const { create } = useTray();

const radius = computed(
  () => (settings.value.size * settings.value.radius) / 100 / 2 + 3,
);

await overlayWebviewWindow.setPosition(
  new LogicalPosition(settings.value.x, settings.value.y),
);

await create();

useResizeObserver(document.body, async (entries) => {
  const rect = entries[0]?.contentRect;
  if (rect) {
    await overlayWebviewWindow.setSize(
      new LogicalSize(rect.width, rect.height),
    );
  }
});
</script>

<template>
  <Html
    :style="{
      'border-radius': `${radius}px`,
      opacity: `${settings.opacity}%`,
    }"
  >
    <Body
      :class="{
        'bg-transparent!': settings.background === false,
      }"
      class="size-max overflow-hidden **:select-none **:transition-none"
    >
      <main
        :class="{
          'ring ring-border ring-inset': settings.background === true,
          'p-0.5': settings.background,
        }"
        :style="{ 'border-radius': `${radius}px` }"
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
