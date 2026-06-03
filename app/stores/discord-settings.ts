import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    discordSettings: safeParseWithDefault(
      discordSettingsSchema,
      defaultDiscordSettings,
      state.discordSettings,
    ),
  };
}

export const useDiscordSettingsStore = defineStore(
  "discord-settings",
  () => {
    const discordSettings = ref<DiscordSettings>({ ...defaultDiscordSettings });

    function reset() {
      discordSettings.value = { ...defaultDiscordSettings };
    }

    return { discordSettings, reset };
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
