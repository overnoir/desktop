<script setup lang="ts">
const currentWebviewWindow = useWebviewWindow().getCurrent();
const { advanced } = storeToRefs(useSettingsStore());
const { $toast } = useNuxtApp();
const { logError } = useLogs();

async function destroy() {
  try {
    await currentWebviewWindow.destroy();
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.WebviewWindow, error });
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop),
      currentWebviewWindow.show(),
    ]);
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.WebviewWindow, error });
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
