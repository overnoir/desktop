import type { WebviewOptions } from "@tauri-apps/api/webview";
import type { WindowOptions } from "@tauri-apps/api/window";

const name = await tauriAppGetName();

export const MAX_KICK_STREAMER_COUNT = 7;
export const MAX_DISCORD_USER_LIMIT = 50;
export const WEBVIEW_WINDOW_OFFSET = 10;

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
  streamerLimit: 7,
};

export const defaultSystemSettings: SystemSettings = {
  showBattery: false,
  showNetwork: false,
  showMemory: false,
  showCpu: false,
};

export const overlayWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  generalAutofillEnabled: false,
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
  height: 1,
  width: 1,
  x: 1,
  y: 1,
};

export const mainWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  generalAutofillEnabled: false,
  url: "/settings/general",
  acceptFirstMouse: true,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  skipTaskbar: true,
  resizable: false,
  visible: false,
  shadow: false,
  title: name,
  height: 500,
  width: 900,
};

export const streamWebviewWindowOptions: Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions = {
  generalAutofillEnabled: false,
  title: `${name} Stream`,
  acceptFirstMouse: true,
  decorations: false,
  hiddenTitle: true,
  transparent: true,
  skipTaskbar: true,
  resizable: false,
  visible: false,
  shadow: false,
  height: 500,
  width: 770,
};
