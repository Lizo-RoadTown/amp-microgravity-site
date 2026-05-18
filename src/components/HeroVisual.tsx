type Floater = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotate: number;
  color: string;
  pattern: 1 | 2 | 3 | 4;
  durSec: number;
  delaySec: number;
};

const FLOATERS: Floater[] = [
  { x: 100, y: 90,  rx: 11, ry: 5.5, rotate: 20,  color: "#c5d4ff", pattern: 1, durSec: 14, delaySec: 0 },
  { x: 200, y: 130, rx: 10, ry: 5,   rotate: -25, color: "#a3e4c4", pattern: 2, durSec: 18, delaySec: 2.4 },
  { x: 290, y: 100, rx: 12, ry: 6,   rotate: 10,  color: "#c5d4ff", pattern: 3, durSec: 15, delaySec: 0.9 },
  { x: 140, y: 200, rx: 9,  ry: 4.5, rotate: -10, color: "#a3e4c4", pattern: 4, durSec: 17, delaySec: 1.7 },
  { x: 250, y: 220, rx: 11, ry: 5.5, rotate: 30,  color: "#c5d4ff", pattern: 1, durSec: 16, delaySec: 3.1 },
  { x: 320, y: 260, rx: 10, ry: 5,   rotate: -15, color: "#a3e4c4", pattern: 2, durSec: 13, delaySec: 4 },
  { x: 80,  y: 270, rx: 9,  ry: 4.5, rotate: 25,  color: "#c5d4ff", pattern: 3, durSec: 19, delaySec: 2 },
  { x: 180, y: 60,  rx: 10, ry: 5,   rotate: -20, color: "#c5d4ff", pattern: 4, durSec: 15.5, delaySec: 5.2 },
];

const CAPTURED = [
  { x: 92,  rx: 11, ry: 4.5, rotate: 6 },
  { x: 132, rx: 10, ry: 4.5, rotate: -8 },
  { x: 168, rx: 11, ry: 4.5, rotate: 4 },
  { x: 208, rx: 10, ry: 4.5, rotate: -3 },
  { x: 248, rx: 11, ry: 4.5, rotate: 7 },
  { x: 288, rx: 10, ry: 4.5, rotate: -5 },
  { x: 322, rx: 9,  ry: 4,   rotate: 2 },
];

const CHIP_TOP_Y = 348;

export function HeroVisual() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="hero-visual"
      role="img"
      aria-label="An illustrative chamber of bacteria drifting in microgravity, with several already captured on an antimicrobial-peptide chip surface at the bottom."
    >
      <defs>
        <radialGradient id="heroVisualGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#5a7fbf" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#5a7fbf" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#5a7fbf" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heroVisualChip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a98d8" />
          <stop offset="100%" stopColor="#2c3447" />
        </linearGradient>
        <linearGradient id="heroVisualCell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Soft glow behind everything */}
      <circle cx="200" cy="170" r="200" fill="url(#heroVisualGlow)" />

      {/* Subtle starfield */}
      <g opacity="0.55">
        <circle cx="44"  cy="60"  r="0.8" fill="#c5d4ff" />
        <circle cx="370" cy="44"  r="0.7" fill="#a3e4c4" />
        <circle cx="22"  cy="220" r="0.6" fill="#c5d4ff" />
        <circle cx="380" cy="180" r="0.7" fill="#c5d4ff" />
        <circle cx="350" cy="320" r="0.6" fill="#a3e4c4" />
        <circle cx="60"  cy="380" r="0.7" fill="#c5d4ff" />
        <circle cx="200" cy="20"  r="0.7" fill="#c5d4ff" />
        <circle cx="330" cy="240" r="0.5" fill="#a3e4c4" />
      </g>

      {/* Chamber outline — dashed, soft */}
      <rect
        x="32"
        y="32"
        width="336"
        height="336"
        rx="22"
        fill="none"
        stroke="#2c3447"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />

      {/* Drifting bacteria — each one gets a unique pattern via CSS */}
      {FLOATERS.map((f, i) => (
        <g
          key={`f-${i}`}
          className={`hv-float hv-float--p${f.pattern}`}
          style={{
            animationDuration: `${f.durSec}s`,
            animationDelay: `${f.delaySec}s`,
            transformOrigin: `${f.x}px ${f.y}px`,
          }}
        >
          <ellipse
            cx={f.x}
            cy={f.y}
            rx={f.rx}
            ry={f.ry}
            fill={f.color}
            opacity="0.88"
            transform={`rotate(${f.rotate} ${f.x} ${f.y})`}
          />
          <ellipse
            cx={f.x}
            cy={f.y - 1}
            rx={f.rx - 2}
            ry={f.ry / 2}
            fill="url(#heroVisualCell)"
            transform={`rotate(${f.rotate} ${f.x} ${f.y})`}
          />
        </g>
      ))}

      {/* Chip surface */}
      <rect
        x="44"
        y={CHIP_TOP_Y}
        width="312"
        height="12"
        rx="3"
        fill="url(#heroVisualChip)"
      />
      <rect
        x="44"
        y={CHIP_TOP_Y}
        width="312"
        height="2"
        fill="#a3b6e0"
        opacity="0.7"
      />

      {/* AMP peptide hashes on top of the chip */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 52 + i * 11.6;
        return (
          <line
            key={`amp-${i}`}
            x1={x}
            y1={CHIP_TOP_Y - 4}
            x2={x}
            y2={CHIP_TOP_Y}
            stroke="#c5d4ff"
            strokeWidth="1"
            opacity="0.55"
          />
        );
      })}

      {/* Captured bacteria stuck to the chip */}
      {CAPTURED.map((c, i) => (
        <g key={`c-${i}`} className="hv-captured" style={{ animationDelay: `${i * 0.18}s` }}>
          <ellipse
            cx={c.x}
            cy={CHIP_TOP_Y - 2}
            rx={c.rx}
            ry={c.ry}
            fill="#c5d4ff"
            opacity="0.95"
            transform={`rotate(${c.rotate} ${c.x} ${CHIP_TOP_Y - 2})`}
          />
          <ellipse
            cx={c.x}
            cy={CHIP_TOP_Y - 3}
            rx={c.rx - 2}
            ry={c.ry / 2}
            fill="url(#heroVisualCell)"
            transform={`rotate(${c.rotate} ${c.x} ${CHIP_TOP_Y - 2})`}
          />
        </g>
      ))}

      {/* Label */}
      <g opacity="0.7">
        <text
          x="200"
          y="395"
          fill="#6e7388"
          fontSize="9"
          textAnchor="middle"
          letterSpacing="0.16em"
          fontWeight="600"
        >
          AMP CHIP · CAPTURED CELLS BELOW · DRIFTING ABOVE
        </text>
      </g>
    </svg>
  );
}
