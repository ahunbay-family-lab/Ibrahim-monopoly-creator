import type { GameRoom } from "./types";

const rooms = new Map<string, GameRoom>();
const codeIndex = new Map<string, string>();

const ROOM_TTL_MS = 2 * 60 * 60 * 1000;

function cleanupExpiredRooms(): void {
  const now = Date.now();
  for (const [id, room] of rooms) {
    if (now - room.updatedAt > ROOM_TTL_MS) {
      rooms.delete(id);
      codeIndex.delete(room.code);
    }
  }
}

export function saveRoom(room: GameRoom): void {
  cleanupExpiredRooms();
  rooms.set(room.id, room);
  codeIndex.set(room.code, room.id);
}

export function getRoomById(roomId: string): GameRoom | undefined {
  cleanupExpiredRooms();
  return rooms.get(roomId);
}

export function getRoomByCode(code: string): GameRoom | undefined {
  cleanupExpiredRooms();
  const roomId = codeIndex.get(code.toUpperCase());
  if (!roomId) return undefined;
  return rooms.get(roomId);
}

export function deleteRoom(roomId: string): void {
  const room = rooms.get(roomId);
  if (room) {
    codeIndex.delete(room.code);
    rooms.delete(roomId);
  }
}
