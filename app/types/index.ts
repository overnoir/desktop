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
  GlobalName = "globalName",
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

export enum Source {
  Discord = "discord",
  Kick = "kick",
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
  showGuildIconAnimated: boolean;
  showAvatarDecoration: Show;
  showDeafenedUsers: boolean;
  showSpeakersOnly: boolean;
  showAvatarAnimated: Show;
  displayName: DisplayName;
  showMutedUsers: boolean;
  showDisplayName: Show;
  showGuild: boolean;
  userLimit: number;
  showBots: boolean;
  showMe: boolean;
};

export type AppError = {
  createdAt: number;
  source?: Source;
  message: string;
  id: string;
};

export type DiscordChannel = {
  users: DiscordUser[];
  name: string;
  id: string;
};

export type DiscordGuild = {
  channel: DiscordChannel;
  iconUrl?: string;
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
  discriminator: string;
  globalName?: string;
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

export type KickSettings = {
  showOnlyLive: boolean;
};

export type KickStreamer = {
  profilePicture: string;
  slug: string;
  id: number;
};

export type KickStream = {
  category: string;
  slug: string;
};
//#endregion
