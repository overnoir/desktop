import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    streamers: kickStreamersSchema.parse(state.streamers),
    settings: kickSettingsSchema.parse(state.settings),
    streams: kickStreamsSchema.parse(state.streams),
  };
}

export const useKickStore = defineStore(
  "kick",
  () => {
    const settings = ref<KickSettings>({ ...defaultKickSettings });
    const streamers = ref<KickStreamer[]>([]);
    const streams = ref<KickStream[]>([]);

    function resetSettings() {
      settings.value = { ...defaultKickSettings };
    }

    const filtredStreamers = computed(() => {
      return [...streamers.value].sort((a, b) => {
        const aStream = streams.value?.some((s) => s.slug === a.slug) || false;
        const bStream = streams.value?.some((s) => s.slug === b.slug) || false;
        return Number(bStream) - Number(aStream);
      });
    });

    return {
      filtredStreamers,
      resetSettings,
      streamers,
      settings,
      streams,
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
