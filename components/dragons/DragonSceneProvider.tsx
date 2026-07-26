"use client";

type DragonSceneProviderProps = {
  children: React.ReactNode;
};

/** Keeps page layout unchanged — each dragon card renders its own 3D canvas. */
export function DragonSceneProvider({ children }: DragonSceneProviderProps) {
  return <>{children}</>;
}
