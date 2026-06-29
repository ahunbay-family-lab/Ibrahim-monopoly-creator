"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MonopolyGame } from "@/components/monopoly/MonopolyGame";
import { KaplanShell } from "@/components/kaplan/KaplanShell";
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
      <KaplanShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xl font-semibold text-kaplan-royal">
            Joining room...
          </p>
        </div>
      </KaplanShell>
    );
  }

  return <MonopolyGame roomId={roomId} playerId={playerId} />;
}
