<script setup lang="ts">
import { LogicalPosition, LogicalSize } from "@tauri-apps/api/dpi";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { exit } from "@tauri-apps/plugin-process";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import {
  getCurrentWebviewWindow,
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";

const currentWebviewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const tray = await TrayIcon.getById("radar");
const { t } = useI18n();

if (!tray) {
  await TrayIcon.new({
    id: "radar",
    icon: (await defaultWindowIcon()) || undefined,
    menu: await Menu.new({
      items: [
        {
          id: "settings",
          text: t("tray.settings"),
          action: async () => {
            const allWebviewWindows = await getAllWebviewWindows();
            const mainWebviewWindow = allWebviewWindows.find(
              ({ label }) => label === "main",
            );
            if (mainWebviewWindow) {
              await mainWebviewWindow.unminimize();
              await mainWebviewWindow.show();
              await mainWebviewWindow.setFocus();
            } else {
              const window = new WebviewWindow("main", {
                backgroundColor: "#ff0000",
              });
              window.once("initialized", async () => {
                await window.unminimize();
                await window.show();
                await window.setFocus();
              });
            }
          },
        },
        {
          id: "quit",
          text: t("tray.quit"),
          action: async () => {
            await exit();
          },
        },
      ],
    }),
  });
}

useResizeObserver(document.body, async (entries) => {
  const rect = entries[0]?.contentRect;
  if (rect) {
    await currentWebviewWindow.setSize(
      new LogicalSize(rect.width, rect.height),
    );
  }
});

onNuxtReady(async () => {
  await currentWebviewWindow.setPosition(
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
