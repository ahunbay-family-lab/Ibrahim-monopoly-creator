"use client";

import Link from "next/link";
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-200 via-green-100 to-teal-100">
        <p className="text-xl font-bold text-emerald-800">Loading game...</p>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-200 via-green-100 to-teal-100 px-6">
        <p className="text-xl font-bold text-red-700">{error}</p>
        <Link
          href="/monopoly"
          className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white"
        >
          Back to Lobby
        </Link>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-green-100 to-teal-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/monopoly"
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              ← Lobby
            </Link>
            <h1 className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">
              🎲 Online Monopoly
            </h1>
          </div>
          <div className="rounded-2xl bg-white/80 px-5 py-3 text-center shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Room Code
            </p>
            <p className="text-2xl font-extrabold tracking-widest text-emerald-900">
              {room.code}
            </p>
            <p className="text-xs text-emerald-600">Share with friends!</p>
          </div>
        </header>

        {room.message && (
          <div className="rounded-xl bg-white/80 px-4 py-3 text-center font-medium text-emerald-900 shadow">
            {room.message}
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-100 px-4 py-2 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4 overflow-x-auto">
            <GameBoard players={room.players} />
            <div className="flex justify-center rounded-2xl bg-white/60 p-4">
              <DiceRoller
                lastRoll={room.lastRoll}
                canRoll={canRoll}
                loading={actionLoading}
                onRoll={() => sendAction("roll-dice")}
              />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-white/80 p-4 shadow">
              <PlayerList
                players={room.players}
                currentPlayerIndex={room.currentPlayerIndex}
                phase={room.phase}
              />
            </div>

            <div className="rounded-2xl bg-white/80 p-4 shadow">
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
    </div>
  );
}
