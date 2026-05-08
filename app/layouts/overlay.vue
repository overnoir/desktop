<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { exit } from "@tauri-apps/plugin-process";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";

const overlayWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const tray = await TrayIcon.getById("radar");
const { open } = useMainWebviewWindow();
const { t } = useI18n();

if (!tray) {
  await TrayIcon.new({
    icon: (await defaultWindowIcon()) || undefined,
    id: "radar",
    menu: await Menu.new({
      items: [
        {
          text: t("tray.settings"),
          id: "settings",
          action: open,
        },
        {
          action: () => exit(),
          text: t("tray.quit"),
          id: "quit",
        },
      ],
    }),
  });
}

useResizeObserver(document.body, async (entries) => {
  const rect = entries[0]?.contentRect;
  if (rect) {
    await overlayWebviewWindow.setSize(
      new LogicalSize(rect.width, rect.height),
    );
  }
});

onNuxtReady(async () => {
  await overlayWebviewWindow.setPosition(
    new LogicalPosition(settings.value.x, settings.value.y),
  );
});
</script>

<template>
  <Html
    class="hover:opacity-100! rounded-lg"
    :style="{
      opacity: `${settings.opacity}%`,
    }"
  >
    <Body class="size-max overflow-hidden">
      <main class="p-0.5 border rounded-lg">
        <slot />
      </main>
    </Body>
  </Html>
</template>
