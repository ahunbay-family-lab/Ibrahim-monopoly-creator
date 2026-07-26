"use client";

import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonCanvas } from "@/components/dragons/DragonCanvas";

type DragonCardProps = {
  dragon: DragonCharacter;
};

export function DragonCard({ dragon }: DragonCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white/80 shadow-lg ring-1 ring-white/60 backdrop-blur-sm">
      <DragonCanvas
        dragon={dragon}
        className="h-52 w-full bg-gradient-to-b from-slate-900/90 to-indigo-950/90 sm:h-56"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
          {dragon.tribe}
        </p>
        <h3 className="text-2xl font-extrabold text-indigo-950">{dragon.name}</h3>
        <p className="text-sm leading-relaxed text-indigo-800">{dragon.description}</p>
      </div>
    </article>
  );
}
