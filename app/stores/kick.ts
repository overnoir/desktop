import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    settings: kickSettingsSchema.parse(state.settings),
  };
}

export const useKickStore = defineStore(
  "kick",
  () => {
    const settings = ref<KickSettings>({ ...defaultKickSettings });

    function resetSettings() {
      settings.value = { ...defaultKickSettings };
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
