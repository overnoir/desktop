import type { Image } from "@tauri-apps/api/image";

export default function () {
  const { general } = storeToRefs(useSettingsStore());
  const isMacOS = tauriOSType() === "macos";
  const { t } = useI18n();

  async function generateMenu() {
    return await TauriMenuMenu.new({
      items: [
        {
          action: async () => {
            const overlayWebviewWindow =
              await TauriWebviewWindowWebviewWindow.getByLabel(
                WebviewWindowLabel.Overlay,
              );

            if (!overlayWebviewWindow) {
              return;
            }

            const mainWebviewWindow =
              await TauriWebviewWindowWebviewWindow.getByLabel(
                WebviewWindowLabel.Main,
              );

            if (mainWebviewWindow) {
              await mainWebviewWindow.show();
              await mainWebviewWindow.unminimize();
              await mainWebviewWindow.setFocus();
            } else {
              const position = await overlayWebviewWindow.outerPosition();
              const size = await overlayWebviewWindow.outerSize();
              const monitor = await tauriWindowCurrentMonitor();

              const { x, y } = generateOverlaySidePosition({
                size: {
                  width: mainWebviewWindowOptions.width!,
                  height: mainWebviewWindowOptions.height!,
                },
                overlay: { position, size },
                monitor,
                orientation: general.value.orientation,
              });

              if (isMacOS) {
                await tauriCoreInvoke("create_nspanel", {
                  height: mainWebviewWindowOptions.height,
                  width: mainWebviewWindowOptions.width,
                  url: mainWebviewWindowOptions.url,
                  label: WebviewWindowLabel.Main,
                  canBecomeKeyWindow: true,
                  x,
                  y,
                });
              } else {
                new TauriWebviewWindowWebviewWindow(WebviewWindowLabel.Main, {
                  ...mainWebviewWindowOptions,
                  x,
                  y,
                });
              }
            }
          },
          text: t("tray.settings"),
          id: "settings",
        },
        {
          action: () => tauriProcessExit(),
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

    if (tauriOSType() === "macos") {
      const bytes = new Uint8Array(
        await $fetch("/macos-tray-icon.png", { responseType: "arrayBuffer" }),
      );
      icon = await TauriImageImage.fromBytes(bytes);
    } else {
      icon = (await tauriAppDefaultWindowIcon()) || undefined;
    }

    await TauriTrayTrayIcon.new({
      tooltip: id.charAt(0).toUpperCase() + id.slice(1),
      menu: await generateMenu(),
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
      await tray.setMenu(await generateMenu());
    }
  }

  return { create, updateMenu };
}
