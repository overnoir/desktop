import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    advanced: settingsAdvancedSchema.parse(state.advanced),
    ui: settingsUISchema.parse(state.ui),
  };
}

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const advanced = ref<SettingsAdvanced>({ ...defaultSettingsAdvanced });
    const ui = ref<SettingsUI>({ ...defaultSettingsUI });

    function reset() {
      advanced.value = { ...defaultSettingsAdvanced };
      ui.value = { ...defaultSettingsUI };
    }

    return { advanced, ui, reset };
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
