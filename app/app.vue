<script setup lang="ts">
import { enable, disable } from "@tauri-apps/plugin-autostart";

const { settings } = storeToRefs(useSettingsStore());
const isPreferredDark = usePreferredDark();
const { setLocale } = useI18n();
const systemTheme = computed(() => (isPreferredDark.value ? "dark" : "light"));
function updateThemeClass() {
  const html = document.documentElement;

  html.classList.remove("light", "dark");

  const theme =
    settings.value.theme === "system"
      ? systemTheme.value
      : settings.value.theme;

  html.classList.add(theme);
}

updateThemeClass();

watch(
  () => settings.value.theme,
  () => {
    updateThemeClass();
  },
);

watch(() => settings.value.locale, setLocale);

watch(
  () => settings.value.autoStart,
  async (value) => {
    if (value) {
      await enable();
    } else {
      await disable();
    }
  },
);

watch(systemTheme, () => {
  if (settings.value.theme === "system") {
    updateThemeClass();
  }
});
</script>

<template>
  <Html>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Html>
</template>
