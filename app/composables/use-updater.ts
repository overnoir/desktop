import type { Update } from "@tauri-apps/plugin-updater";

export default function () {
  const status = shallowRef<UpdaterStatus>(UpdaterStatus.Checking);
  const update = shallowRef<Update | null>(null);
  const downloadProgress = shallowRef(0);

  const updateInfo = computed(() => ({
    version: update.value?.version,
    body: update.value?.body,
  }));

  async function check() {
    const result = await tauriUpdaterCheck();

    if (result) {
      status.value = UpdaterStatus.Available;
      update.value = result;
      return true;
    }

    return false;
  }

  async function install() {
    if (!update.value) {
      throw new Error("Update not found.");
    }

    status.value = UpdaterStatus.Downloading;

    let contentLength = 0;
    let downloaded = 0;

    await update.value.downloadAndInstall((event) => {
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
      }
    });

    await tauriProcessRelaunch();
  }

  return { status, downloadProgress, updateInfo, check, install };
}
