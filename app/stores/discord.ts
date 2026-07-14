import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    connectedUser: discordConnectedUserSchema.parse(state.connectedUser),
    isConnected: isConnectedSchema.parse(state.isConnected),
    settings: discordSettingsSchema.parse(state.settings),
  };
}

export const useDiscordStore = defineStore(
  "discord",
  () => {
    const settings = ref<DiscordSettings>({ ...defaultDiscordSettings });
    const connectedUser = ref<DiscordConnectedUser | null>(null);
    const isConnected = ref<boolean>(false);

    function resetSettings() {
      settings.value = { ...defaultDiscordSettings };
    }

    return {
      connectedUser,
      resetSettings,
      isConnected,
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
