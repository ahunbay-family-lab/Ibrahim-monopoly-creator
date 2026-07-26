"use client";

import dynamic from "next/dynamic";
import type { DragonCharacter } from "@/lib/dragons/types";

const DragonCanvas = dynamic(
  () => import("@/components/dragons/DragonCanvas").then((mod) => mod.DragonCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="dragon-canvas-panel flex h-72 items-center justify-center sm:h-80">
        <span className="text-sm font-bold text-cyan-100">Loading…</span>
      </div>
    ),
  },
);

type DragonCardProps = {
  dragon: DragonCharacter;
};

export function DragonCard({ dragon }: DragonCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-cyan-950/35 shadow-xl ring-2 ring-cyan-300/50 backdrop-blur-sm">
      <DragonCanvas
        dragon={dragon}
        className="dragon-canvas-panel pointer-events-auto h-72 w-full sm:h-80"
      />

      <div className="relative z-30 border-t border-cyan-300/40 bg-cyan-950/50 px-4 py-3 text-center">
        <p className="text-lg font-bold text-cyan-100">{dragon.tribe}</p>
        <p className="text-xl font-extrabold text-white">{dragon.name}</p>
      </div>
    </article>
  );
}
