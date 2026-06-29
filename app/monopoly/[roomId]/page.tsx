"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MonopolyGame } from "@/components/monopoly/MonopolyGame";
import { loadSession } from "@/lib/monopoly/use-game-room";

function getPlayerIdForRoom(roomId: string): string | null {
  const session = loadSession();
  if (!session || session.roomId !== roomId) {
    return null;
  }
  return session.playerId;
}

export default function MonopolyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const [playerId] = useState(() => getPlayerIdForRoom(roomId));

  useEffect(() => {
    if (!playerId) {
      router.replace("/monopoly");
    }
  }, [playerId, router]);

  if (!playerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-200 via-green-100 to-teal-100">
        <p className="text-xl font-bold text-emerald-800">Joining room...</p>
      </div>
    );
  }

  return <MonopolyGame roomId={roomId} playerId={playerId} />;
}
