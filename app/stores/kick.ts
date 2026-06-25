import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    streamers: kickStreamersSchema.parse(state.streamers),
    settings: kickSettingsSchema.parse(state.settings),
  };
}

export const useKickStore = defineStore(
  "kick",
  () => {
    const settings = ref<KickSettings>({ ...defaultKickSettings });
    const streamers = ref<KickStreamer[]>([]);

    function resetSettings() {
      settings.value = { ...defaultKickSettings };
    }

    return {
      resetSettings,
      streamers,
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
