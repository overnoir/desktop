export const useAppSettingsStore = defineStore("app-settings", () => {
  const appSettings = ref<AppSettings>({ ...defaultAppSettings });

  function reset() {
    appSettings.value = { ...defaultAppSettings };
  }

  return { appSettings, reset };
});
