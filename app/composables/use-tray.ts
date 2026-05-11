import { defaultWindowIcon } from "@tauri-apps/api/app";
import { exit } from "@tauri-apps/plugin-process";
import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";

export default function () {
  const { open } = useMainWebviewWindow();
  const { t } = useI18n();
  const id = "radar";

  async function generateMenu() {
    return await Menu.new({
      items: [
        {
          text: t("tray.settings"),
          id: "settings",
          action: open,
        },
        {
          text: t("tray.quit"),
          id: "quit",
          action: () => exit(),
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
      id,
    });
  }

  async function updateMenu() {
    const tray = await TrayIcon.getById(id);

    if (!tray) {
      return;
    }

    await tray.setMenu(await generateMenu());
  }

  return { create, updateMenu };
}
