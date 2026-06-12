<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { general, advanced } = storeToRefs(useSettingsStore());
const { setLocale } = useI18n();

await currentWebviewWindow.setContentProtected(advanced.value.preventCapture);
await setLocale(general.value.locale);

watch(() => general.value.locale, setLocale);

onMounted(async () => {
  await currentWebviewWindow.show();
});
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
