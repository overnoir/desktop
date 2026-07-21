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
    <Body>
      <main class="h-screen">
        <slot />
      </main>
    </Body>
  </Html>
</template>
