import type { WebviewOptions } from "@tauri-apps/api/webview";
import type { WindowOptions } from "@tauri-apps/api/window";

const name = await tauriAppGetName();

export const defaultSettingsGeneral: SettingsGeneral = {
  orientation: Orientation.Horizontal,
  alignment: Alignment.Left,
  locale: Locale.Turkish,
  showBackground: true,
  showSettings: true,
  showDrag: true,
  opacity: 100,
  radius: 50,
  size: 50,
  gap: 5,
  x: 0,
  y: 0,
};

export const defaultSettingsAdvanced: SettingsAdvanced = {
  preventCapture: false,
  ignoreCursor: false,
  alwaysOnTop: true,
  autoStart: false,
};

export const defaultDiscordSettings: DiscordSettings = {
  showAvatarDecorationAnimated: Show.WhileSpeaking,
  showAvatarAnimated: Show.WhileSpeaking,
  showAvatarDecoration: Show.Never,
  displayName: DisplayName.Nick,
  showDisplayName: Show.Always,
  showGuildIconAnimated: true,
  showDeafenedUsers: true,
  showSpeakersOnly: false,
  showMutedUsers: true,
  showGuild: true,
  showBots: true,
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
  visible: false,
  minHeight: 600,
  minWidth: 960,
  center: true,
  title: name,
  height: 720,
  width: 1280,
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
  skipTaskbar: true,
  resizable: false,
  url: "/overlay",
  visible: false,
  shadow: false,
  height: 1,
  width: 1,
  x: 0,
  y: 0,
};
