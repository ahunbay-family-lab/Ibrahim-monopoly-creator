import { BOARD_SIZE, getSpace, isOwnable } from "./board";
import { getColorForIndex, getTokenForIndex } from "./player-tokens";
import type {
  GameAction,
  GameRoom,
  LastRoll,
  Player,
} from "./types";
import { GO_BONUS, MAX_PLAYERS, MIN_PLAYERS, STARTING_MONEY } from "./types";

function generateId(): string {
  return crypto.randomUUID();
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function rollDice(): NonNullable<LastRoll> {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return { die1, die2, total: die1 + die2, isDoubles: die1 === die2 };
}

function getPropertyOwner(
  room: GameRoom,
  spaceId: number,
): Player | undefined {
  return room.players.find(
    (player) => !player.isBankrupt && player.properties.includes(spaceId),
  );
}

function countOwnedRailroads(player: Player): number {
  return player.properties.filter((id) => getSpace(id).type === "railroad")
    .length;
}

function countOwnedUtilities(player: Player): number {
  return player.properties.filter((id) => getSpace(id).type === "utility")
    .length;
}

function calculateRent(room: GameRoom, spaceId: number, owner: Player): number {
  const space = getSpace(spaceId);

  if (space.type === "railroad") {
    const count = countOwnedRailroads(owner);
    return 25 * 2 ** (count - 1);
  }

  if (space.type === "utility") {
    const count = countOwnedUtilities(owner);
    const multiplier = count === 2 ? 10 : 4;
    const roll = room.lastRoll?.total ?? 7;
    return roll * multiplier;
  }

  return space.rent ?? 0;
}

function getActivePlayers(room: GameRoom): Player[] {
  return room.players.filter((player) => !player.isBankrupt);
}

function findNextPlayerIndex(room: GameRoom): number {
  const total = room.players.length;
  let index = room.currentPlayerIndex;

  for (let step = 0; step < total; step++) {
    index = (index + 1) % total;
    if (!room.players[index].isBankrupt) {
      return index;
    }
  }

  return room.currentPlayerIndex;
}

function checkWinner(room: GameRoom): string | null {
  const active = getActivePlayers(room);
  if (active.length === 1 && room.phase !== "waiting") {
    return active[0].id;
  }
  return null;
}

function handleBankruptcy(
  room: GameRoom,
  player: Player,
  creditorId: string | null,
): void {
  player.isBankrupt = true;
  player.money = 0;

  const creditor = creditorId
    ? room.players.find((p) => p.id === creditorId)
    : null;

  if (creditor) {
    creditor.money += player.money;
    creditor.properties.push(...player.properties);
  }

  player.properties = [];
  room.message = `${player.name} is bankrupt!`;
}

function payAmount(
  room: GameRoom,
  player: Player,
  amount: number,
  creditorId: string | null,
  reason: string,
): boolean {
  if (player.money >= amount) {
    player.money -= amount;
    const creditor = creditorId
      ? room.players.find((p) => p.id === creditorId)
      : null;
    if (creditor) {
      creditor.money += amount;
    }
    room.message = `${player.name} paid $${amount} ${reason}`;
    return true;
  }

  handleBankruptcy(room, player, creditorId);
  return false;
}

function resolveLanding(room: GameRoom, player: Player): void {
  const space = getSpace(player.position);

  if (space.type === "go-to-jail") {
    player.position = 10;
    player.inJail = true;
    player.jailTurns = 0;
    room.pendingAction = { type: "go-to-jail" };
    room.message = `${player.name} landed on Go To Jail!`;
    room.phase = "action";
    return;
  }

  if (space.type === "tax") {
    const amount = space.name === "Income Tax" ? 200 : 100;
    room.pendingAction = { type: "pay-tax", amount };
    room.message = `${player.name} owes $${amount} in taxes`;
    room.phase = "action";
    return;
  }

  if (space.type === "chance" || space.type === "community-chest") {
    const bonus = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
    player.money += bonus;
    room.message = `${player.name} drew a card and received $${bonus}!`;
    room.phase = "action";
    return;
  }

  if (!isOwnable(space.type)) {
    room.message = `${player.name} landed on ${space.name}`;
    room.phase = "action";
    return;
  }

  const owner = getPropertyOwner(room, space.id);

  if (!owner) {
    if (space.price && player.money >= space.price) {
      room.pendingAction = {
        type: "buy",
        spaceId: space.id,
        price: space.price,
      };
      room.message = `${space.name} is for sale for $${space.price}`;
    } else {
      room.message = `${player.name} landed on ${space.name} (can't afford it)`;
    }
    room.phase = "action";
    return;
  }

  if (owner.id === player.id) {
    room.message = `${player.name} landed on their own property`;
    room.phase = "action";
    return;
  }

  const rent = calculateRent(room, space.id, owner);
  room.pendingAction = {
    type: "pay-rent",
    spaceId: space.id,
    amount: rent,
    toPlayerId: owner.id,
  };
  room.message = `${player.name} owes $${rent} rent to ${owner.name}`;
  room.phase = "action";
}

function movePlayer(room: GameRoom, player: Player, steps: number): void {
  const oldPosition = player.position;
  player.position = (player.position + steps) % BOARD_SIZE;

  if (player.position < oldPosition) {
    player.money += GO_BONUS;
    room.message = `${player.name} passed GO and collected $${GO_BONUS}!`;
  }
}

function resolvePendingAction(room: GameRoom, player: Player): void {
  const action = room.pendingAction;
  if (!action) return;

  if (action.type === "pay-rent") {
    payAmount(
      room,
      player,
      action.amount,
      action.toPlayerId,
      `rent for ${getSpace(action.spaceId).name}`,
    );
  } else if (action.type === "pay-tax") {
    payAmount(room, player, action.amount, null, "in taxes");
  }

  room.pendingAction = null;
}

function advanceTurn(room: GameRoom): void {
  const winner = checkWinner(room);
  if (winner) {
    room.winnerId = winner;
    room.phase = "ended";
    const winnerPlayer = room.players.find((p) => p.id === winner);
    room.message = `🎉 ${winnerPlayer?.name} wins the game!`;
    return;
  }

  room.currentPlayerIndex = findNextPlayerIndex(room);
  room.lastRoll = null;
  room.pendingAction = null;
  room.phase = "rolling";

  const nextPlayer = room.players[room.currentPlayerIndex];
  room.message = `It's ${nextPlayer.name}'s turn`;
}

export function createRoom(hostName: string): GameRoom {
  const playerId = generateId();
  const now = Date.now();

  const host: Player = {
    id: playerId,
    name: hostName.trim().slice(0, 20) || "Player 1",
    token: getTokenForIndex(0),
    color: getColorForIndex(0),
    money: STARTING_MONEY,
    position: 0,
    properties: [],
    inJail: false,
    jailTurns: 0,
    isBankrupt: false,
    isHost: true,
  };

  return {
    id: generateId(),
    code: generateRoomCode(),
    players: [host],
    currentPlayerIndex: 0,
    phase: "waiting",
    lastRoll: null,
    pendingAction: null,
    message: "Waiting for players to join...",
    winnerId: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function joinRoom(room: GameRoom, playerName: string): Player {
  if (room.phase !== "waiting") {
    throw new Error("Game has already started");
  }

  if (room.players.length >= MAX_PLAYERS) {
    throw new Error("Room is full");
  }

  const index = room.players.length;
  const player: Player = {
    id: generateId(),
    name: playerName.trim().slice(0, 20) || `Player ${index + 1}`,
    token: getTokenForIndex(index),
    color: getColorForIndex(index),
    money: STARTING_MONEY,
    position: 0,
    properties: [],
    inJail: false,
    jailTurns: 0,
    isBankrupt: false,
    isHost: false,
  };

  room.players.push(player);
  room.message = `${player.name} joined the game!`;
  room.updatedAt = Date.now();

  return player;
}

export function applyGameAction(room: GameRoom, action: GameAction): GameRoom {
  const player = room.players.find((p) => p.id === action.playerId);
  if (!player || player.isBankrupt) {
    throw new Error("Invalid player");
  }

  switch (action.type) {
    case "start-game": {
      if (!player.isHost) throw new Error("Only the host can start");
      if (room.phase !== "waiting") throw new Error("Game already started");
      if (room.players.length < MIN_PLAYERS) {
        throw new Error(`Need at least ${MIN_PLAYERS} players`);
      }

      room.phase = "rolling";
      room.message = `Game started! ${room.players[0].name}'s turn`;
      break;
    }

    case "roll-dice": {
      if (room.phase !== "rolling") throw new Error("Not time to roll");
      if (room.players[room.currentPlayerIndex].id !== player.id) {
        throw new Error("Not your turn");
      }

      const roll = rollDice();
      room.lastRoll = roll;

      if (player.inJail) {
        if (roll.isDoubles) {
          player.inJail = false;
          player.jailTurns = 0;
          movePlayer(room, player, roll.total);
          room.message = `${player.name} rolled doubles and left jail!`;
          resolveLanding(room, player);
        } else {
          player.jailTurns += 1;
          if (player.jailTurns >= 3) {
            payAmount(room, player, 50, null, "to leave jail");
            player.inJail = false;
            player.jailTurns = 0;
            movePlayer(room, player, roll.total);
            resolveLanding(room, player);
          } else {
            room.message = `${player.name} is still in jail (turn ${player.jailTurns}/3)`;
            room.phase = "action";
          }
        }
      } else {
        movePlayer(room, player, roll.total);
        resolveLanding(room, player);
      }
      break;
    }

    case "buy-property": {
      if (room.phase !== "action") throw new Error("No action available");
      if (room.players[room.currentPlayerIndex].id !== player.id) {
        throw new Error("Not your turn");
      }
      if (room.pendingAction?.type !== "buy") {
        throw new Error("Cannot buy right now");
      }

      const { spaceId, price } = room.pendingAction;
      if (player.money < price) throw new Error("Not enough money");

      player.money -= price;
      player.properties.push(spaceId);
      room.pendingAction = null;
      room.message = `${player.name} bought ${getSpace(spaceId).name} for $${price}!`;
      break;
    }

    case "skip-buy": {
      if (room.phase !== "action") throw new Error("No action available");
      if (room.players[room.currentPlayerIndex].id !== player.id) {
        throw new Error("Not your turn");
      }
      if (room.pendingAction?.type === "buy") {
        room.message = `${player.name} passed on buying ${getSpace(room.pendingAction.spaceId).name}`;
        room.pendingAction = null;
      }
      break;
    }

    case "end-turn": {
      if (room.phase !== "action") throw new Error("Cannot end turn yet");
      if (room.players[room.currentPlayerIndex].id !== player.id) {
        throw new Error("Not your turn");
      }

      resolvePendingAction(room, player);
      advanceTurn(room);
      break;
    }
  }

  room.updatedAt = Date.now();
  return room;
}

export function getPublicRoomState(room: GameRoom) {
  return {
    id: room.id,
    code: room.code,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      token: p.token,
      color: p.color,
      money: p.money,
      position: p.position,
      properties: p.properties,
      inJail: p.inJail,
      isBankrupt: p.isBankrupt,
      isHost: p.isHost,
    })),
    currentPlayerIndex: room.currentPlayerIndex,
    phase: room.phase,
    lastRoll: room.lastRoll,
    pendingAction: room.pendingAction,
    message: room.message,
    winnerId: room.winnerId,
    playerCount: room.players.length,
    maxPlayers: MAX_PLAYERS,
    boardSize: BOARD_SIZE,
    updatedAt: room.updatedAt,
  };
}
