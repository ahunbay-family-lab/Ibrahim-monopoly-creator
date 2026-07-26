"use client";

import { Suspense } from "react";
import { View } from "@react-three/drei";
import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonScene } from "@/components/dragons/DragonScene";

type DragonCardProps = {
  dragon: DragonCharacter;
};

export function DragonCard({ dragon }: DragonCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-cyan-950/35 shadow-xl ring-2 ring-cyan-300/50 backdrop-blur-sm">
      <Suspense
        fallback={
          <div className="dragon-canvas-panel flex h-72 items-center justify-center sm:h-80">
            <span className="text-sm font-bold text-cyan-100">Loading…</span>
          </div>
        }
      >
        <View className="dragon-canvas-panel pointer-events-auto h-72 w-full sm:h-80">
          <DragonScene dragon={dragon} />
        </View>
      </Suspense>

      <div className="relative z-30 border-t border-cyan-300/40 bg-cyan-950/50 px-4 py-3 text-center">
        <p className="text-lg font-bold text-cyan-100">{dragon.tribe}</p>
        <p className="text-xl font-extrabold text-white">{dragon.name}</p>
      </div>
    </article>
  );
}
