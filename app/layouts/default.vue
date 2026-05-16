<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import "vue-sonner/style.css";

const { settings } = storeToRefs(useSettingsStore());
const mainWebviewWindow = getCurrentWebviewWindow();

await mainWebviewWindow.setContentProtected(settings.value.preventCapture);
</script>

<template>
  <div class="flex min-h-screen">
    <LayoutTitlebar />
    <LayoutNavbar />
    <main class="p-4 pt-11 w-full">
      <slot />
    </main>
    <Toaster />
  </div>
</template>
