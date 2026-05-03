import { load } from "@tauri-apps/plugin-store";

export default defineNuxtPlugin(async () => {
  const { defaultValues, settings } = useSettings();
  const store = await load("settings.json", {
    defaults: defaultValues,
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
      }
    }
  });
});
