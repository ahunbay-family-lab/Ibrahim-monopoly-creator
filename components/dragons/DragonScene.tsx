"use client";

import { forwardRef } from "react";
import { OrbitControls, Sparkles } from "@react-three/drei";
import type { DragonCharacter } from "@/lib/dragons/types";
import type { DragonSpinHandle } from "@/lib/dragons/drag";
import { DragonModel } from "@/components/dragons/DragonModel";

type DragonSceneProps = {
  dragon: DragonCharacter;
  cameraDistance?: number;
};

export const DragonScene = forwardRef<DragonSpinHandle, DragonSceneProps>(
  function DragonScene({ dragon, cameraDistance = 3.5 }, spinHandleRef) {
    const glow =
      dragon.traits.hasBioluminescence || dragon.traits.hasStarryWings;

    return (
      <>
        {/*
          Lower ambient/hemisphere light plus a brighter key light gives the dragon's
          scales real shadows and highlights instead of looking flat. The fill lights
          use warm, neutral tones so the dragon's own colors stay true to the tribe.
        */}
        <ambientLight intensity={0.7} />
        <hemisphereLight intensity={0.6} groundColor="#0f172a" color="#ffffff" />
        <directionalLight position={[5, 8, 6]} intensity={3.2} />
        <directionalLight position={[-4, 3, -2]} intensity={0.8} color="#ffd9a0" />
        <pointLight position={[2, 2, 4]} intensity={glow ? 1.6 : 1} color="#fff4e0" />

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

        {/* Rotation is handled by dragging/keyboard directly on the dragon (see
            DragonModel), so orbit controls here are just for zooming in and out. */}
        <OrbitControls
          enableRotate={false}
          enableZoom={true}
          enablePan={false}
          minDistance={cameraDistance * 0.55}
          maxDistance={cameraDistance * 1.6}
        />
      </>
    );
  },
);
