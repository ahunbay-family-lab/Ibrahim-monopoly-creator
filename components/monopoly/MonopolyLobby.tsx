"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/monopoly/use-game-room";

type Mode = "create" | "join";

export function MonopolyLobby() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("create");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/monopoly/rooms"
          : "/api/monopoly/rooms/join";

      const body =
        mode === "create"
          ? { playerName }
          : { playerName, code: roomCode.toUpperCase() };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      saveSession(data.roomId, data.playerId);
      router.push(`/monopoly/${data.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex border border-kaplan-gray-light p-1">
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            mode === "create"
              ? "bg-kaplan-royal text-white"
              : "text-kaplan-royal hover:bg-kaplan-sky"
          }`}
        >
          Create Game
        </button>
        <button
          type="button"
          onClick={() => setMode("join")}
          className={`flex-1 py-3 text-sm font-semibold transition ${
            mode === "join"
              ? "bg-kaplan-royal text-white"
              : "text-kaplan-royal hover:bg-kaplan-sky"
          }`}
        >
          Join Game
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="player-name"
            className="mb-1 block text-sm font-semibold text-kaplan-royal"
          >
            Your Name
          </label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            required
            className="w-full border border-kaplan-gray-light px-4 py-3 text-kaplan-gray-dark outline-none focus:border-kaplan-royal"
          />
        </div>

        {mode === "join" && (
          <div>
            <label
              htmlFor="room-code"
              className="mb-1 block text-sm font-semibold text-kaplan-royal"
            >
              Room Code
            </label>
            <input
              id="room-code"
              type="text"
              value={roomCode}
              onChange={(e) =>
                setRoomCode(e.target.value.toUpperCase().slice(0, 6))
              }
              placeholder="ABC123"
              maxLength={6}
              required
              className="w-full border border-kaplan-gray-light px-4 py-3 text-center text-2xl font-bold tracking-widest text-kaplan-royal outline-none focus:border-kaplan-royal"
            />
          </div>
        )}

        {error && (
          <p className="bg-red-50 px-4 py-2 text-sm font-medium text-kaplan-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-kaplan-action w-full disabled:opacity-60"
        >
          {loading
            ? "Loading..."
            : mode === "create"
              ? "Create Room"
              : "Join Room"}
        </button>
      </form>
    </div>
  );
}
