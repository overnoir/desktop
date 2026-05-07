<script setup lang="ts">
const { settings } = storeToRefs(useSettingsStore());
const isPreferredDark = usePreferredDark();

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
