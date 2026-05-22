<script setup lang="ts">
definePageMeta({
  layout: false,
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
  <Html class="rounded-xl">
    <Body class="bg-transparent">
      <main
        class="bg-background ring ring-inset ring-border p-8 h-screen rounded-xl flex flex-col items-center justify-center gap-6"
      >
        <NuxtImg src="/logo.png" class="size-17" />
        <div class="flex flex-col items-center gap-3">
          <Spinner v-if="status === 'checking'" class="size-5 text-primary" />
          <Progress
            v-if="status === 'downloading'"
            class="mt-3"
            :model-value="70"
          />
          <p class="text-sm text-muted-foreground">
            {{ $t(`updater.${status}`) }}
          </p>
        </div>
      </main>
    </Body>
  </Html>
</template>
