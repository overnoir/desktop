import type { State } from "@tauri-store/pinia";

function sync(state: State) {
  return {
    discordState: safeParseWithDefault(
      discordStateSchema,
      defaultDiscordState,
      state.discordState,
    ),
  };
}

export const useDiscordStateStore = defineStore(
  "discord-state",
  () => {
    const discordState = ref<DiscordState>({ ...defaultDiscordState });

    function addError(message: DiscordState["errors"][0]["message"]) {
      discordState.value.errors.push({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        message,
      });
    }

    function removeError(errorId: DiscordState["errors"][0]["id"]) {
      discordState.value.errors = discordState.value.errors.filter(
        ({ id }) => id !== errorId,
      );
    }

    function clearErrors() {
      discordState.value.errors = [];
    }

    return { discordState, addError, removeError, clearErrors };
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
