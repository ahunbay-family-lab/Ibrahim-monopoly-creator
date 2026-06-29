import { getSpace } from "@/lib/monopoly/board";
import type { PendingAction } from "@/lib/monopoly/types";
import type { PublicRoomState } from "@/lib/monopoly/use-game-room";

type GameControlsProps = {
  room: PublicRoomState;
  playerId: string;
  loading: boolean;
  onAction: (type: string) => void;
};

export function GameControls({
  room,
  playerId,
  loading,
  onAction,
}: GameControlsProps) {
  const currentPlayer = room.players[room.currentPlayerIndex];
  const me = room.players.find((p) => p.id === playerId);
  const isMyTurn = currentPlayer?.id === playerId;
  const isHost = me?.isHost ?? false;

  if (room.phase === "waiting") {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-kaplan-royal">
          Game Setup
        </h3>
        {isHost ? (
          <button
            type="button"
            onClick={() => onAction("start-game")}
            disabled={loading || room.players.length < 2}
            className="btn-kaplan-action w-full disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start Game"}
          </button>
        ) : (
          <p className="text-center text-sm text-kaplan-gray-dark">
            Waiting for the host to start the game...
          </p>
        )}
      </div>
    );
  }

  if (room.phase === "ended") {
    const winner = room.players.find((p) => p.id === room.winnerId);
    return (
      <div className="bg-kaplan-sky p-4 text-center">
        <p className="text-2xl font-bold text-kaplan-royal">
          {winner?.name} Wins!
        </p>
      </div>
    );
  }

  if (!isMyTurn) {
    return (
      <p className="text-center text-sm text-kaplan-gray-dark">
        Waiting for {currentPlayer?.name} to play...
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {room.phase === "action" && (
        <ActionButtons
          pendingAction={room.pendingAction}
          loading={loading}
          onAction={onAction}
        />
      )}

      {room.phase === "action" && !room.pendingAction && (
        <button
          type="button"
          onClick={() => onAction("end-turn")}
          disabled={loading}
          className="btn-kaplan-primary w-full disabled:opacity-60"
        >
          {loading ? "..." : "End Turn"}
        </button>
      )}
    </div>
  );
}

function ActionButtons({
  pendingAction,
  loading,
  onAction,
}: {
  pendingAction: PendingAction;
  loading: boolean;
  onAction: (type: string) => void;
}) {
  if (!pendingAction) return null;

  if (pendingAction.type === "buy") {
    const space = getSpace(pendingAction.spaceId);
    return (
      <div className="space-y-2">
        <p className="text-center text-sm font-medium text-kaplan-royal">
          Buy {space.name} for ${pendingAction.price}?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onAction("buy-property")}
            disabled={loading}
            className="btn-kaplan-primary min-h-11 flex-1 disabled:opacity-60"
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => onAction("skip-buy")}
            disabled={loading}
            className="min-h-11 flex-1 border border-kaplan-gray-light bg-white py-3 font-semibold text-kaplan-gray-dark disabled:opacity-60"
          >
            Pass
          </button>
        </div>
      </div>
    );
  }

  if (
    pendingAction.type === "pay-rent" ||
    pendingAction.type === "pay-tax" ||
    pendingAction.type === "go-to-jail"
  ) {
    return (
      <button
        type="button"
        onClick={() => onAction("end-turn")}
        disabled={loading}
        className="btn-kaplan-action w-full disabled:opacity-60"
      >
        {loading ? "..." : "Continue"}
      </button>
    );
  }

  return null;
}
