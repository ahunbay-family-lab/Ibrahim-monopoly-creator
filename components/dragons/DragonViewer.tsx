"use client";

import { useState } from "react";
import Image from "next/image";
import { DRAGON_CHARACTERS } from "@/lib/dragons/characters";
import { TribeSelector } from "@/components/dragons/TribeSelector";

/** Displays full-body illustrated dragons in the same style as the reference art. */
export function DragonViewer() {
  const [selectedId, setSelectedId] = useState(DRAGON_CHARACTERS[0].id);
  const dragon =
    DRAGON_CHARACTERS.find((candidate) => candidate.id === selectedId) ??
    DRAGON_CHARACTERS[0];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative h-[55vh] w-full max-w-3xl sm:h-[65vh]">
        <div className="relative h-full w-full">
          <Image
            key={dragon.id}
            src={dragon.imageUrl}
            alt={`${dragon.tribe} dragon illustration`}
            fill
            priority
            sizes="(max-width: 768px) 95vw, 50vw"
            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-2 text-center">
          <p className="text-lg font-bold text-cyan-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {dragon.tribe}
          </p>
          <p className="text-2xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {dragon.name}
          </p>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs font-semibold text-cyan-100/80">
          Full-body dragon artwork style
        </p>
      </div>

      <TribeSelector
        dragons={DRAGON_CHARACTERS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
}
