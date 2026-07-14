import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    settings: systemSettingsSchema.parse(state.settings),
  };
}

export const useSystemStore = defineStore(
  "system",
  () => {
    const settings = ref<SystemSettings>({ ...defaultSystemSettings });

    function resetSettings() {
      settings.value = { ...defaultSystemSettings };
    }

    return {
      resetSettings,
      settings,
    };
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
