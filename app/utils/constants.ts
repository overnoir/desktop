import type { WebviewOptions } from "@tauri-apps/api/webview";
import type { WindowOptions } from "@tauri-apps/api/window";

export const defaultSettings: Settings = {
  orientation: Orientation.Horizontal,
  locale: Locale.Turkish,
  preventCapture: false,
  showBackground: true,
  ignoreCursor: false,
  theme: Theme.System,
  showSettings: true,
  isDraggable: true,
  autoStart: false,
  opacity: 100,
  radius: 50,
  size: 50,
  x: 0,
  y: 0,
};

export const mainWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  titleBarStyle: "overlay",
  acceptFirstMouse: true,
  title: "Overnoir Main",
  hiddenTitle: true,
  skipTaskbar: true,
  resizable: false,
  height: 600,
  width: 960,
};
