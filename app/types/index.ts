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
  locale: ReturnType<typeof useI18n>["localeCodes"]["value"][number];
  orientation: Orientation;
  autoStart: boolean;
  opacity: number;
  drag: boolean;
  theme: Theme;
  size: number;
  x: number;
  y: number;
};
//#endregion
