import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    settings: settingsSchema.parse(state.settings),
  };
}

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const settings = ref<Settings>({ ...defaultSettings });

    function reset() {
      settings.value = { ...defaultSettings };
    }

    return { settings, reset };
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
