<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const { create } = useTray();

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
      opacity: `${settings.opacity}%`,
    }"
    class="rounded-lg"
  >
    <Body
      :class="{
        'bg-transparent!': settings.background === false,
      }"
      class="size-max overflow-hidden"
    >
      <main
        :class="{
          'ring ring-border ring-inset': settings.background === true,
        }"
        class="p-0.5 rounded-lg"
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
