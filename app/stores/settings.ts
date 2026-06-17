import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    advanced: settingsAdvancedSchema.parse(state.advanced),
    general: settingsGeneralSchema.parse(state.general),
  };
}

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const advanced = ref<SettingsAdvanced>({ ...defaultSettingsAdvanced });
    const general = ref<SettingsGeneral>({ ...defaultSettingsGeneral });

    function reset() {
      advanced.value = { ...defaultSettingsAdvanced };
      general.value = { ...defaultSettingsGeneral };
    }

    return { advanced, general, reset };
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
