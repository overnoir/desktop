<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { appSettings } = storeToRefs(useAppSettingsStore());
const classList = document.documentElement.classList;
const isPreferredDark = usePreferredDark();
const { setLocale } = useI18n();

const systemTheme = computed(() =>
  isPreferredDark.value ? Theme.Dark : Theme.Light,
);

function updateThemeClass() {
  classList.remove(...Object.values(Theme));

  classList.add(
    appSettings.value.theme === Theme.System
      ? systemTheme.value
      : appSettings.value.theme,
  );
}

await currentWebviewWindow.setContentProtected(
  appSettings.value.preventCapture,
);
await setLocale(appSettings.value.locale);
updateThemeClass();

watch(() => appSettings.value.locale, setLocale);

watch(() => [systemTheme, appSettings.value.theme], updateThemeClass);

onMounted(async () => {
  await currentWebviewWindow.show();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
