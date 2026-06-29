"use client";

import Link from "next/link";
import { KaplanShell } from "@/components/kaplan/KaplanShell";
import { GameBoard } from "@/components/monopoly/GameBoard";
import { DiceRoller } from "@/components/monopoly/DiceRoller";
import { GameControls } from "@/components/monopoly/GameControls";
import { PlayerList } from "@/components/monopoly/PlayerList";
import { useGameRoom } from "@/lib/monopoly/use-game-room";

type MonopolyGameProps = {
  roomId: string;
  playerId: string;
};

export function MonopolyGame({ roomId, playerId }: MonopolyGameProps) {
  const { room, error, loading, actionLoading, sendAction } = useGameRoom(
    roomId,
    playerId,
  );

  if (loading) {
    return (
      <KaplanShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xl font-semibold text-kaplan-royal">
            Loading game...
          </p>
        </div>
      </KaplanShell>
    );
  }

  if (error && !room) {
    return (
      <KaplanShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
          <p className="text-xl font-semibold text-kaplan-red">{error}</p>
          <Link href="/monopoly" className="btn-kaplan-primary">
            Back to Lobby
          </Link>
        </div>
      </KaplanShell>
    );
  }

  if (!room) return null;

  const currentPlayer = room.players[room.currentPlayerIndex];
  const isMyTurn =
    currentPlayer?.id === playerId &&
    room.phase !== "waiting" &&
    room.phase !== "ended";
  const canRoll = isMyTurn && room.phase === "rolling";

  return (
    <KaplanShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Play Online", href: "/monopoly" },
        { label: `Room ${room.code}` },
      ]}
    >
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-kaplan-gray-light pb-4">
          <div>
            <h1 className="text-2xl font-bold text-kaplan-royal sm:text-3xl">
              MONOPOLY® Classic — Online Game
            </h1>
            <p className="mt-1 text-sm text-kaplan-gray-dark">
              Item 26251 · Live multiplayer session
            </p>
          </div>
          <div className="product-card-border px-5 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-kaplan-gray-dark">
              Room Code
            </p>
            <p className="text-2xl font-bold tracking-widest text-kaplan-royal">
              {room.code}
            </p>
            <p className="text-xs text-kaplan-green-dark">Share with friends</p>
          </div>
        </header>

        {room.message && (
          <div className="product-card-border px-4 py-3 text-center font-medium text-kaplan-royal">
            {room.message}
          </div>
        )}

        {error && (
          <p className="bg-red-50 px-4 py-2 text-center text-sm text-kaplan-red">
            {error}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4 overflow-x-auto">
            <GameBoard players={room.players} />
            <div className="product-card-border flex justify-center p-4">
              <DiceRoller
                lastRoll={room.lastRoll}
                canRoll={canRoll}
                loading={actionLoading}
                onRoll={() => sendAction("roll-dice")}
              />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="product-card-border p-4">
              <PlayerList
                players={room.players}
                currentPlayerIndex={room.currentPlayerIndex}
                phase={room.phase}
              />
            </div>

            <div className="product-card-border p-4">
              <GameControls
                room={room}
                playerId={playerId}
                loading={actionLoading}
                onAction={sendAction}
              />
            </div>
          </aside>
        </div>
      </div>
    </KaplanShell>
  );
}
