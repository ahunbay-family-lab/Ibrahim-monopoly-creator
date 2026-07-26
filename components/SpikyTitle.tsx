const SPIKE_OFFSETS = [
  [-3, -2],
  [-2, -3],
  [-1, -4],
  [0, -3],
  [1, -4],
  [2, -3],
  [3, -2],
  [4, -1],
  [3, 0],
  [4, 1],
  [3, 2],
  [2, 3],
  [1, 4],
  [0, 3],
  [-1, 4],
  [-2, 3],
  [-3, 2],
  [-4, 1],
  [-4, 0],
  [-4, -1],
  [2, -1],
  [-2, 1],
  [1, 2],
  [-1, -2],
  [3, -3],
  [-3, 3],
];

const SCRATCH_LINES = [
  { x1: 60, y1: 20, x2: 95, y2: 8 },
  { x1: 700, y1: 18, x2: 735, y2: 32 },
  { x1: 120, y1: 100, x2: 150, y2: 112 },
  { x1: 640, y1: 95, x2: 675, y2: 108 },
  { x1: 380, y1: 8, x2: 400, y2: 22 },
  { x1: 420, y1: 105, x2: 445, y2: 115 },
];

export function SpikyTitle() {
  return (
    <div className="w-full max-w-5xl px-2">
      <svg
        viewBox="0 0 800 120"
        className="h-auto w-full"
        role="img"
        aria-label="Dragons 3D"
      >
        <g
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="58"
          fontWeight="700"
          letterSpacing="6"
          textAnchor="middle"
        >
          {SPIKE_OFFSETS.map(([x, y], index) => (
            <text
              key={index}
              x="400"
              y="78"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="0.55"
              transform={`translate(${x} ${y})`}
            >
              DRAGONS 3D
            </text>
          ))}

          <text x="400" y="78" fill="#0a0a0a">
            DRAGONS 3D
          </text>
        </g>

        {SCRATCH_LINES.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#0a0a0a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
