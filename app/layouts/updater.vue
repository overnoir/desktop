<script setup lang="ts">
onMounted(async () => {
  await useWebviewWindow().getCurrent().show();
});
</script>

<template>
  <Html>
    <Body class="**:select-none">
      <main class="h-screen">
        <slot />
      </main>
    </Body>
  </Html>
</template>
