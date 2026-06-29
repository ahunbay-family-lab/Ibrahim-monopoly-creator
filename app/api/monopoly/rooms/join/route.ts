import { NextResponse } from "next/server";
import { joinRoom } from "@/lib/monopoly/game-logic";
import { getRoomByCode, saveRoom } from "@/lib/monopoly/room-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const playerName =
      typeof body.playerName === "string" ? body.playerName : "";

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Please enter a valid 6-character room code" },
        { status: 400 },
      );
    }

    if (!playerName.trim()) {
      return NextResponse.json(
        { error: "Please enter your name" },
        { status: 400 },
      );
    }

    const room = getRoomByCode(code);
    if (!room) {
      return NextResponse.json(
        { error: "Room not found. Check the code and try again." },
        { status: 404 },
      );
    }

    const player = joinRoom(room, playerName);
    saveRoom(room);

    return NextResponse.json({
      roomId: room.id,
      code: room.code,
      playerId: player.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not join room";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
