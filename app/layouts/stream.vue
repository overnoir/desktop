<script setup lang="ts">
const currentWebviewWindow = useWebviewWindow().getCurrent();
const { advanced } = storeToRefs(useSettingsStore());
const { logError } = useLogs();

async function destroy() {
  try {
    await currentWebviewWindow.destroy();
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop),
      currentWebviewWindow.show(),
    ]);
  } catch (error) {
    await logError({ error, source: LogSource.WebviewWindow });
  }
});
</script>

<template>
  <Html>
    <Body>
      <div class="border rounded-2xl">
        <LayoutTitlebar @destroy="destroy" />
        <main class="h-screen pt-8.25">
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
