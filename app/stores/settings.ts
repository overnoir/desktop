import { isEnabled } from "@tauri-apps/plugin-autostart";

const defaultSettings: Settings = {
  orientation: Orientation.Horizontal,
  autoStart: await isEnabled(),
  locale: Locale.Turkish,
  preventCapture: false,
  ignoreCursor: false,
  theme: Theme.System,
  background: true,
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
        beforeFrontendSync(state) {
          return {
            ...state,
            settings: safeParseWithDefault(
              settingsSchema,
              defaultSettings,
              state.settings,
            ),
          };
        },
        beforeBackendSync(state) {
          return {
            ...state,
            settings: safeParseWithDefault(
              settingsSchema,
              defaultSettings,
              state.settings,
            ),
          };
        },
      },
    },
  },
);
