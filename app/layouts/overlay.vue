<script setup lang="ts">
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
import { invoke } from "@tauri-apps/api/core";

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const { create } = await useTray();

const radius = computed(
  () => (settings.value.size * settings.value.radius) / 100 / 2 + 3,
);

await invoke("update_ignore_cursor", { value: settings.value.ignoreCursor });
await overlayWebviewWindow.setPosition(
  new LogicalPosition(settings.value.x, settings.value.y),
);
await overlayWebviewWindow.setContentProtected(settings.value.preventCapture);
await create();

if (settings.value.autoStart !== (await isEnabled())) {
  if (settings.value.autoStart) {
    await enable();
  } else {
    await disable();
  }
}

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
      class="size-max overflow-hidden **:transition-none"
      :class="{
        'bg-transparent!': !settings.showBackground,
      }"
    >
      <main
        :class="{
          'ring ring-border ring-inset': settings.showBackground,
          'p-0.5': settings.showBackground,
        }"
        :style="{ 'border-radius': `${radius}px` }"
      >
        <slot />
      </main>
    </Body>
  </Html>
</template>
