<script setup lang="ts">
definePageMeta({
  layout: "updater",
});

const status = shallowRef<"checking" | "available" | "downloading" | "loading">(
  "checking",
);
const { create, getByLabel } = useWebviewWindow();
const downloadProgress = shallowRef(0);
const { logError } = useLogs();
const updateData = shallowRef({
  version: "",
  body: "",
});

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
    await logError({ error, source: LogSource.WebviewWindow });
  }
}

async function installUpdate() {
  try {
    status.value = "downloading";

    const update = await tauriUpdaterCheck();

    if (!update) {
      await openOverlayWebviewWindow();
      return;
    }

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
  } catch (error) {
    await logError({ error, source: LogSource.App });
    await openOverlayWebviewWindow();
  }
}

onMounted(async () => {
  try {
    const update = await tauriUpdaterCheck();

    if (update) {
      updateData.value = {
        version: update.version,
        body: update.body ?? "",
      };
      status.value = "available";
    } else {
      await openOverlayWebviewWindow();
    }
  } catch (error) {
    await logError({ error, source: LogSource.App });
    await openOverlayWebviewWindow();
  }
});
</script>

<template>
  <section
    class="flex h-full flex-col items-center justify-center gap-4 px-6 py-4"
    data-tauri-drag-region
  >
    <NuxtImg src="/logo.png" class="size-17 shrink-0" alt="Logo" />
    <template v-if="status === 'checking'">
      <p class="text-sm text-secondary-foreground">
        {{ $t("updater.checking") }}
      </p>
      <Spinner class="size-5 text-primary" />
    </template>
    <template v-if="status === 'available'">
      <div
        class="flex w-full flex-col items-center gap-1"
        data-tauri-drag-region
      >
        <p class="text-sm font-medium text-foreground">
          {{ $t("updater.available") }}
        </p>
        <p class="text-xs text-secondary-foreground">
          {{
            $t("updater.version", {
              version: updateData.version,
            })
          }}
        </p>
      </div>
      <Card
        v-if="updateData.body"
        class="px-4 py-3 prose dark:prose-invert max-w-none overflow-auto size-full"
      >
        <Comark :markdown="updateData.body" />
      </Card>
      <Button class="pointer-events-auto" @click="installUpdate">
        {{ $t("updater.install") }}
      </Button>
    </template>
    <template v-if="status === 'downloading'">
      <p class="text-sm text-secondary-foreground">
        {{ $t("updater.downloading") }}
      </p>
      <Progress
        :model-value="downloadProgress"
        class="my-1.5 w-full max-w-xs"
      />
    </template>
    <template v-if="status === 'loading'">
      <p class="text-sm text-secondary-foreground">
        {{ $t("updater.loading") }}
      </p>
      <Spinner class="size-5 text-primary" />
    </template>
  </section>
</template>
