<script setup lang="ts">
const { currentWebviewWindow } = useWebviewWindow().getCurrent();
const { general, advanced } = storeToRefs(useSettingsStore());
const { setLocale } = useI18n();

try {
  await currentWebviewWindow.setContentProtected(advanced.value.preventCapture);
} catch (error) {
  await useLogs().logError({ error, source: LogSource.WebviewWindow });
}

watch(() => general.value.locale, setLocale, { immediate: true });
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
