<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const classList = document.documentElement.classList;
const isPreferredDark = usePreferredDark();
const { setLocale } = useI18n();

const systemTheme = computed(() =>
  isPreferredDark.value ? Theme.Dark : Theme.Light,
);

function updateThemeClass() {
  classList.remove(...Object.values(Theme));

  classList.add(
    settings.value.theme === Theme.System
      ? systemTheme.value
      : settings.value.theme,
  );
}

await currentWebviewWindow.setContentProtected(settings.value.preventCapture);
await setLocale(settings.value.locale);
updateThemeClass();

watch(() => settings.value.locale, setLocale);

watch(() => [systemTheme, settings.value.theme], updateThemeClass);

onMounted(async () => {
  await currentWebviewWindow.show();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
