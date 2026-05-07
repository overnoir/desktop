import { TauriPluginPinia } from "@tauri-store/pinia";
import type { Pinia } from "pinia";

export default defineNuxtPlugin(async ({ $pinia }) => {
  ($pinia as Pinia).use(
    TauriPluginPinia({
      saveOnChange: true,
      autoStart: true,
      hooks: {
        error: console.error,
      },
    }),
  );
});
