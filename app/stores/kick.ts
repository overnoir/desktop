import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    channels: kickChannelsSchema.parse(state.channels),
    settings: kickSettingsSchema.parse(state.settings),
  };
}

export const useKickStore = defineStore(
  "kick",
  () => {
    const settings = ref<KickSettings>({ ...defaultKickSettings });
    const channels = ref<KickChannel[]>([]);

    function resetSettings() {
      settings.value = { ...defaultKickSettings };
    }

    const filtredChannels = computed(() => {
      let items = [...channels.value];

      if (settings.value.showOnlyLive) {
        items = items.filter((s) => s.livestream);
      }

      items.sort((a, b) => {
        const aLive = !!a.livestream;
        const bLive = !!b.livestream;
        if (aLive !== bLive) return Number(bLive) - Number(aLive);
        return a.slug.localeCompare(b.slug);
      });

      return items;
    });

    return {
      filtredChannels,
      resetSettings,
      channels,
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
