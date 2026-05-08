export const useSettingsStore = defineStore("settings", () => {
  const defaultSettings: Settings = {
    orientation: "horizontal",
    theme: "system",
    opacity: 100,
    drag: true,
    size: 36,
    x: 0,
    y: 0,
  };

  const settings = ref<Settings>({ ...defaultSettings });

  function reset() {
    settings.value = { ...defaultSettings };
  }

  return { settings, reset };
});
