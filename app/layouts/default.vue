<script setup lang="ts">
const { advanced } = storeToRefs(useSettingsStore());
const isMacOS = tauriOSType() === "macos";

onMounted(async () => {
  if (isMacOS) {
    await tauriCoreInvoke("convert_webview_window_to_nspanel", {
      label: WebviewWindowLabel.Main,
    });
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      value: advanced.value.alwaysOnTop,
      label: WebviewWindowLabel.Main,
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
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar />
      <SonnerToaster />
      <div class="flex h-screen pt-8.25">
        <LayoutNavbar />
        <main
          class="p-5.5 w-full overflow-auto border-l border-t rounded-tl-2xl"
        >
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
