export const useDiscordStateStore = defineStore(
  "discord-state",
  () => {
    const errors = ref<DiscordError[]>([]);
    const connected = ref(false);

    function addError(message: DiscordError["message"]) {
      errors.value.push({
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        message,
      });
    }

    function removeError(errorId: DiscordError["id"]) {
      errors.value = errors.value.filter(({ id }) => id !== errorId);
    }

    return { connected, errors, addError, removeError };
  },
  {
    tauri: {
      save: false,
    },
  },
);
