const defaultSettings: Settings = {
  orientation: Orientation.Horizontal,
  locale: Locale.Turkish,
  theme: Theme.System,
  autoStart: false,
  opacity: 100,
  drag: true,
  size: 40,
  x: 0,
  y: 0,
};

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const settings = ref<Settings>({ ...defaultSettings });

    function reset() {
      settings.value = { ...defaultSettings };
    }

    return { settings, reset, defaultSettings };
  },
  {
    tauri: {
      hooks: {
        beforeFrontendSync({ settings }) {
          return safeParseWithDefault(
            settingsSchema,
            defaultSettings,
            settings,
          );
        },
        beforeBackendSync({ settings }) {
          return safeParseWithDefault(
            settingsSchema,
            defaultSettings,
            settings,
          );
        },
      },
    },
  },
);
