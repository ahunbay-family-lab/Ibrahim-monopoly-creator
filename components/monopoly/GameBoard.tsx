import { BOARD } from "@/lib/monopoly/board";
import { COLOR_CLASSES } from "@/lib/monopoly/ui-helpers";
import type { PublicPlayer } from "@/lib/monopoly/use-game-room";

type GameBoardProps = {
  players: PublicPlayer[];
};

function SpaceCell({
  space,
  players,
  compact,
}: {
  space: (typeof BOARD)[number];
  players: PublicPlayer[];
  compact?: boolean;
}) {
  const playersHere = players.filter(
    (p) => !p.isBankrupt && p.position === space.id,
  );
  const colorClass = space.color ? COLOR_CLASSES[space.color] : "";

  return (
    <div
      className={`relative flex flex-col border border-emerald-900/20 bg-white ${
        compact ? "h-12 w-16 text-[7px]" : "h-16 w-20 text-[8px] sm:h-20 sm:w-24 sm:text-[9px]"
      }`}
      title={space.name}
    >
      {space.color && (
        <div className={`h-2 w-full shrink-0 ${colorClass}`} />
      )}
      <div className="flex flex-1 flex-col items-center justify-center p-0.5 text-center leading-tight">
        <span className="line-clamp-2 font-semibold text-emerald-950">
          {space.name}
        </span>
        {space.price && (
          <span className="text-emerald-700">${space.price}</span>
        )}
      </div>
      {playersHere.length > 0 && (
        <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-0.5">
          {playersHere.map((player) => (
            <span
              key={player.id}
              className="text-sm leading-none drop-shadow"
              title={player.name}
            >
              {player.token}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CornerCell({
  label,
  emoji,
  players,
  position,
}: {
  label: string;
  emoji: string;
  players: PublicPlayer[];
  position: number;
}) {
  const playersHere = players.filter(
    (p) => !p.isBankrupt && p.position === position,
  );

  return (
    <div className="relative flex h-16 w-20 flex-col items-center justify-center border border-emerald-900/20 bg-emerald-50 p-1 text-center sm:h-20 sm:w-24">
      <span className="text-lg">{emoji}</span>
      <span className="text-[8px] font-bold text-emerald-900 sm:text-[9px]">
        {label}
      </span>
      {playersHere.length > 0 && (
        <div className="absolute -bottom-1 flex gap-0.5">
          {playersHere.map((player) => (
            <span key={player.id} className="text-sm">
              {player.token}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function GameBoard({ players }: GameBoardProps) {
  const bottom = [...BOARD.slice(0, 11)].reverse();
  const left = BOARD.slice(11, 20).reverse();
  const top = BOARD.slice(20, 31);
  const right = BOARD.slice(31, 40);

  return (
    <div className="mx-auto w-fit rounded-xl bg-emerald-800 p-2 shadow-2xl">
      <div className="grid grid-cols-[auto_1fr_auto] gap-0">
        <CornerCell label="Free Parking" emoji="🅿️" players={players} position={20} />

        <div className="flex">
          {top.map((space) => (
            <SpaceCell key={space.id} space={space} players={players} />
          ))}
        </div>

        <CornerCell label="Go To Jail" emoji="👮" players={players} position={30} />

        <div className="flex flex-col">
          {left.map((space) => (
            <SpaceCell key={space.id} space={space} players={players} compact />
          ))}
        </div>

        <div className="flex min-h-32 min-w-48 flex-col items-center justify-center bg-emerald-700 p-4 text-center sm:min-h-40 sm:min-w-56">
          <p className="text-2xl font-extrabold text-yellow-300 sm:text-3xl">
            MONOPOLY
          </p>
          <p className="mt-1 text-xs text-emerald-100 sm:text-sm">
            Family Lab Edition
          </p>
        </div>

        <div className="flex flex-col">
          {right.map((space) => (
            <SpaceCell key={space.id} space={space} players={players} compact />
          ))}
        </div>

        <CornerCell label="Jail" emoji="🔒" players={players} position={10} />

        <div className="flex">
          {bottom.map((space) => (
            <SpaceCell key={space.id} space={space} players={players} />
          ))}
        </div>

        <CornerCell label="GO" emoji="🏁" players={players} position={0} />
      </div>
    </div>
  );
}
