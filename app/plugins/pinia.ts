import type { Pinia } from "pinia";

export default defineNuxtPlugin(async ({ $pinia }) => {
  ($pinia as Pinia).use(
    TauriPiniaTauriPluginPinia({
      saveStrategy: "debounce",
      saveOnChange: true,
      saveInterval: 500,
      autoStart: true,
      hooks: {
        beforeFrontendSync(state) {
          return {
            ...state,
            settings: safeParseWithDefault(
              settingsSchema,
              defaultSettings,
              state.settings,
            ),
            discord: safeParseWithDefault(
              discordSchema,
              defaultDiscord,
              state.discord,
            ),
          };
        },
        beforeBackendSync(state) {
          return {
            ...state,
            settings: safeParseWithDefault(
              settingsSchema,
              defaultSettings,
              state.settings,
            ),
            discord: safeParseWithDefault(
              discordSchema,
              defaultDiscord,
              state.discord,
            ),
          };
        },
        error: console.error,
      },
    }),
  );
});
