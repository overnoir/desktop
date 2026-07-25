<script setup lang="ts">
definePageMeta({
  layout: "updater",
});

const { status, downloadProgress, updateInfo, check, install } = useUpdater();
const { create, getByLabel } = useWebviewWindow();
const { $toast } = useNuxtApp();
const { logError } = useLogs();

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
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.WebviewWindow, error });
  }
}

async function handleInstall() {
  try {
    await install();
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.Updater, error });
    await openOverlayWebviewWindow();
  }
}

onMounted(async () => {
  try {
    const available = await check();

    if (!available) {
      await openOverlayWebviewWindow();
    }
  } catch (error) {
    $toast.error(getErrorMessage(error));
    await logError({ source: LogSource.Updater, error });
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
    <template v-if="status === UpdaterStatus.Checking">
      <p class="text-sm text-secondary-foreground">
        {{ $t("updater.checking") }}
      </p>
      <Spinner class="size-5 text-primary" />
    </template>
    <template v-if="status === UpdaterStatus.Available">
      <div class="flex w-full flex-col items-center gap-1">
        <p class="text-sm font-medium text-foreground">
          {{ $t("updater.available") }}
        </p>
        <p class="text-xs text-secondary-foreground">
          {{
            $t("updater.version", {
              version: updateInfo.version,
            })
          }}
        </p>
      </div>
      <Card
        class="px-4 py-3 prose dark:prose-invert max-w-none overflow-auto size-full"
      >
        <Comark :markdown="updateInfo.body" />
      </Card>
      <Button class="pointer-events-auto" @click="handleInstall">
        {{ $t("updater.install") }}
      </Button>
    </template>
    <template v-if="status === UpdaterStatus.Downloading">
      <p class="text-sm text-secondary-foreground">
        {{ $t("updater.downloading") }}
      </p>
      <Progress
        :model-value="downloadProgress"
        class="my-1.5 w-full max-w-xs"
      />
    </template>
  </section>
</template>
