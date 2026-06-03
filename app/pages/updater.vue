<script setup lang="ts">
definePageMeta({
  layout: "updater",
});

const status = ref<"checking" | "downloading">("checking");

setTimeout(() => {
  status.value = "downloading";

  setTimeout(() => {
    new TauriWebviewWindowWebviewWindow(
      WebviewWindow.Overlay,
      overlayWebviewWindowOptions,
    );
  }, 2000);
}, 1000);
</script>

<template>
  <section data-tauri-drag-region class="grid place-items-center gap-6">
    <NuxtImg src="/logo.png" class="size-17" />
    <div class="flex flex-col items-center gap-1.5">
      <Spinner v-if="status === 'checking'" class="size-5 text-primary" />
      <Progress
        v-if="status === 'downloading'"
        :model-value="70"
        class="my-1.5"
      />
      <p class="text-sm text-muted-foreground">
        {{ $t(`updater.${status}`) }}
      </p>
    </div>
  </section>
</template>
