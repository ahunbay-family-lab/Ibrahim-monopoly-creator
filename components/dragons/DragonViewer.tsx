"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { DRAGON_CHARACTERS } from "@/lib/dragons/characters";
import { TribeSelector } from "@/components/dragons/TribeSelector";

const DragonCanvas = dynamic(
  () => import("@/components/dragons/DragonCanvas").then((mod) => mod.DragonCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-lg font-bold text-cyan-100">
        Loading…
      </div>
    ),
  },
);

/** One big, full-size 3D dragon you can turn — plus a picker to swap tribes. */
export function DragonViewer() {
  const [selectedId, setSelectedId] = useState(DRAGON_CHARACTERS[0].id);
  const dragon =
    DRAGON_CHARACTERS.find((candidate) => candidate.id === selectedId) ??
    DRAGON_CHARACTERS[0];

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:gap-5">
      <div className="relative h-[44dvh] max-h-[30rem] w-full max-w-3xl sm:h-[52dvh] lg:h-[54dvh]">
        <DragonCanvas dragon={dragon} className="h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-2 text-center">
          <p className="text-lg font-bold text-cyan-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {dragon.tribe}
          </p>
          <p className="text-2xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {dragon.name}
          </p>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs font-semibold text-cyan-100/80">
          Drag, swipe, or use arrow keys to turn it • Scroll to zoom
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
