import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { load } from "@tauri-apps/plugin-store";

export default defineNuxtPlugin(async () => {
  const { getDefaultValue, settings } = useSettings();
  const windows = await getAllWebviewWindows();
  const overlayWindow = windows.find(({ label }) => label === "overlay");
  const colorMode = useColorMode();
  const store = await load("settings.json", {
    defaults: getDefaultValue(),
  });

  settings.value = Object.fromEntries(await store.entries()) as Settings;

  watch(
    settings,
    async (newVal, oldVal) => {
      const changedKeys = Object.keys(newVal).filter(
        (key) =>
          newVal[key as keyof Settings] !== oldVal[key as keyof Settings],
      ) as (keyof Settings)[];

      for (const key of changedKeys) {
        const value = newVal[key];

        await store.set(key, value);

        if (key === "theme") {
          colorMode.preference = value as string;
        }

        if ((key === "x" || key === "y") && overlayWindow) {
          const { x, y } = newVal;
          await overlayWindow.setPosition(new LogicalPosition(x, y));
        }
      }
    },
    { deep: true },
  );
});
