import type { WebviewOptions } from "@tauri-apps/api/webview";
import type { WindowOptions } from "@tauri-apps/api/window";

const name = await tauriAppGetName();

export const defaultAppSettings: AppSettings = {
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
  gap: 10,
  x: 0,
  y: 0,
};

export const defaultDiscordSettings: DiscordSettings = {
  displayName: VoiceUserDisplayName.Username,
  showOnlySpeakers: false,
  showMe: true,
};

export const defaultDiscordState: DiscordState = {
  connected: false,
  errors: [],
};

export const mainWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  acceptFirstMouse: true,
  title: `${name} Main`,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  resizable: false,
  shadow: false,
  visible: false,
  center: true,
  height: 600,
  width: 960,
};

export const overlayWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  title: `${name} Overlay`,
  acceptFirstMouse: true,
  decorations: false,
  transparent: true,
  alwaysOnTop: true,
  skipTaskbar: true,
  resizable: false,
  url: "/overlay",
  visible: false,
  shadow: false,
  height: 800,
  width: 800,
  x: 0,
  y: 0,
};
