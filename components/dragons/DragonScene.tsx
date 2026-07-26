"use client";

import { Bounds, Environment, OrbitControls, Sparkles } from "@react-three/drei";
import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonModel } from "@/components/dragons/DragonModel";

type DragonSceneProps = {
  dragon: DragonCharacter;
};

export function DragonScene({ dragon }: DragonSceneProps) {
  const glow =
    dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings;

  return (
    <>
      <ambientLight intensity={1.1} />
      <hemisphereLight intensity={0.6} groundColor="#004d40" color="#e0ffff" />
      <directionalLight position={[6, 10, 5]} intensity={2.8} castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={1.2} color="#7df9ff" />
      <pointLight position={[3, 2, 4]} intensity={glow ? 2 : 1.4} color="#39ff14" />

      <Bounds fit clip observe margin={1.35}>
        <DragonModel dragon={dragon} />
      </Bounds>

      {glow && (
        <Sparkles
          count={25}
          scale={[3, 2.5, 2.5]}
          size={2}
          speed={0.3}
          color={dragon.colors.accent}
          opacity={0.75}
        />
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
      />
      <Environment preset="city" />
    </>
  );
}
