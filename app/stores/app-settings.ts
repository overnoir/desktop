import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    appSettings: safeParseWithDefault(
      appSettingsSchema,
      defaultAppSettings,
      state.appSettings,
    ),
  };
}

export const useAppSettingsStore = defineStore(
  "app-settings",
  () => {
    const appSettings = ref<AppSettings>({ ...defaultAppSettings });

    function reset() {
      appSettings.value = { ...defaultAppSettings };
    }

    return { appSettings, reset };
  },
  {
    tauri: {
      hooks: {
        beforeFrontendSync: sync,
        beforeBackendSync: sync,
      },
    },
  },
);
