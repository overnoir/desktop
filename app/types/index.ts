//#region Enums
export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export enum Locale {
  Turkish = "tr",
  English = "en",
  German = "de",
  French = "fr",
  Portuguese = "pt",
  Spanish = "es",
}

export enum WebviewWindowLabel {
  Updater = "updater",
  Overlay = "overlay",
  Stream = "stream",
  Main = "main",
}

export enum DiscordDisplayName {
  Nick = "nick",
  GlobalName = "globalName",
  Username = "username",
}

export enum DiscordShow {
  Always = "always",
  WhileSpeaking = "whileSpeaking",
  Never = "never",
}

export enum Alignment {
  Left = "left",
  Center = "center",
  Right = "right",
}

export enum KickShow {
  Always = "always",
  WhileLive = "whileLive",
  Never = "never",
}

export enum KickDisplayName {
  Name = "name",
  Slug = "slug",
}

export enum DiscordRPCEventCommand {
  GetSelectedVoiceChannel = "GET_SELECTED_VOICE_CHANNEL",
  GetChannel = "GET_CHANNEL",
  GetGuild = "GET_GUILD",
  Dispatch = "DISPATCH",
}

export enum DiscordRPCEventName {
  VoiceChannelSelect = "VOICE_CHANNEL_SELECT",
  VoiceStateCreate = "VOICE_STATE_CREATE",
  VoiceStateUpdate = "VOICE_STATE_UPDATE",
  VoiceStateDelete = "VOICE_STATE_DELETE",
  SpeakingStart = "SPEAKING_START",
  SpeakingStop = "SPEAKING_STOP",
}

export enum StreamPlatform {
  Kick = "kick",
}

export enum LogSource {
  WebviewWindow = "WEBVIEW_WINDOW",
  Discord = "DISCORD",
  Updater = "UPDATER",
  Unknown = "UNKNOWN",
  System = "SYSTEM",
  Stream = "STREAM",
  Vault = "VAULT",
  Kick = "KICK",
  Logs = "LOGS",
  Tray = "TRAY",
  App = "APP",
}

export enum UpdaterStatus {
  Downloading = "downloading",
  Available = "available",
  Checking = "checking",
}
//#endregion

//#region Types
export type Link = {
  links?: Link[];
  icon?: string;
  name: string;
  to: string;
};

export type OverlayItemIcon = {
  variant?: "default" | "destructive";
  name: string;
};

export type SettingsGeneral = {
  orientation: Orientation;
  showBackground: boolean;
  showSettings: boolean;
  alignment: Alignment;
  showDrag: boolean;
  opacity: number;
  radius: number;
  locale: Locale;
  size: number;
  gap: number;
  y: number;
  x: number;
};

export type SettingsAdvanced = {
  ignoreCursorEvents: boolean;
  contentProtected: boolean;
  alwaysOnTop: boolean;
  autoStart: boolean;
};

export type VaultItemMetadata = {
  createdAt: number;
  updatedAt: number;
  key: string;
};

export type DiscordSettings = {
  displayName: DiscordDisplayName;
  showAvatarAnimated: DiscordShow;
  showGuildIconAnimated: boolean;
  showDisplayName: DiscordShow;
  showDeafenedUsers: boolean;
  showSpeakersOnly: boolean;
  showMutedUsers: boolean;
  showGuild: boolean;
  userLimit: number;
  showBots: boolean;
  showMe: boolean;
};

export type DiscordChannel = {
  users: DiscordUser[];
  name: string;
  id: string;
};

export type DiscordGuild = {
  channel: DiscordChannel;
  iconUrl: string | null;
  name: string;
  id: string;
};

export type DiscordUser = {
  globalName: string | null;
  isSelfDeafened: boolean;
  discriminator: string;
  avatar: string | null;
  isSelfMuted: boolean;
  nick: string | null;
  isSpeaking: boolean;
  isDeafened: boolean;
  isSuppress: boolean;
  username: string;
  isMuted: boolean;
  isBot: boolean;
  id: string;
};

export type DiscordConnectedUser = {
  avatar: string | null;
  username: string;
  id: string;
};

export type DiscordRPCEvent = {
  evt: DiscordRPCEventName | null;
  data: Record<string, unknown>;
  cmd: DiscordRPCEventCommand;
  nonce: string;
};

export type DiscordRPCVoiceState = {
  self_deaf: boolean;
  self_mute: boolean;
  suppress: boolean;
  deaf: boolean;
  mute: boolean;
};

export type DiscordRPCUser = {
  global_name: string | null;
  discriminator: string;
  avatar: string | null;
  username: string;
  bot: boolean;
  id: string;
};

export type DiscordRPCVoiceStateData = {
  voice_state: DiscordRPCVoiceState;
  user: DiscordRPCUser;
  nick: string | null;
};

export type DiscordRPCSelectedVoiceChannel = {
  voice_states?: DiscordRPCVoiceStateData[];
  id?: string | null;
  guild_id?: string;
};

export type DiscordRPCChannel = {
  voice_states?: DiscordRPCVoiceStateData[];
  id?: string | null;
  name?: string;
};

export type DiscordRPCGuild = {
  id?: string | null;
  icon_url?: string;
  name?: string;
};

export type DiscordRPCVoiceChannelSelect = {
  channel_id?: string | null;
  guild_id?: string;
};

export type DiscordRPCVoiceEvent = {
  voice_state?: DiscordRPCVoiceState;
  user?: DiscordRPCUser;
  nick?: string | null;
  user_id?: string;
};

export type DiscordRPCSubscribe = {
  event: DiscordRPCEventName;
  args?: object;
};

export type KickSettings = {
  showCategory: KickShow.WhileLive | KickShow.Never;
  displayName: KickDisplayName;
  showDisplayName: KickShow;
  streamerLimit: number;
  showOnlyLive: boolean;
};

export type KickStreamerStream = {
  category: string;
  isLive: boolean;
};

export type KickStreamer = {
  stream: KickStreamerStream;
  profilePicture: string;
  name: string;
  slug: string;
  id: number;
};

export type SystemCpu = {
  usagePercent: number;
  total: number;
  active: number;
};

export type SystemMemory = {
  usagePercent: number;
  totalGb: number;
  usedGb: number;
};

export type SystemNetwork = {
  download: number;
  upload: number;
};

export type SystemBattery = {
  percent: number | null;
  isCharging: boolean;
};

export type SystemSettings = {
  showBattery: boolean;
  showNetwork: boolean;
  showMemory: boolean;
  showCpu: boolean;
};

export type Stream = {
  platform: StreamPlatform;
  slug: string;
};
//#endregion
