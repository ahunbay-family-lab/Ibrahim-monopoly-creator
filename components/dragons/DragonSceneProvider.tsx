"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

type DragonSceneProviderProps = {
  children: React.ReactNode;
};

export function DragonSceneProvider({ children }: DragonSceneProviderProps) {
  return (
    <>
      {children}
      <Canvas
        className="!fixed inset-0 !h-full !w-full"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 20,
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <View.Port />
      </Canvas>
    </>
  );
}
