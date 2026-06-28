//#region Enums
export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export enum Locale {
  Turkish = "tr",
  English = "en",
}

export enum WebviewWindowLabel {
  Updater = "updater",
  Overlay = "overlay",
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

export enum ErrorSource {
  Discord = "discord",
  Kick = "kick",
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
  showAvatarDecorationAnimated: DiscordShow;
  showAvatarDecoration: DiscordShow;
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

export type AppError = {
  source: ErrorSource;
  createdAt: number;
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
  iconUrl: string | null;
  name: string;
  id: string;
};

export type AvatarDecoration = {
  skuId: string;
  asset: string;
};

export type DiscordUser = {
  avatarDecoration: AvatarDecoration | null;
  globalName: string | null;
  isSelfDeafened: boolean;
  discriminator: string;
  avatar: string | null;
  isSelfMuted: boolean;
  nick: string | null;
  isSpeaking: boolean;
  isDeafened: boolean;
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

export type KickSettings = {
  showCategory: KickShow.WhileLive | KickShow.Never;
  displayName: KickDisplayName;
  showDisplayName: KickShow;
  streamerLimit: number;
  showOnlyLive: boolean;
};

export type KickStreamer = {
  user: {
    profilePicture: string;
    name: string;
    id: number;
  };
  channel: {
    stream: {
      isLive: boolean;
    };
    category: {
      name: string;
    };
    slug: string;
  };
};
//#endregion
