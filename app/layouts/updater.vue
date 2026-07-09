<script setup lang="ts">
onMounted(async () => {
  await tauriWebviewWindowGetCurrentWebviewWindow().show();
});
</script>

<template>
  <html>
    <Body class="**:select-none">
      <main class="h-screen border rounded-2xl">
        <slot />
      </main>
    </Body>
  </html>
</template>
