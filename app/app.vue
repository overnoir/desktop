<script setup lang="ts">
const { general, advanced } = storeToRefs(useSettingsStore());
const { currentWebviewWindow } = useWebviewWindow().getCurrent();
const { setLocale } = useI18n();

await currentWebviewWindow.setContentProtected(advanced.value.preventCapture);

watch(() => general.value.locale, setLocale, { immediate: true });
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
