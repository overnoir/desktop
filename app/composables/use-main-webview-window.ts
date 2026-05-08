import {
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";

export default function () {
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
        acceptFirstMouse: true,
        skipTaskbar: true,
        resizable: false,
        title: "Radar",
        height: 600,
        width: 800,
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
