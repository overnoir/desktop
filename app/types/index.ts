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

export enum DisplayName {
  Nick = "nick",
  Username = "username",
}

export enum ShowDisplayName {
  Always = "always",
  WhileSpeaking = "whileSpeaking",
  Never = "never",
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

export type Settings = {
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

export type VaultItemMetadata = {
  createdAt: number;
  updatedAt: number;
  key: string;
};

export type Discord = {
  settings: DiscordSettings;
  channel?: DiscordChannel;
  errors: DiscordError[];
  connected: boolean;
  userId?: string;
};

export type DiscordSettings = {
  showDisplayName: ShowDisplayName;
  showOnlySpeakers: boolean;
  displayName: DisplayName;
  showMe: boolean;
};

export type DiscordError = {
  createdAt: number;
  message: string;
  id: string;
};

export type DiscordChannel = {
  users: DiscordUser[];
  name: string;
  id: string;
};

export type DiscordUser = {
  discriminator: string;
  isSelfDeafened: boolean;
  isSelfMuted: boolean;
  isSpeaking: boolean;
  isDeafened: boolean;
  username: string;
  isMuted: boolean;
  avatar?: string;
  nick?: string;
  id: string;
};
//#endregion
