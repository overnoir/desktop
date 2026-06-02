<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const isMacos = tauriOSType() === "macos";
</script>

<template>
  <header
    class="bg-sidebar **:select-none p-1 flex items-center justify-end gap-0.5 [&>button]:p-0 [&>button]:border [&>button]:bg-background [&>button]:size-5"
    :class="{
      'justify-start': isMacos,
    }"
    data-tauri-drag-region
  >
    <Button
      :class="{
        'order-1': isMacos,
      }"
      variant="ghost"
      @click="currentWebviewWindow.minimize()"
    >
      <Icon name="lucide:minus" class="size-4" />
    </Button>
    <Button variant="ghost" @click="currentWebviewWindow.destroy()">
      <Icon name="lucide:x" class="size-3.5" />
    </Button>
  </header>
</template>
