import type { LastRoll } from "@/lib/monopoly/types";

type DiceRollerProps = {
  lastRoll: LastRoll;
  canRoll: boolean;
  loading: boolean;
  onRoll: () => void;
};

function Die({ value }: { value: number }) {
  const dots: Record<number, number[][]> = {
    1: [[1, 1]],
    2: [
      [0, 0],
      [2, 2],
    ],
    3: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    4: [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ],
    5: [
      [0, 0],
      [0, 2],
      [1, 1],
      [2, 0],
      [2, 2],
    ],
    6: [
      [0, 0],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
    ],
  };

  return (
    <div className="grid h-14 w-14 grid-cols-3 grid-rows-3 gap-1 rounded-xl bg-white p-2 shadow-md">
      {dots[value].map(([row, col], i) => (
        <div
          key={i}
          className="rounded-full bg-emerald-800"
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
        />
      ))}
    </div>
  );
}

export function DiceRoller({
  lastRoll,
  canRoll,
  loading,
  onRoll,
}: DiceRollerProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        {lastRoll ? (
          <>
            <Die value={lastRoll.die1} />
            <Die value={lastRoll.die2} />
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-900">
                = {lastRoll.total}
              </p>
              {lastRoll.isDoubles && (
                <p className="text-sm font-semibold text-orange-600">
                  Doubles!
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/50 text-2xl shadow">
              ?
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/50 text-2xl shadow">
              ?
            </div>
          </div>
        )}
      </div>

      {canRoll && (
        <button
          type="button"
          onClick={onRoll}
          disabled={loading}
          className="min-h-11 rounded-xl bg-yellow-400 px-8 py-3 text-lg font-bold text-emerald-950 shadow-lg transition hover:bg-yellow-300 disabled:opacity-60"
          aria-label="Roll dice"
        >
          {loading ? "Rolling..." : "🎲 Roll Dice"}
        </button>
      )}
    </div>
  );
}
