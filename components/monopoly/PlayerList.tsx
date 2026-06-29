import type { PublicPlayer } from "@/lib/monopoly/use-game-room";
import { MIN_PLAYERS } from "@/lib/monopoly/types";

type PlayerListProps = {
  players: PublicPlayer[];
  currentPlayerIndex: number;
  phase: string;
};

export function PlayerList({
  players,
  currentPlayerIndex,
  phase,
}: PlayerListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold uppercase tracking-wide text-kaplan-royal">
        Players ({players.length})
      </h3>
      <ul className="space-y-2">
        {players.map((player, index) => {
          const isCurrent =
            phase !== "waiting" &&
            phase !== "ended" &&
            index === currentPlayerIndex;

          return (
            <li
              key={player.id}
              className={`flex items-center gap-3 border px-3 py-2 ${
                isCurrent
                  ? "border-kaplan-yellow bg-yellow-50"
                  : "border-kaplan-gray-light bg-white"
              } ${player.isBankrupt ? "opacity-50" : ""}`}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: `${player.color}33` }}
              >
                {player.token}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-kaplan-royal">
                  {player.name}
                  {player.isHost && (
                    <span className="ml-1 text-xs text-kaplan-gray-dark">
                      (host)
                    </span>
                  )}
                </p>
                <p className="text-sm text-kaplan-gray-dark">
                  ${player.money.toLocaleString()}
                  {player.isBankrupt && " · Bankrupt"}
                  {player.inJail && " · In Jail"}
                </p>
              </div>
              {isCurrent && (
                <span className="text-xs font-bold text-kaplan-purple">
                  TURN
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {players.length < MIN_PLAYERS && (
        <p className="text-sm text-kaplan-gray-dark">
          Need at least {MIN_PLAYERS} players to start
        </p>
      )}
    </div>
  );
}
