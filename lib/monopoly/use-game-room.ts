"use client";

import { useCallback, useEffect, useState } from "react";
import type { GamePhase, LastRoll, PendingAction } from "@/lib/monopoly/types";

export type PublicPlayer = {
  id: string;
  name: string;
  token: string;
  color: string;
  money: number;
  position: number;
  properties: number[];
  inJail: boolean;
  isBankrupt: boolean;
  isHost: boolean;
};

export type PublicRoomState = {
  id: string;
  code: string;
  players: PublicPlayer[];
  currentPlayerIndex: number;
  phase: GamePhase;
  lastRoll: LastRoll;
  pendingAction: PendingAction;
  message: string;
  winnerId: string | null;
  playerCount: number;
  maxPlayers: number;
  updatedAt: number;
};

const PLAYER_ID_KEY = "monopoly-player-id";
const ROOM_ID_KEY = "monopoly-room-id";

export function saveSession(roomId: string, playerId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROOM_ID_KEY, roomId);
  localStorage.setItem(PLAYER_ID_KEY, playerId);
}

export function loadSession(): { roomId: string; playerId: string } | null {
  if (typeof window === "undefined") return null;
  const roomId = localStorage.getItem(ROOM_ID_KEY);
  const playerId = localStorage.getItem(PLAYER_ID_KEY);
  if (!roomId || !playerId) return null;
  return { roomId, playerId };
}

export function useGameRoom(roomId: string, playerId: string) {
  const [room, setRoom] = useState<PublicRoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function pollRoom() {
      try {
        const response = await fetch(`/api/monopoly/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error("Room not found");
        }
        const data = (await response.json()) as PublicRoomState;
        if (!cancelled) {
          setRoom(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load room");
          setLoading(false);
        }
      }
    }

    void pollRoom();
    const interval = setInterval(() => {
      void pollRoom();
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [roomId]);

  const sendAction = useCallback(
    async (type: string) => {
      setActionLoading(true);
      try {
        const response = await fetch(`/api/monopoly/rooms/${roomId}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, playerId }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Action failed");
        }

        setRoom(data as PublicRoomState);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Action failed");
      } finally {
        setActionLoading(false);
      }
    },
    [roomId, playerId],
  );

  return { room, error, loading, actionLoading, sendAction };
}
