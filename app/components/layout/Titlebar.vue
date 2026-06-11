<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const isMacos = tauriOSType() === "macos";
</script>

<template>
  <header
    class="bg-secondary h-7 flex items-center justify-end [&>button]:h-full [&>button]:rounded-none"
    :class="{
      'px-1 gap-0.5 justify-start [&_svg]:size-3! [&>button]:select-none [&>button]:rounded-full! [&>button]:p-0 [&>button]:border [&>button]:bg-background [&>button]:size-5!':
        isMacos,
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
      <Icon name="lucide:minus" />
    </Button>
    <Button variant="ghost" @click="currentWebviewWindow.destroy()">
      <Icon name="lucide:x" />
    </Button>
  </header>
</template>
