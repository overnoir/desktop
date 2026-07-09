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
    const battery = ref<SystemBattery | undefined>(undefined);
    const network = ref<SystemNetwork | undefined>(undefined);
    const memory = ref<SystemMemory | undefined>(undefined);
    const cpu = ref<SystemCpu | undefined>(undefined);

    function resetSettings() {
      settings.value = { ...defaultSystemSettings };
    }

    return {
      resetSettings,
      settings,
      battery,
      network,
      memory,
      cpu,
    };
  },
  {
    tauri: {
      hooks: {
        beforeFrontendSync: sync,
        beforeBackendSync: sync,
      },
      filterKeysStrategy: "pick",
      filterKeys: ["settings"],
    },
  },
);
