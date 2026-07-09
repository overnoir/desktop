<script setup lang="ts">
const currentWebviewWindow = tauriWebviewWindowGetCurrentWebviewWindow();
const { advanced } = storeToRefs(useSettingsStore());
const isMacOS = tauriOSType() === "macos";

onMounted(async () => {
  if (isMacOS) {
    await tauriCoreInvoke("set_nspanel_always_on_top", {
      value: advanced.value.alwaysOnTop,
      label: WebviewWindowLabel.Stream,
    });
  } else {
    await currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
  }
  await currentWebviewWindow.show();
});
</script>

<template>
  <Html>
    <Body>
      <div class="border rounded-2xl">
        <LayoutTitlebar />
        <main class="h-screen pt-8.25">
          <slot />
        </main>
      </div>
    </Body>
  </Html>
</template>
