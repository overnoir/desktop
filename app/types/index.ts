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
  showBackground: boolean;
  preventCapture: boolean;
  showSettings: boolean;
  ignoreCursor: boolean;
  isDraggable: boolean;
  autoStart: boolean;
  opacity: number;
  locale: Locale;
  radius: number;
  theme: Theme;
  size: number;
  x: number;
  y: number;
};

export type DiscordSettings = {
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
//#endregion
