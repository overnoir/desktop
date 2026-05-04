import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { load } from "@tauri-apps/plugin-store";

export default defineNuxtPlugin(async () => {
  const { getDefaultValue, settings } = useSettings();
  const windows = await getAllWebviewWindows();
  const barWindow = windows.find((w) => w.label === "bar");
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

        if ((key === "x" || key === "y") && barWindow) {
          const { x, y } = newVal;
          await barWindow.setPosition(new LogicalPosition(x, y));
        }
      }
    },
    { deep: true },
  );
});
