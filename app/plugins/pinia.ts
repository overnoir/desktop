import type { State } from "@tauri-store/pinia";
import type { Pinia } from "pinia";

export default defineNuxtPlugin(async ({ $pinia }) => {
  function sync(state: State) {
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
  }

  ($pinia as Pinia).use(
    TauriPiniaTauriPluginPinia({
      saveStrategy: "debounce",
      saveOnChange: true,
      saveInterval: 500,
      autoStart: true,
      hooks: {
        beforeFrontendSync: sync,
        beforeBackendSync: sync,
        error: console.error,
      },
    }),
  );
});
