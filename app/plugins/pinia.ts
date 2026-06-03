import type { State } from "@tauri-store/pinia";
import type { Pinia } from "pinia";

export default defineNuxtPlugin(async ({ $pinia }) => {
  function sync(state: State) {
    return {
      ...state,
      appSettings: safeParseWithDefault(
        appSettingsSchema,
        defaultAppSettings,
        state.appSettings,
      ),
      discordSettings: safeParseWithDefault(
        discordSettingsSchema,
        defaultDiscordSettings,
        state.discordSettings,
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
