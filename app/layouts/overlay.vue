<script setup lang="ts">
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
import { invoke } from "@tauri-apps/api/core";
import { type } from "@tauri-apps/plugin-os";
import {
  getCurrentWebviewWindow,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";

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

if (type() === "macos") {
  await invoke("init_macos");
  await invoke("set_nspanel_ignore_cursor", {
    value: settings.value.ignoreCursor,
  });
}

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

onMounted(async () => {
  const updaterWebviewWindow = (await getAllWebviewWindows()).find(
    ({ label }) => label === WebviewWindow.Updater,
  );

  if (updaterWebviewWindow) {
    await updaterWebviewWindow.destroy();
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
