import { NextResponse } from "next/server";
import { createRoom } from "@/lib/monopoly/game-logic";
import { saveRoom } from "@/lib/monopoly/room-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const playerName = typeof body.playerName === "string" ? body.playerName : "";

    if (!playerName.trim()) {
      return NextResponse.json(
        { error: "Please enter your name" },
        { status: 400 },
      );
    }

    const room = createRoom(playerName);
    saveRoom(room);

    const host = room.players[0];

    return NextResponse.json({
      roomId: room.id,
      code: room.code,
      playerId: host.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create room" },
      { status: 500 },
    );
  }
}
