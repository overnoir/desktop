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
    const battery = ref<SystemBattery | null>(null);
    const network = ref<SystemNetwork | null>(null);
    const memory = ref<SystemMemory | null>(null);
    const cpu = ref<SystemCpu | null>(null);

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
