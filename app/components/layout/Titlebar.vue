<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
</script>

<template>
  <header
    class="bg-sidebar **:select-none p-1 flex items-center justify-end gap-0.5 [&_svg]:size-3.5! [&>button]:p-0 [&>button]:border [&>button]:bg-background [&>button]:size-6 [&>button]:rounded-full"
    data-tauri-drag-region
  >
    <Button variant="ghost" @click="currentWebviewWindow.minimize()">
      <Icon name="lucide:minus" />
    </Button>
    <Button variant="ghost" @click="currentWebviewWindow.destroy()">
      <Icon name="lucide:x" />
    </Button>
  </header>
</template>
