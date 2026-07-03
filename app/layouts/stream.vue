<script setup lang="ts">
const { advanced } = storeToRefs(useSettingsStore());
const isMacOS = tauriOSType() === "macos";

onMounted(async () => {
  if (isMacOS) {
    await tauriCoreInvoke("convert_webview_window_to_nspanel", {
      label: WebviewWindowLabel.Stream,
    });
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      value: advanced.value.alwaysOnTop,
      label: WebviewWindowLabel.Stream,
    });
  } else {
    await tauriWindowGetCurrentWindow().setAlwaysOnTop(
      advanced.value.alwaysOnTop,
    );
  }
});
</script>

<template>
  <Html :class="{ 'rounded-2xl': isMacOS }">
    <Body :class="{ 'rounded-2xl': isMacOS }">
      <LayoutTitlebar />
      <main class="h-screen pt-8.25">
        <slot />
      </main>
    </Body>
  </Html>
</template>
