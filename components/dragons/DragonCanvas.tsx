"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonModel } from "@/components/dragons/DragonModel";

type DragonCanvasProps = {
  dragon: DragonCharacter;
  className?: string;
};

function Scene({ dragon }: { dragon: DragonCharacter }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a8c8ff" />
      <DragonModel dragon={dragon} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
      <Environment preset="sunset" />
    </>
  );
}

export function DragonCanvas({ dragon, className }: DragonCanvasProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0.5, 3.2], fov: 45 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Scene dragon={dragon} />
        </Suspense>
      </Canvas>
    </div>
  );
}
