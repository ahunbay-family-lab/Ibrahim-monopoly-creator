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
      <color attach="background" args={["#0a0a14"]} />
      <fog attach="fog" args={["#0a0a14", 4, 12]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#c4b5fd" />
      <pointLight
        position={[2, 1, 3]}
        intensity={glow ? 1.2 : 0.5}
        color={dragon.colors.accent}
      />
      <spotLight
        position={[0, 6, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#fff5e6"
      />

      <DragonModel dragon={dragon} />

      {glow && (
        <Sparkles
          count={30}
          scale={[3, 2, 2]}
          size={2}
          speed={0.3}
          color={dragon.colors.accent}
          opacity={0.6}
        />
      )}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 1.85}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
      <Environment preset="night" />
    </>
  );
}

export function DragonCanvas({ dragon, className }: DragonCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 3.8], fov: 42 }}
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
