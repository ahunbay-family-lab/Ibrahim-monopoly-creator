"use client";

import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonCanvas } from "@/components/dragons/DragonCanvas";

type DragonCardProps = {
  dragon: DragonCharacter;
};

export function DragonCard({ dragon }: DragonCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl ring-1 ring-red-900/40">
      <DragonCanvas dragon={dragon} className="h-72 w-full sm:h-80" />
      <div className="border-t border-red-900/30 px-4 py-3 text-center">
        <p className="text-lg font-bold text-red-400">{dragon.tribe}</p>
        <p className="text-xl font-extrabold text-white">{dragon.name}</p>
      </div>
    </article>
  );
}
