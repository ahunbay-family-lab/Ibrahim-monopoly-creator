"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonScene } from "@/components/dragons/DragonScene";

type DragonCanvasProps = {
  dragon: DragonCharacter;
  className?: string;
};

export function DragonCanvas({ dragon, className }: DragonCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <DragonScene dragon={dragon} />
        </Suspense>
      </Canvas>
    </div>
  );
}
