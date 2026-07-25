<script setup lang="ts">
const isMacOS = tauriOSType() === "macos";

onMounted(async () => {
  try {
    await useWebviewWindow().getCurrent().show();
  } catch (error) {
    await useLogs().logError({ error, source: LogSource.WebviewWindow });
  }
});
</script>

<template>
  <Html :class="{ 'rounded-none': !isMacOS }">
    <Body :class="{ 'rounded-none': !isMacOS }">
      <main class="h-screen">
        <slot />
      </main>
    </Body>
  </Html>
</template>
