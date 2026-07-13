<script setup lang="ts">
onMounted(async () => {
  try {
    await useWebviewWindow().getCurrent().currentWebviewWindow.show();
  } catch (error) {
    await useLogs().logError({ error, source: LogSource.WebviewWindow });
  }
});
</script>

<template>
  <Html>
    <Body class="**:select-none">
      <main data-tauri-drag-region class="h-screen">
        <slot />
      </main>
    </Body>
  </Html>
</template>
