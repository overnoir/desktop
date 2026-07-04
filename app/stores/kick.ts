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

    const filtredStreamers = computed(() => {
      let items = [...streamers.value];

      if (settings.value.showOnlyLive) {
        items = items.filter(({ stream }) => stream.isLive);
      }

      items.sort((a, b) => {
        const aLive = !!a.stream.isLive;
        const bLive = !!b.stream.isLive;

        if (aLive !== bLive) {
          return Number(bLive) - Number(aLive);
        }

        return a.name.localeCompare(b.name);
      });

      items = items.slice(0, settings.value.streamerLimit);

      return items;
    });

    return {
      filtredStreamers,
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
