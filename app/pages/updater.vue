<script setup lang="ts">
definePageMeta({
  layout: "updater",
});

const status = ref<"checking" | "downloading" | "loading">("checking");

setTimeout(() => {
  status.value = "downloading";

  setTimeout(() => {
    new TauriWebviewWindowWebviewWindow(
      WebviewWindow.Overlay,
      overlayWebviewWindowOptions,
    );
    status.value = "loading";
  }, 1000);
}, 1000);
</script>

<template>
  <section
    class="flex items-center justify-center flex-col gap-6 h-full **:pointer-events-none"
    data-tauri-drag-region
  >
    <NuxtImg src="/logo.png" class="size-17" alt="Logo" />
    <div class="flex flex-col items-center gap-1.5">
      <Progress
        v-if="status === 'downloading'"
        :model-value="70"
        class="my-1.5"
      />
      <Spinner v-else class="size-5 text-primary" />
      <p class="text-sm text-secondary-foreground">
        {{ $t(`updater.${status}`) }}
      </p>
    </div>
  </section>
</template>
