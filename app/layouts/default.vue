<script setup lang="ts">
const { currentWebviewWindow, listenDrag, onDragStart } =
  useWebviewWindow().getCurrent();
const { advanced } = storeToRefs(useSettingsStore());

listenDrag();

onMounted(async () => {
  currentWebviewWindow.setAlwaysOnTop(advanced.value.alwaysOnTop);
  await currentWebviewWindow.show();
});
</script>

<template>
  <Html>
    <Body>
      <NuxtLoadingIndicator color="var(--primary)" />
      <LayoutTitlebar
        @destroy="currentWebviewWindow.destroy"
        @mousedown="onDragStart"
      />
      <SonnerToaster />
      <div class="flex h-screen pt-8.25 border rounded-2xl">
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
