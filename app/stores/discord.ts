import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    discord: safeParseWithDefault(discordSchema, defaultDiscord, state.discord),
  };
}

export const useDiscordStore = defineStore(
  "discord",
  () => {
    const discord = ref<Discord>({ ...defaultDiscord });

    const filtredUsers = computed(() => {
      const channel = discord.value.channel;

      if (!channel) {
        return [];
      }

      let users = channel.users;

      if (!discord.value.settings.showMe && discord.value.userId) {
        users = users.filter((user) => user.id !== discord.value.userId);
      }

      if (discord.value.settings.showOnlySpeakers) {
        users = users.filter((user) => user.isSpeaking);
      }

      if (discord.value.settings.userLimit > 0) {
        users = users.slice(0, discord.value.settings.userLimit);
      }

      return users;
    });

    function resetSettings() {
      discord.value.settings = { ...defaultDiscord.settings };
    }

    function addError(message: DiscordError["message"]) {
      discord.value.errors.unshift({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        message,
      });
    }

    function removeError(errorId: DiscordError["id"]) {
      discord.value.errors = discord.value.errors.filter(
        ({ id }) => id !== errorId,
      );
    }

    function clearErrors() {
      discord.value.errors = [];
    }

    return {
      users: filtredUsers,
      resetSettings,
      removeError,
      clearErrors,
      addError,
      discord,
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
