export type PropertyColor =
  | "brown"
  | "light-blue"
  | "pink"
  | "orange"
  | "red"
  | "yellow"
  | "green"
  | "dark-blue";

export type SpaceType =
  | "go"
  | "property"
  | "railroad"
  | "utility"
  | "chance"
  | "community-chest"
  | "tax"
  | "jail"
  | "free-parking"
  | "go-to-jail";

export type BoardSpace = {
  id: number;
  name: string;
  type: SpaceType;
  price?: number;
  rent?: number;
  color?: PropertyColor;
};

export type Player = {
  id: string;
  name: string;
  token: string;
  color: string;
  money: number;
  position: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
  isBankrupt: boolean;
  isHost: boolean;
};

export type GamePhase =
  | "waiting"
  | "rolling"
  | "moving"
  | "action"
  | "ended";

export type PendingAction =
  | { type: "buy"; spaceId: number; price: number }
  | { type: "pay-rent"; spaceId: number; amount: number; toPlayerId: string }
  | { type: "pay-tax"; amount: number }
  | { type: "go-to-jail" }
  | null;

export type LastRoll = {
  die1: number;
  die2: number;
  total: number;
  isDoubles: boolean;
} | null;

export type GameRoom = {
  id: string;
  code: string;
  players: Player[];
  currentPlayerIndex: number;
  phase: GamePhase;
  lastRoll: LastRoll;
  pendingAction: PendingAction;
  message: string;
  winnerId: string | null;
  createdAt: number;
  updatedAt: number;
};

export type GameAction =
  | { type: "start-game"; playerId: string }
  | { type: "roll-dice"; playerId: string }
  | { type: "buy-property"; playerId: string }
  | { type: "skip-buy"; playerId: string }
  | { type: "end-turn"; playerId: string };

export const STARTING_MONEY = 1500;
export const GO_BONUS = 200;
export const MAX_PLAYERS = 4;
export const MIN_PLAYERS = 2;
