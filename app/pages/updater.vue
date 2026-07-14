<script setup lang="ts">
definePageMeta({
  layout: "updater",
});

const status = shallowRef<"checking" | "downloading" | "loading">("checking");
const { create, getByLabel } = useWebviewWindow();
setTimeout(() => {
  status.value = "downloading";

  setTimeout(async () => {
    try {
      status.value = "loading";

      const overlayWebviewWindow = await getByLabel({
        label: WebviewWindowLabel.Overlay,
      });

      if (overlayWebviewWindow) {
        return;
      }

      await create({
        ...overlayWebviewWindowOptions,
        label: WebviewWindowLabel.Overlay,
        withEventHandler: true,
      });
    } catch (error) {
      await useLogs().logError({ error, source: LogSource.WebviewWindow });
    }
  }, 1000);
}, 1000);
</script>

<template>
  <section
    class="flex items-center justify-center flex-col gap-6 h-full **:pointer-events-none"
  >
    <NuxtImg src="/logo.png" class="size-17" alt="Logo" />
    <div class="flex flex-col items-center gap-3">
      <p class="text-sm text-secondary-foreground">
        {{ $t(`updater.${status}`) }}
      </p>
      <Progress
        v-if="status === 'downloading'"
        :model-value="70"
        class="my-1.5"
      />
      <Spinner v-else class="size-5 text-primary" />
    </div>
  </section>
</template>
