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
    <div className="grid h-14 w-14 grid-cols-3 grid-rows-3 gap-1 rounded bg-white p-2 shadow border border-kaplan-gray-light">
      {dots[value].map(([row, col], i) => (
        <div
          key={i}
          className="rounded-full bg-kaplan-royal"
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
              <p className="text-2xl font-bold text-kaplan-royal">
                = {lastRoll.total}
              </p>
              {lastRoll.isDoubles && (
                <p className="text-sm font-semibold text-kaplan-purple">
                  Doubles!
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center border border-kaplan-gray-light bg-kaplan-sky text-2xl">
              ?
            </div>
            <div className="flex h-14 w-14 items-center justify-center border border-kaplan-gray-light bg-kaplan-sky text-2xl">
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
          className="btn-kaplan-primary disabled:opacity-60"
          aria-label="Roll dice"
        >
          {loading ? "Rolling..." : "Roll Dice"}
        </button>
      )}
    </div>
  );
}
