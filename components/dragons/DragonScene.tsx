"use client";

import { forwardRef } from "react";
import { OrbitControls, Sparkles } from "@react-three/drei";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { DragonModel } from "@/components/dragons/DragonModel";

type DragonSceneProps = {
  dragon: DragonCharacter;
};

export const DragonScene = forwardRef<DragonSpinHandle, DragonSceneProps>(
  function DragonScene({ dragon }, spinHandleRef) {
    const glow =
      dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings;

    return (
      <>
        <ambientLight intensity={1.4} />
        <hemisphereLight intensity={0.8} groundColor="#004d40" color="#ffffff" />
        <directionalLight position={[5, 8, 6]} intensity={2.5} />
        <directionalLight position={[-4, 3, -2]} intensity={1} color="#7df9ff" />
        <pointLight position={[2, 2, 4]} intensity={glow ? 1.8 : 1.2} color="#39ff14" />

        <DragonModel ref={spinHandleRef} dragon={dragon} />

        {glow && (
          <Sparkles
            count={20}
            scale={[2.5, 2, 2]}
            size={2}
            speed={0.3}
            color={dragon.colors.accent}
            opacity={0.7}
          />
        )}

        {/* Rotation is handled by dragging the dragon directly (see DragonModel),
            so orbit controls here are just for zooming in and out. */}
        <OrbitControls
          enableRotate={false}
          enableZoom={true}
          enablePan={false}
          minDistance={1.2}
          maxDistance={7}
        />
      </>
    );
  },
);
