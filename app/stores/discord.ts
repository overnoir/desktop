import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    connectedUser: discordConnectedUserSchema.parse(state.connectedUser),
    settings: discordSettingsSchema.parse(state.settings),
    errors: discordErrorsSchema.parse(state.errors),
  };
}

export const useDiscordStore = defineStore(
  "discord",
  () => {
    const settings = ref<DiscordSettings>({ ...defaultDiscordSettings });
    const connectedUser = ref<DiscordConnectedUser | null>(null);
    const guild = ref<DiscordGuild | undefined>(undefined);
    const errors = ref<DiscordError[]>([]);

    const filtredUsers = computed(() => {
      if (!guild.value) {
        return [];
      }

      let users = guild.value.channel.users;

      if (!settings.value.showMe && connectedUser.value) {
        users = users.filter((user) => user.id !== connectedUser.value!.id);
      }

      if (settings.value.showOnlySpeakers) {
        users = users.filter((user) => user.isSpeaking);
      }

      if (settings.value.userLimit > 0) {
        users = users.slice(0, settings.value.userLimit);
      }

      return users;
    });

    function resetSettings() {
      settings.value = { ...defaultDiscordSettings };
    }

    function addError(message: DiscordError["message"]) {
      errors.value.unshift({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        message,
      });
    }

    function removeError(errorId: DiscordError["id"]) {
      errors.value = errors.value.filter(({ id }) => id !== errorId);
    }

    function clearErrors() {
      errors.value = [];
    }

    return {
      users: filtredUsers,
      connectedUser,
      resetSettings,
      removeError,
      clearErrors,
      addError,
      settings,
      guild,
      errors,
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
