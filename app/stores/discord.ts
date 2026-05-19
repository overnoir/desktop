export const useDiscordStore = defineStore("discord", () => {
  const discord = ref<DiscordStore>({ ...defaultDiscord });

  function reset() {
    discord.value = { ...defaultDiscord };
  }

  return { discord, defaultDiscord, reset };
});
