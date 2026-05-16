export default function () {
  const { t } = useI18n();

  async function generateMenu() {
    return await TauriMenuMenu.new({
      items: [
        {
          action: async () => {
            const mainWebviewWindow = (
              await tauriWebviewWindowGetAllWebviewWindows()
            ).find(({ label }) => label === WebviewWindow.Main);

            if (mainWebviewWindow) {
              await mainWebviewWindow.show();
              await mainWebviewWindow.unminimize();
              await mainWebviewWindow.setFocus();
            } else {
              new TauriWebviewWindowWebviewWindow(
                WebviewWindow.Main,
                mainWebviewWindowOptions,
              );
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

    await TauriTrayTrayIcon.new({
      icon: (await tauriAppDefaultWindowIcon()) || undefined,
      tooltip: id.charAt(0).toUpperCase() + id.slice(1),
      menu: await generateMenu(),
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
