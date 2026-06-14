<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const isMacOS = tauriOSType() === "macos";
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 h-8.25 flex items-center justify-between z-50 **:select-none"
    data-tauri-drag-region
    :class="{ 'flex-row-reverse': !isMacOS }"
  >
    <div
      class="flex"
      :class="{
        'pl-2.25 flex-row-reverse gap-2 [&>button]:bg-secondary [&>button]:transition-none! [&>button]:size-4! [&>button]:p-0! [&>button]:rounded-full! [&>button]:border! [&_svg]:size-2.5! [&_svg]:hidden hover:[&_svg]:flex':
          isMacOS,
        '[&>button]:rounded-none [&>button]:h-full': !isMacOS,
      }"
    >
      <template v-if="isMacOS">
        <Button variant="ghost" @click="currentWebviewWindow.maximize()">
          <Icon name="lucide:chevrons-left-right" class="rotate-45" />
        </Button>
        <Button variant="ghost" @click="currentWebviewWindow.minimize()">
          <Icon name="lucide:minus" />
        </Button>
      </template>
      <template v-else>
        <Button variant="ghost" @click="currentWebviewWindow.minimize()">
          <Icon name="lucide:minus" />
        </Button>
        <Button variant="ghost" @click="currentWebviewWindow.maximize()">
          <Icon name="lucide:square" class="scale-80" />
        </Button>
      </template>
      <Button
        :class="{ 'hover:bg-red-600': !isMacOS }"
        variant="ghost"
        @click="currentWebviewWindow.destroy()"
      >
        <Icon name="lucide:x" />
      </Button>
    </div>
  </div>
</template>
