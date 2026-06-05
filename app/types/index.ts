//#region Enums
export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export enum Theme {
  System = "system",
  Dark = "dark",
  Light = "light",
}

export enum Locale {
  Turkish = "tr",
  English = "en",
}

export enum WebviewWindow {
  Updater = "updater",
  Overlay = "overlay",
  Main = "main",
}

export enum VoiceUserDisplayName {
  Nick = "nick",
  Username = "username",
  None = "none",
}

//#endregion

//#region Types
export type Link = {
  icon: string;
  name: string;
  to: string;
};

export type LinkGroup = {
  links: Link[];
  name: string;
};

export type AppSettings = {
  orientation: Orientation;
  preventCapture: boolean;
  showBackground: boolean;
  showSettings: boolean;
  ignoreCursor: boolean;
  isDraggable: boolean;
  autoStart: boolean;
  opacity: number;
  locale: Locale;
  radius: number;
  theme: Theme;
  size: number;
  gap: number;
  x: number;
  y: number;
};

export type DiscordSettings = {
  displayName: VoiceUserDisplayName;
  showOnlySpeakers: boolean;
  showMe: boolean;
};

export type VaultItemMetadata = {
  createdAt: number;
  updatedAt: number;
  key: string;
};

export type DiscordState = {
  connected: boolean;
  errors: {
    createdAt: number;
    message: string;
    id: string;
  }[];
};

export type VoiceUser = {
  userId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  nick: string | null;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  isSelfMuted: boolean;
  isSelfDeafened: boolean;
};

export type VoiceChannelState = {
  channelId: string | null;
  channelName: string | null;
  guildId: string | null;
  users: VoiceUser[];
  currentUserId: string | null;
};
//#endregion
