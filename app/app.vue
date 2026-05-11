<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { enable, disable } from "@tauri-apps/plugin-autostart";

const currentWebViewWindow = getCurrentWebviewWindow();
const { settings } = storeToRefs(useSettingsStore());
const isPreferredDark = usePreferredDark();
const systemTheme = computed(() => (isPreferredDark.value ? "dark" : "light"));
const { updateMenu } = useTray();
const { setLocale } = useI18n();

function updateThemeClass() {
  const html = document.documentElement;

  html.classList.remove(...Object.values(Theme));

  const theme =
    settings.value.theme === "system"
      ? systemTheme.value
      : settings.value.theme;

  html.classList.add(theme);
}

await setLocale(settings.value.locale);

updateThemeClass();

watch(
  () => settings.value.theme,
  () => {
    updateThemeClass();
  },
);

watch(
  () => settings.value.preventCapture,
  async (value) => {
    await currentWebViewWindow.setContentProtected(value);
  },
);

watch(
  () => settings.value.locale,
  async (value) => {
    await setLocale(value);
    await updateMenu();
  },
);

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

onMounted(async () => {
  await currentWebViewWindow.show();
  await currentWebViewWindow.unminimize();
  await currentWebViewWindow.setFocus();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
