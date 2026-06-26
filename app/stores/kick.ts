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
      let items = [...streamers.value];

      if (settings.value.showOnlyLive) {
        const liveSlugs = new Set(streams.value?.map((s) => s.slug) ?? []);
        items = items.filter((s) => liveSlugs.has(s.slug));
      }

      items.sort((a, b) => {
        const aLive = streams.value?.some((s) => s.slug === a.slug) ?? false;
        const bLive = streams.value?.some((s) => s.slug === b.slug) ?? false;
        if (aLive !== bLive) return Number(bLive) - Number(aLive);
        return a.slug.localeCompare(b.slug);
      });

      return items;
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
