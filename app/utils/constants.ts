import type { WebviewOptions } from "@tauri-apps/api/webview";
import type { WindowOptions } from "@tauri-apps/api/window";

const name = await tauriAppGetName();

export const defaultSettingsAdvanced: SettingsAdvanced = {
  orientation: Orientation.Horizontal,
  alignment: Alignment.Left,
  locale: Locale.Turkish,
  preventCapture: false,
  showBackground: true,
  ignoreCursor: false,
  showSettings: true,
  isDraggable: true,
  autoStart: false,
  x: 0,
  y: 0,
};

export const defaultSettingsUI: SettingsUI = {
  opacity: 100,
  radius: 50,
  size: 50,
  gap: 5,
};

export const defaultDiscordSettings: DiscordSettings = {
  showAvatarDecorationAnimated: Show.WhileSpeaking,
  showAvatarAnimated: Show.WhileSpeaking,
  showAvatarDecoration: Show.Never,
  displayName: DisplayName.Nick,
  showDisplayName: Show.Always,
  showOnlySpeakers: false,
  userLimit: 25,
  showMe: true,
};

export const mainWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  acceptFirstMouse: true,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  resizable: false,
  visible: false,
  center: true,
  title: name,
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
