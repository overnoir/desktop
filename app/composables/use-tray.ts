import { defaultWindowIcon } from "@tauri-apps/api/app";
import { exit } from "@tauri-apps/plugin-process";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import {
  WebviewWindow as WebviewWindowClass,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";

export default async function () {
  const { t } = useI18n();
  const id = "overnoir";

  async function generateMenu() {
    return await Menu.new({
      items: [
        {
          action: async () => {
            const mainWebviewWindow = (await getAllWebviewWindows()).find(
              ({ label }) => label === WebviewWindow.Main,
            );

            if (mainWebviewWindow) {
              await mainWebviewWindow.show();
              await mainWebviewWindow.unminimize();
              await mainWebviewWindow.setFocus();
            } else {
              new WebviewWindowClass(
                WebviewWindow.Main,
                mainWebviewWindowOptions,
              );
            }
          },
          text: t("tray.settings"),
          id: "settings",
        },
        {
          action: () => exit(),
          text: t("tray.quit"),
          id: "quit",
        },
      ],
    });
  }

  async function create() {
    const tray = await TrayIcon.getById(id);

    if (tray) {
      await tray.close();
    }

    await TrayIcon.new({
      icon: (await defaultWindowIcon()) || undefined,
      menu: await generateMenu(),
      tooltip: "Overnoir",
      id,
    });
  }

  async function updateMenu() {
    const tray = await TrayIcon.getById(id);

    if (tray) {
      await tray.setMenu(await generateMenu());
    }
  }

  return { create, updateMenu };
}
