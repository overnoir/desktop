export const useDiscordSettingsStore = defineStore("discord-settings", () => {
  const discordSettings = ref<DiscordSettings>({ ...defaultDiscordSettings });

  function reset() {
    discordSettings.value = { ...defaultDiscordSettings };
  }

  return { discordSettings, reset };
});
