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
  showAvatarAnimated: DiscordShow.WhileSpeaking,
  displayName: DiscordDisplayName.Nick,
  showDisplayName: DiscordShow.Always,
  showGuildIconAnimated: false,
  showDeafenedUsers: true,
  showSpeakersOnly: false,
  showMutedUsers: true,
  showGuild: true,
  showBots: true,
  userLimit: 25,
  showMe: true,
};

export const defaultKickSettings: KickSettings = {
  displayName: KickDisplayName.Name,
  showDisplayName: KickShow.Always,
  showCategory: KickShow.WhileLive,
  showOnlyLive: false,
  streamerLimit: 10,
};

export const defaultSystemSettings: SystemSettings = {
  showBattery: true,
  showNetwork: true,
  showMemory: true,
  showCpu: true,
};

export const overlayWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  title: `${name} Overlay`,
  acceptFirstMouse: true,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  skipTaskbar: true,
  resizable: false,
  url: "/overlay",
  visible: false,
  shadow: false,
};

export const mainWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  url: "/settings/general",
  acceptFirstMouse: true,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  skipTaskbar: true,
  resizable: false,
  visible: false,
  title: name,
  height: 600,
  width: 900,
};

export const streamWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  title: `${name} Stream`,
  acceptFirstMouse: true,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  skipTaskbar: true,
  resizable: false,
  visible: false,
  height: 500,
  width: 770,
};
