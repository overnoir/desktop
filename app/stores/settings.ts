export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<Settings>({ ...defaultSettings });

  function reset() {
    settings.value = { ...defaultSettings };
  }

  return { settings, defaultSettings, reset };
});
