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
  orientation: "horizontal" | "vertical";
  theme: "light" | "dark" | "system";
  opacity: number;
  drag: boolean;
  x: number;
  y: number;
};
