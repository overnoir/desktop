<script setup lang="ts">
definePageMeta({
  layout: "updater",
});

const status = shallowRef<"checking" | "downloading" | "loading">("checking");
const { create, getByLabel } = useWebviewWindow();
const downloadProgress = shallowRef(0);

async function openOverlayWebviewWindow() {
  try {
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
}

onMounted(async () => {
  try {
    const update = await tauriUpdaterCheck();

    if (update) {
      status.value = "downloading";

      let contentLength = 0;
      let downloaded = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength ?? 0;
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            if (contentLength > 0) {
              downloadProgress.value = Math.round(
                (downloaded / contentLength) * 100,
              );
            }
            break;
          case "Finished":
            status.value = "loading";
            break;
        }
      });

      await tauriProcessRelaunch();
    } else {
      await openOverlayWebviewWindow();
    }
  } catch (error) {
    await useLogs().logError({ error, source: LogSource.App });
    await openOverlayWebviewWindow();
  }
});
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
        :model-value="downloadProgress"
        class="my-1.5"
      />
      <Spinner v-else class="size-5 text-primary" />
    </div>
  </section>
</template>
