export type WingStyle = "classic" | "leaf" | "insect" | "butterfly";

export type DragonTraits = {
  wingCount: 2 | 4;
  wingStyle: WingStyle;
  bulky: boolean;
  slim: boolean;
  hasTailBarb: boolean;
  hasSpikes: boolean;
  hasAntennae: boolean;
  hasBioluminescence: boolean;
  hasStarryWings: boolean;
  hasStripes: boolean;
};

export type DragonColors = {
  primary: string;
  secondary: string;
  accent: string;
  wing: string;
  wingInner?: string;
};

export type DragonCharacter = {
  id: string;
  tribe: string;
  name: string;
  colors: DragonColors;
  traits: DragonTraits;
};
