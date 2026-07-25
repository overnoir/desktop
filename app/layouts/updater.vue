<script setup lang="ts">
const isMacOS = tauriOSType() === "macos";
const { $toast } = useNuxtApp();

onMounted(async () => {
  try {
    await useWebviewWindow().getCurrent().show();
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await useLogs().logError({ source: LogSource.WebviewWindow, error });
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
