import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    connectedUser: discordConnectedUserSchema.parse(state.connectedUser),
    isConnected: discordIsConnectedSchema.parse(state.isConnected),
    clientId: discordClientIdSchema.parse(state.clientId),
    settings: discordSettingsSchema.parse(state.settings),
  };
}

export const useDiscordStore = defineStore(
  "discord",
  () => {
    const settings = ref<DiscordSettings>({ ...defaultDiscordSettings });
    const connectedUser = shallowRef<DiscordConnectedUser | null>(null);
    const isConnected = shallowRef<boolean>(false);
    const clientId = shallowRef<string>("");

    function resetSettings() {
      settings.value = { ...defaultDiscordSettings };
    }

    return {
      connectedUser,
      resetSettings,
      isConnected,
      clientId,
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
