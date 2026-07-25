<script setup lang="ts">
const { general, advanced } = storeToRefs(useSettingsStore());
const { setLocale } = useI18n();

onMounted(async () => {
  try {
    await useWebviewWindow()
      .getCurrent()
      .setContentProtected(advanced.value.contentProtected);
  } catch (error) {
    await useLogs().logError({ source: LogSource.WebviewWindow, error });
  }
});

watch(() => general.value.locale, setLocale, { immediate: true });
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <SonnerToaster />
    <NuxtPage />
  </NuxtLayout>
</template>
