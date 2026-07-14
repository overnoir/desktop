import type { Image } from "@tauri-apps/api/image";

export default function () {
  const { getByLabel, create: createWebviewWindow } = useWebviewWindow();
  const isMacOS = tauriOSType() === "macos";
  const { logError } = useLogs();
  const { t } = useI18n();

  function createMenu() {
    return TauriMenuMenu.new({
      items: [
        {
          action: async () => {
            try {
              const overlayWebviewWindow = await getByLabel({
                label: WebviewWindowLabel.Overlay,
              });

              if (!overlayWebviewWindow) {
                return;
              }

              const mainWebviewWindow = await getByLabel({
                label: WebviewWindowLabel.Main,
              });

              if (mainWebviewWindow) {
                await mainWebviewWindow.show();
                await mainWebviewWindow.unminimize();
                await mainWebviewWindow.setFocus();
              } else {
                await createWebviewWindow({
                  ...mainWebviewWindowOptions,
                  label: WebviewWindowLabel.Main,
                  canBecomeKeyWindow: true,
                });
              }
            } catch (error) {
              await logError({ error, source: LogSource.Tray });
            }
          },
          text: t("tray.settings"),
          id: "settings",
        },
        {
          action: async () => {
            try {
              await tauriProcessExit();
            } catch (error) {
              await logError({ error, source: LogSource.Tray });
            }
          },
          text: t("tray.quit"),
          id: "quit",
        },
      ],
    });
  }

  async function create() {
    const id = (await tauriAppGetName()).toLowerCase();
    const tray = await TauriTrayTrayIcon.getById(id);

    if (tray) {
      await tray.close();
    }

    let icon: string | Image | undefined;

    if (isMacOS) {
      const bytes = new Uint8Array(
        await $fetch("/macos-tray-icon.png", { responseType: "arrayBuffer" }),
      );
      icon = await TauriImageImage.fromBytes(bytes);
    } else {
      icon = (await tauriAppDefaultWindowIcon()) || undefined;
    }

    await TauriTrayTrayIcon.new({
      tooltip: id.charAt(0).toUpperCase() + id.slice(1),
      menu: await createMenu(),
      iconAsTemplate: true,
      icon,
      id,
    });
  }

  async function updateMenu() {
    const tray = await TauriTrayTrayIcon.getById(
      (await tauriAppGetName()).toLowerCase(),
    );

    if (tray) {
      await tray.setMenu(await createMenu());
    }
  }

  return { create, updateMenu };
}
