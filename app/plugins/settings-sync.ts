import { LogicalPosition } from "@tauri-apps/api/dpi";
import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { load } from "@tauri-apps/plugin-store";

export default defineNuxtPlugin(async () => {
  const { getDefaultValue, settings } = useSettings();
  const allWebviewWindows = await getAllWebviewWindows();
  const barWebviewWindow = allWebviewWindows.find(
    ({ label }) => label === "bar",
  );

  const store = await load("settings.json", {
    defaults: getDefaultValue(),
  });
  const colorMode = useColorMode();

  settings.value = Object.fromEntries(await store.entries()) as Settings;

  watch(settings, async (newVal, oldVal) => {
    for (const key in newVal) {
      const typedKey = key as keyof Settings;

      if (newVal[typedKey] !== oldVal[typedKey]) {
        await store.set(typedKey, newVal[typedKey]);
        if (typedKey === "theme") {
          colorMode.preference = newVal[typedKey];
        }
        if ((typedKey === "x" || typedKey === "y") && barWebviewWindow) {
          await barWebviewWindow.setPosition(
            new LogicalPosition(settings.value.x, settings.value.y),
          );
        }
      }
    }
  });
});
