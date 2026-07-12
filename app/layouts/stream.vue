<script setup lang="ts">
const currentWebviewWindow = useWebviewWindow().getCurrent();
const { advanced } = storeToRefs(useSettingsStore());

onMounted(async () => {
  await currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
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
