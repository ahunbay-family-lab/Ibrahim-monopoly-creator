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
  /** Overrides the shared bust model with a different 3D model, for a dragon with a unique shape. */
  modelPath?: string;
  /** Name of an animation clip in that model to play on a loop (e.g. a flying pose). */
  animationName?: string;
  /** Extra visual details like smoke, eyes, or talons — used for dragons with unique models. */
  visualEffects?: {
    outline?: boolean;
    nostrilSmoke?: boolean;
    eyes?: boolean;
    talons?: boolean;
    /** How big the model is scaled to fit the viewer (default 2.8). Smaller = more room for wide wings. */
    fitScale?: number;
    /** How far the camera sits from the dragon (default 3.5). */
    cameraDistance?: number;
  };
};
