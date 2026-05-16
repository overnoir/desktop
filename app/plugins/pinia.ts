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
          };
        },
        error: console.error,
      },
    }),
  );
});
