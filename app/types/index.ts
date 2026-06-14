//#region Enums
export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
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

export enum Show {
  Always = "always",
  WhileSpeaking = "whileSpeaking",
  Never = "never",
}

export enum Alignment {
  Left = "left",
  Center = "center",
  Right = "right",
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
  name?: string;
};

export type SettingsGeneral = {
  orientation: Orientation;
  showBackground: boolean;
  showSettings: boolean;
  alignment: Alignment;
  isDraggable: boolean;
  locale: Locale;
  opacity: number;
  radius: number;
  size: number;
  gap: number;
  y: number;
  x: number;
};

export type SettingsAdvanced = {
  preventCapture: boolean;
  ignoreCursor: boolean;
  alwaysOnTop: boolean;
  autoStart: boolean;
};

export type VaultItemMetadata = {
  createdAt: number;
  updatedAt: number;
  key: string;
};

export type DiscordSettings = {
  showAvatarDecorationAnimated: Show;
  showAvatarDecoration: Show;
  showOnlySpeakers: boolean;
  showAvatarAnimated: Show;
  displayName: DisplayName;
  showDisplayName: Show;
  userLimit: number;
  showMe: boolean;
};

export type DiscordError = {
  createdAt: number;
  message: string;
  id: string;
};

export type DiscordChannel = {
  guildIconUrl?: string;
  users: DiscordUser[];
  guildName: string;
  guildId: string;
  name: string;
  id: string;
};

export type AvatarDecoration = {
  skuId: string;
  asset: string;
};

export type DiscordUser = {
  avatarDecoration?: AvatarDecoration;
  isSelfDeafened: boolean;
  isSelfMuted: boolean;
  isSpeaking: boolean;
  isDeafened: boolean;
  username: string;
  isMuted: boolean;
  avatar?: string;
  isBot: boolean;
  nick?: string;
  id: string;
};

export type DiscordConnectedUser = {
  username: string;
  avatar?: string;
  id: string;
};

//#endregion
