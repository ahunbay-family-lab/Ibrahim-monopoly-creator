import { NextResponse } from "next/server";
import { getPublicRoomState } from "@/lib/monopoly/game-logic";
import { getRoomById } from "@/lib/monopoly/room-store";

type RouteParams = { params: Promise<{ roomId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { roomId } = await params;
  const room = getRoomById(roomId);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(getPublicRoomState(room));
}
