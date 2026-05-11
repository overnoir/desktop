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
      await mainWebviewWindow.show();
      await mainWebviewWindow.unminimize();
      await mainWebviewWindow.setFocus();
    } else {
      new WebviewWindow("main", {
        url: localePath("/", settings.value.locale),
        titleBarStyle: "overlay",
        acceptFirstMouse: true,
        hiddenTitle: true,
        skipTaskbar: true,
        resizable: false,
        visible: false,
        title: "Radar",
        height: 600,
        width: 960,
      });
    }
  }

  return {
    open,
  };
}
