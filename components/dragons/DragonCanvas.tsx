"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Sparkles } from "@react-three/drei";
import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonModel } from "@/components/dragons/DragonModel";

type DragonCanvasProps = {
  dragon: DragonCharacter;
  className?: string;
};

function Scene({ dragon }: { dragon: DragonCharacter }) {
  const glow =
    dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings;

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 5, 14]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[6, 10, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.7} color="#ff6b6b" />
      <pointLight position={[3, 2, 4]} intensity={glow ? 1.5 : 0.8} color={dragon.colors.accent} />
      <spotLight
        position={[0, 8, 2]}
        angle={0.45}
        penumbra={0.9}
        intensity={1.2}
        color="#ffe4c4"
        castShadow
      />

      <DragonModel dragon={dragon} />

      {glow && (
        <Sparkles
          count={40}
          scale={[4, 3, 3]}
          size={2.5}
          speed={0.35}
          color={dragon.colors.accent}
          opacity={0.7}
        />
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
      />
      <Environment preset="warehouse" />
    </>
  );
}

export function DragonCanvas({ dragon, className }: DragonCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene dragon={dragon} />
        </Suspense>
      </Canvas>
    </div>
  );
}
