"use client";

import type { DragonCharacter } from "@/lib/dragons/types";

type TribeSelectorProps = {
  dragons: DragonCharacter[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** A row of simple pill buttons for switching which dragon is shown — no cards. */
export function TribeSelector({ dragons, selectedId, onSelect }: TribeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-2">
      {dragons.map((dragon) => {
        const isSelected = dragon.id === selectedId;

        return (
          <button
            key={dragon.id}
            type="button"
            onClick={() => onSelect(dragon.id)}
            aria-pressed={isSelected}
            aria-label={`Show ${dragon.tribe}`}
            className={`flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
              isSelected
                ? "bg-white text-cyan-950 shadow-lg"
                : "bg-cyan-950/40 text-cyan-100 hover:bg-cyan-950/60"
            }`}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: dragon.colors.primary }}
              aria-hidden="true"
            />
            {dragon.tribe}
          </button>
        );
      })}
    </div>
  );
}
