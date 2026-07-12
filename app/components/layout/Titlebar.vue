<script setup lang="ts">
const currentWebviewWindow = useWebviewWindow().getCurrent();
const { onDragStart, listenDrag } = useWebviewWindowDrag();
const isMacOS = tauriOSType() === "macos";

listenDrag();
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 h-8.25 flex items-center z-99 **:select-none pointer-events-auto"
    :class="{ 'flex-row-reverse': !isMacOS }"
    @mousedown="onDragStart"
  >
    <div
      class="flex"
      :class="{
        'pl-2.25 [&>button]:bg-secondary [&>button]:transition-none! [&>button]:size-4! [&>button]:p-0! [&>button]:rounded-full! [&>button]:border! [&_svg]:size-2.5! [&_svg]:hidden hover:[&_svg]:flex':
          isMacOS,
        '[&>button]:rounded-none [&>button]:h-full': !isMacOS,
      }"
    >
      <Button
        :class="{ 'hover:bg-red-600': !isMacOS }"
        variant="ghost"
        @click="currentWebviewWindow.destroy"
      >
        <Icon name="lucide:x" />
      </Button>
    </div>
  </div>
</template>
