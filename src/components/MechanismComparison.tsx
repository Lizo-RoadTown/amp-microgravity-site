import type { JSX } from "react";

type Column = {
  name: string;
  tagline: string;
  earthLabel: string;
  orbitLabel: string;
  vanishes: boolean;
  earthIcon: (cx: number, cy: number) => JSX.Element;
  orbitIcon: (cx: number, cy: number) => JSX.Element;
};

const ACCENT_LIVE = "#a3e4c4";
const ACCENT_GONE = "#c47a8a";
const PARTICLE = "#c5d4ff";
const VESSEL = "#5a7fbf";

function Jar({ cx, cy, particles }: { cx: number; cy: number; particles: Array<[number, number]> }) {
  const w = 36;
  const h = 50;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x} ${y + h - 8} Q ${x} ${y + h} ${x + 8} ${y + h} L ${x + w - 8} ${y + h} Q ${x + w} ${y + h} ${x + w} ${y + h - 8} L ${x + w} ${y}`}
        fill="none"
        stroke={VESSEL}
        strokeWidth={1.5}
      />
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={VESSEL} strokeWidth={1.5} strokeDasharray="2 2" />
      {particles.map(([dx, dy], i) => (
        <circle key={i} cx={cx + dx} cy={cy + dy} r={1.8} fill={PARTICLE} />
      ))}
    </g>
  );
}

function Beaker({ cx, cy, arrows, particles }: { cx: number; cy: number; arrows: boolean; particles: Array<[number, number]> }) {
  const w = 40;
  const h = 46;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x} ${y + h - 6} Q ${x} ${y + h} ${x + 6} ${y + h} L ${x + w - 6} ${y + h} Q ${x + w} ${y + h} ${x + w} ${y + h - 6} L ${x + w} ${y}`}
        fill="none"
        stroke={VESSEL}
        strokeWidth={1.5}
      />
      {arrows && (
        <g stroke={ACCENT_LIVE} strokeWidth={1.4} fill="none">
          <path d={`M ${cx - 10} ${cy + 12} Q ${cx - 13} ${cy} ${cx - 10} ${cy - 12}`} />
          <polygon points={`${cx - 12},${cy - 8} ${cx - 10},${cy - 14} ${cx - 8},${cy - 8}`} fill={ACCENT_LIVE} stroke="none" />
          <path d={`M ${cx + 10} ${cy - 12} Q ${cx + 13} ${cy} ${cx + 10} ${cy + 12}`} />
          <polygon points={`${cx + 8},${cy + 8} ${cx + 10},${cy + 14} ${cx + 12},${cy + 8}`} fill={ACCENT_LIVE} stroke="none" />
        </g>
      )}
      {particles.map(([dx, dy], i) => (
        <circle key={i} cx={cx + dx} cy={cy + dy} r={1.6} fill={PARTICLE} />
      ))}
    </g>
  );
}

function DiffusionParticle({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <polyline
        points={`${cx - 22},${cy + 10} ${cx - 14},${cy - 6} ${cx - 4},${cy + 4} ${cx + 6},${cy - 8} ${cx + 14},${cy + 2} ${cx + 20},${cy - 6}`}
        fill="none"
        stroke={ACCENT_LIVE}
        strokeWidth={1.2}
        strokeDasharray="2 2"
        opacity={0.85}
      />
      <circle cx={cx + 20} cy={cy - 6} r={4} fill={PARTICLE} stroke={VESSEL} strokeWidth={0.8} />
    </g>
  );
}

function SwimmingBacterium({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path
        d={`M ${cx - 28} ${cy + 6} q 4 -6 8 0 q 4 6 8 0 q 4 -6 8 0`}
        fill="none"
        stroke={ACCENT_LIVE}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <ellipse cx={cx + 6} cy={cy} rx={10} ry={5} fill={PARTICLE} stroke={VESSEL} strokeWidth={0.8} />
      <line x1={cx + 18} y1={cy} x2={cx + 28} y2={cy} stroke={ACCENT_LIVE} strokeWidth={1.5} />
      <polygon points={`${cx + 26},${cy - 3} ${cx + 30},${cy} ${cx + 26},${cy + 3}`} fill={ACCENT_LIVE} />
    </g>
  );
}

const COLUMNS: Column[] = [
  {
    name: "Sedimentation",
    tagline: "falling, like sand in water",
    earthLabel: "Grains pile up at the bottom",
    orbitLabel: "Nothing falls — grains stay suspended",
    vanishes: true,
    earthIcon: (cx, cy) => (
      <Jar
        cx={cx}
        cy={cy}
        particles={[
          [-10, 18], [-4, 20], [3, 19], [10, 20], [-6, 14], [6, 14], [0, 17],
        ]}
      />
    ),
    orbitIcon: (cx, cy) => (
      <Jar
        cx={cx}
        cy={cy}
        particles={[
          [-10, -12], [8, -6], [-4, 0], [10, 8], [-12, 12], [4, 16], [-2, -16],
        ]}
      />
    ),
  },
  {
    name: "Buoyant convection",
    tagline: "warm fluid rises, cool fluid sinks",
    earthLabel: "Bulk flow circulates in loops",
    orbitLabel: "No rising, no sinking — fluid sits still",
    vanishes: true,
    earthIcon: (cx, cy) => (
      <Beaker
        cx={cx}
        cy={cy}
        arrows={true}
        particles={[]}
      />
    ),
    orbitIcon: (cx, cy) => (
      <Beaker
        cx={cx}
        cy={cy}
        arrows={false}
        particles={[
          [-10, -10], [8, -8], [-6, 4], [10, 6], [-2, 12], [4, -2],
        ]}
      />
    ),
  },
  {
    name: "Brownian diffusion",
    tagline: "random thermal jiggling",
    earthLabel: "Particles random-walk from molecular impacts",
    orbitLabel: "Same — molecules don't care about gravity",
    vanishes: false,
    earthIcon: (cx, cy) => <DiffusionParticle cx={cx} cy={cy} />,
    orbitIcon: (cx, cy) => <DiffusionParticle cx={cx} cy={cy} />,
  },
  {
    name: "Flagellar swimming",
    tagline: "bacteria propel themselves with tails",
    earthLabel: "E. coli swims ~20 µm/s with its flagella",
    orbitLabel: "Same — swimming works without gravity",
    vanishes: false,
    earthIcon: (cx, cy) => <SwimmingBacterium cx={cx} cy={cy} />,
    orbitIcon: (cx, cy) => <SwimmingBacterium cx={cx} cy={cy} />,
  },
];

const COL_WIDTH = 195;
const COL_HEIGHT = 340;

const NAME_Y = 24;
const TAG_Y = 42;
const EARTH_ROW_Y = 90;
const EARTH_LABEL_Y = 152;
const DIVIDER_Y = 178;
const ORBIT_ROW_Y = 220;
const ORBIT_LABEL_Y = 282;
const STATUS_Y = 314;

function ColumnGroup({ col, x0, showSeparator }: { col: Column; x0: number; showSeparator: boolean }) {
  const cx = x0 + COL_WIDTH / 2;
  return (
    <g>
      {showSeparator && (
        <line x1={x0} y1={12} x2={x0} y2={COL_HEIGHT - 12} stroke="#1f2230" strokeWidth={1} />
      )}

      <text x={cx} y={NAME_Y} fill="#c5d4ff" fontSize={14} textAnchor="middle" fontWeight="600">
        {col.name}
      </text>
      <text x={cx} y={TAG_Y} fill="#8a8fa3" fontSize={11} textAnchor="middle" fontStyle="italic">
        {col.tagline}
      </text>

      <text x={x0 + 10} y={EARTH_ROW_Y - 32} fill="#6e7388" fontSize={10} fontWeight="600" letterSpacing="0.05em">
        ON EARTH
      </text>
      {col.earthIcon(cx, EARTH_ROW_Y)}
      <text x={cx} y={EARTH_LABEL_Y} fill="#c5c8d4" fontSize={11} textAnchor="middle">
        <Wrap text={col.earthLabel} cx={cx} y={EARTH_LABEL_Y} />
      </text>

      <line
        x1={x0 + 14}
        y1={DIVIDER_Y}
        x2={x0 + COL_WIDTH - 14}
        y2={DIVIDER_Y}
        stroke="#1f2230"
        strokeWidth={1}
        strokeDasharray="3 3"
      />

      <text x={x0 + 10} y={ORBIT_ROW_Y - 32} fill="#6e7388" fontSize={10} fontWeight="600" letterSpacing="0.05em">
        IN ORBIT
      </text>
      <g opacity={col.vanishes ? 0.32 : 1}>
        {col.orbitIcon(cx, ORBIT_ROW_Y)}
      </g>
      {col.vanishes && (
        <line
          x1={cx - 30}
          y1={ORBIT_ROW_Y - 22}
          x2={cx + 30}
          y2={ORBIT_ROW_Y + 22}
          stroke={ACCENT_GONE}
          strokeWidth={1.5}
        />
      )}
      <text x={cx} y={ORBIT_LABEL_Y} fill="#c5c8d4" fontSize={11} textAnchor="middle">
        <Wrap text={col.orbitLabel} cx={cx} y={ORBIT_LABEL_Y} />
      </text>

      <g transform={`translate(${cx} ${STATUS_Y})`}>
        <rect
          x={-46}
          y={-10}
          width={92}
          height={18}
          rx={9}
          fill={col.vanishes ? "rgba(196,122,138,0.15)" : "rgba(163,228,196,0.15)"}
          stroke={col.vanishes ? ACCENT_GONE : ACCENT_LIVE}
          strokeWidth={1}
        />
        <text
          x={0}
          y={3}
          fill={col.vanishes ? ACCENT_GONE : ACCENT_LIVE}
          fontSize={10.5}
          textAnchor="middle"
          fontWeight="600"
          letterSpacing="0.04em"
        >
          {col.vanishes ? "VANISHES IN µG" : "STILL WORKS IN µG"}
        </text>
      </g>
    </g>
  );
}

export function MechanismComparison() {
  const viewW = COL_WIDTH * COLUMNS.length;
  return (
    <svg
      viewBox={`0 0 ${viewW} ${COL_HEIGHT}`}
      className="mechanism-comparison"
      role="img"
      aria-labelledby="mechCompTitle mechCompDesc"
    >
      <title id="mechCompTitle">Four mechanisms compared — Earth vs orbit</title>
      <desc id="mechCompDesc">
        Side-by-side comparison of the four ways bacteria reach a surface. Sedimentation
        and buoyant convection vanish in microgravity; Brownian diffusion and flagellar
        swimming are unchanged.
      </desc>
      {COLUMNS.map((col, i) => (
        <ColumnGroup key={col.name} col={col} x0={i * COL_WIDTH} showSeparator={i > 0} />
      ))}
    </svg>
  );
}

interface MechanismCardProps {
  name: "Sedimentation" | "Buoyant convection" | "Brownian diffusion" | "Flagellar swimming";
}

export function MechanismCard({ name }: MechanismCardProps) {
  const col = COLUMNS.find((c) => c.name === name);
  if (!col) return null;
  return (
    <svg
      viewBox={`0 0 ${COL_WIDTH} ${COL_HEIGHT}`}
      className="mechanism-card"
      role="img"
      aria-label={`${col.name} — ${col.vanishes ? "vanishes" : "still works"} in microgravity`}
    >
      <rect
        x={2}
        y={2}
        width={COL_WIDTH - 4}
        height={COL_HEIGHT - 4}
        rx={6}
        fill="none"
        stroke="#1f2230"
        strokeWidth={1}
      />
      <ColumnGroup col={col} x0={0} showSeparator={false} />
    </svg>
  );
}

function Wrap({ text, cx, y }: { text: string; cx: number; y: number }) {
  const maxChars = 30;
  if (text.length <= maxChars) {
    return <tspan x={cx} y={y}>{text}</tspan>;
  }
  const mid = Math.floor(text.length / 2);
  const left = text.lastIndexOf(" ", mid);
  const right = text.indexOf(" ", mid);
  const cut = mid - left < right - mid ? left : right;
  if (cut < 0) return <tspan x={cx} y={y}>{text}</tspan>;
  return (
    <>
      <tspan x={cx} y={y - 7}>{text.slice(0, cut)}</tspan>
      <tspan x={cx} y={y + 7}>{text.slice(cut + 1)}</tspan>
    </>
  );
}
