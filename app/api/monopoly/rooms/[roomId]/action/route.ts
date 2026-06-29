import { NextResponse } from "next/server";
import { applyGameAction } from "@/lib/monopoly/game-logic";
import { getPublicRoomState } from "@/lib/monopoly/game-logic";
import { getRoomById, saveRoom } from "@/lib/monopoly/room-store";
import type { GameAction } from "@/lib/monopoly/types";

type RouteParams = { params: Promise<{ roomId: string }> };

const VALID_ACTIONS = [
  "start-game",
  "roll-dice",
  "buy-property",
  "skip-buy",
  "end-turn",
] as const;

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { roomId } = await params;
    const room = getRoomById(roomId);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const body = await request.json();
    const actionType = body.type;
    const playerId = body.playerId;

    if (
      typeof actionType !== "string" ||
      !VALID_ACTIONS.includes(actionType as (typeof VALID_ACTIONS)[number])
    ) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (typeof playerId !== "string" || !playerId) {
      return NextResponse.json({ error: "Missing player ID" }, { status: 400 });
    }

    const action: GameAction = { type: actionType, playerId } as GameAction;
    const updatedRoom = applyGameAction(room, action);
    saveRoom(updatedRoom);

    return NextResponse.json(getPublicRoomState(updatedRoom));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
