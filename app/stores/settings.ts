import { isEnabled } from "@tauri-apps/plugin-autostart";

const defaultSettings: Settings = {
  orientation: Orientation.Horizontal,
  autoStart: await isEnabled(),
  locale: Locale.Turkish,
  preventCapture: false,
  ignoreCursor: false,
  theme: Theme.System,
  background: true,
  settings: true,
  opacity: 100,
  radius: 50,
  drag: true,
  size: 50,
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
