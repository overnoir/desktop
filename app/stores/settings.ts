export const useSettingsStore = defineStore("settings", () => {
  const { getBrowserLocale, defaultLocale } = useI18n();

  const defaultSettings: Settings = {
    locale:
      (getBrowserLocale() as Settings["locale"] | undefined) || defaultLocale,
    orientation: Orientation.Horizontal,
    theme: Theme.System,
    autoStart: false,
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
