"use client";

import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonCanvas } from "@/components/dragons/DragonCanvas";

type DragonCardProps = {
  dragon: DragonCharacter;
};

export function DragonCard({ dragon }: DragonCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-cyan-950/35 shadow-xl ring-2 ring-cyan-300/50 backdrop-blur-sm">
      <DragonCanvas dragon={dragon} className="h-72 w-full sm:h-80" />
      <div className="border-t border-cyan-300/40 bg-cyan-950/50 px-4 py-3 text-center">
        <p className="text-lg font-bold text-cyan-100">{dragon.tribe}</p>
        <p className="text-xl font-extrabold text-white">{dragon.name}</p>
      </div>
    </article>
  );
}
