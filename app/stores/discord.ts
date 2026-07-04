import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    connectedUser: discordConnectedUserSchema.parse(state.connectedUser),
    settings: discordSettingsSchema.parse(state.settings),
  };
}

export const useDiscordStore = defineStore(
  "discord",
  () => {
    const settings = ref<DiscordSettings>({ ...defaultDiscordSettings });
    const connectedUser = ref<DiscordConnectedUser | null>(null);
    const guild = ref<DiscordGuild | undefined>(undefined);

    const filtredUsers = computed(() => {
      if (!guild.value || !connectedUser.value) {
        return [];
      }

      let users = guild.value.channel.users;

      if (!settings.value.showMe) {
        users = users.filter(({ id }) => id !== connectedUser.value!.id);
      }

      if (settings.value.showSpeakersOnly) {
        users = users.filter(({ isSpeaking }) => isSpeaking);
      }

      if (!settings.value.showMutedUsers) {
        users = users.filter(
          ({ isMuted, isSelfMuted, isSuppress }) =>
            !isMuted && !isSelfMuted && !isSuppress,
        );
      }

      if (!settings.value.showDeafenedUsers) {
        users = users.filter(
          ({ isDeafened, isSelfDeafened }) => !isDeafened && !isSelfDeafened,
        );
      }

      if (!settings.value.showBots) {
        users = users.filter(({ isBot }) => !isBot);
      }

      users.sort((a, b) => {
        if (a.isSpeaking !== b.isSpeaking) {
          return a.isSpeaking ? -1 : 1;
        }

        const aMuted = a.isMuted || a.isSelfMuted;
        const bMuted = b.isMuted || b.isSelfMuted;

        if (aMuted !== bMuted) {
          return aMuted ? 1 : -1;
        }

        if (a.isBot !== b.isBot) {
          return a.isBot ? 1 : -1;
        }

        const aName = generateDiscordUserDisplayName({
          user: a,
          displayName: settings.value.displayName,
        }).toLowerCase();

        const bName = generateDiscordUserDisplayName({
          user: b,
          displayName: settings.value.displayName,
        }).toLowerCase();

        return aName.localeCompare(bName);
      });

      if (settings.value.userLimit > 0) {
        users = users.slice(0, settings.value.userLimit);
      }

      return users;
    });

    function resetSettings() {
      settings.value = { ...defaultDiscordSettings };
    }

    return {
      connectedUser,
      resetSettings,
      filtredUsers,
      settings,
      guild,
    };
  },
  {
    tauri: {
      hooks: {
        beforeFrontendSync: sync,
        beforeBackendSync: sync,
      },
      filterKeys: ["guild"],
    },
  },
);
