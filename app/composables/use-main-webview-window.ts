import {
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";

export default function () {
  const { settings } = storeToRefs(useSettingsStore());
  const localePath = useLocalePath();

  async function open() {
    const allWebviewWindows = await getAllWebviewWindows();

    const mainWebviewWindow = allWebviewWindows.find(
      ({ label }) => label === "main",
    );

    if (mainWebviewWindow) {
      await mainWebviewWindow.unminimize();
      await mainWebviewWindow.show();
      await mainWebviewWindow.setFocus();
    } else {
      const mainWebviewWindow = new WebviewWindow("main", {
        url: localePath("/", settings.value.locale),
        titleBarStyle: "overlay",
        acceptFirstMouse: true,
        hiddenTitle: true,
        skipTaskbar: true,
        resizable: false,
        title: "Radar",
        height: 600,
        width: 960,
      });

      mainWebviewWindow.once("initialized", async () => {
        await mainWebviewWindow.unminimize();
        await mainWebviewWindow.show();
        await mainWebviewWindow.setFocus();
      });
    }
  }

  return {
    open,
  };
}
