<script setup lang="ts">
onMounted(async () => {
  await useWebviewWindow().getCurrent().currentWebviewWindow.show();
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
