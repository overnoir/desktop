<script setup lang="ts">
const { currentWebviewWindow, listenDrag, onDragStart } =
  useWebviewWindow().getCurrent();
const { advanced } = storeToRefs(useSettingsStore());
const { logError } = useLogs();

listenDrag();

async function destroy() {
  try {
    await currentWebviewWindow.destroy();
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

onMounted(async () => {
  try {
    await currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
    await currentWebviewWindow.show();
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
});
</script>

<template>
  <Html>
    <Body>
      <div class="border rounded-2xl">
        <LayoutTitlebar @destroy="destroy" @mousedown="onDragStart" />
        <main class="h-screen pt-8.25">
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
