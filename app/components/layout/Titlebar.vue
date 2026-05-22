<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
</script>

<template>
  <header
    class="fixed left-0 top-0 h-7.5 w-full z-50 bg-sidebar border-b flex justify-end [&>button]:h-7.5 [&>button]:rounded-none"
    data-tauri-drag-region
  >
    <Button variant="ghost" @click="currentWebviewWindow.minimize()">_</Button>
    <Button variant="ghost" @click="currentWebviewWindow.destroy()">x</Button>
  </header>
</template>
