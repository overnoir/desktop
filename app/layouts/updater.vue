<script setup lang="ts">
const isMacOS = tauriOSType() === "macos";

onMounted(async () => {
  await tauriWebviewWindowGetCurrentWebviewWindow().show();
});
</script>

<template>
  <Html :class="{ 'rounded-2xl': isMacOS }">
    <Body :class="{ 'rounded-2xl': isMacOS }" class="**:select-none">
      <main class="h-screen">
        <slot />
      </main>
    </Body>
  </Html>
</template>
