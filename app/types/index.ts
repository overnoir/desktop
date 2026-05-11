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
  ignoreCursor: boolean;
  background: boolean;
  autoStart: boolean;
  opacity: number;
  locale: Locale;
  drag: boolean;
  theme: Theme;
  size: number;
  x: number;
  y: number;
};
//#endregion
