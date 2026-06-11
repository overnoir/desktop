<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { advanced } = storeToRefs(useSettingsStore());
const { setLocale } = useI18n();

await currentWebviewWindow.setContentProtected(advanced.value.preventCapture);
await setLocale(advanced.value.locale);

watch(() => advanced.value.locale, setLocale);

onMounted(async () => {
  await currentWebviewWindow.show();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
