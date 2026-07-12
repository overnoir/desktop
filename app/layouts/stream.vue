<script setup lang="ts">
const { currentWebviewWindow, listenDrag, onDragStart } =
  useWebviewWindow().getCurrent();
const { advanced } = storeToRefs(useSettingsStore());

listenDrag();

onMounted(async () => {
  await currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
  await currentWebviewWindow.show();
});
</script>

<template>
  <Html>
    <Body>
      <div class="border rounded-2xl">
        <LayoutTitlebar
          @destroy="currentWebviewWindow.destroy"
          @mousedown="onDragStart"
        />
        <main class="h-screen pt-8.25">
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
