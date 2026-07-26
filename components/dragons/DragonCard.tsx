"use client";

import type { DragonCharacter } from "@/lib/dragons/types";
import { DragonCanvas } from "@/components/dragons/DragonCanvas";
import Image from "next/image";

type DragonCardProps = {
  dragon: DragonCharacter;
};

export function DragonCard({ dragon }: DragonCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl ring-1 ring-white/10 transition hover:ring-amber-400/40">
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={dragon.imageUrl}
          alt={`${dragon.tribe} dragon`}
          fill
          className="object-cover opacity-20 blur-sm transition group-hover:opacity-0"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <DragonCanvas dragon={dragon} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-white/10 bg-slate-950/90 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
          {dragon.tribe}
        </p>
        <h3 className="text-2xl font-extrabold text-white">{dragon.name}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{dragon.description}</p>
      </div>
    </article>
  );
}
