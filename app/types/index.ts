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

export type Settings = {
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
//#endregion
