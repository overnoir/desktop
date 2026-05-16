import { defaultWindowIcon, getName } from "@tauri-apps/api/app";
import { exit } from "@tauri-apps/plugin-process";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import {
  WebviewWindow as WebviewWindowClass,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";

export default function () {
  const { t } = useI18n();

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
    const id = (await getName()).toLowerCase();
    const tray = await TrayIcon.getById(id);

    if (tray) {
      await tray.close();
    }

    await TrayIcon.new({
      icon: (await defaultWindowIcon()) || undefined,
      tooltip: id[0]!.toUpperCase() + id.slice(1),
      menu: await generateMenu(),
      id,
    });
  }

  async function updateMenu() {
    const tray = await TrayIcon.getById((await getName()).toLowerCase());

    if (tray) {
      await tray.setMenu(await generateMenu());
    }
  }

  return { create, updateMenu };
}
