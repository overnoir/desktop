export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<SettingsStore>({ ...defaultSettings });

  function reset() {
    settings.value = { ...defaultSettings };
  }

  return { settings, defaultSettings, reset };
});
