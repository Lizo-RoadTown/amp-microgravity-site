import { useState } from "react";

type PatchId = "staph" | "bacillus" | "ecoli";

interface PatchInfo {
  id: PatchId;
  name: string;
  where: string;
  detail: string;
  color: string;
  cx: number;
  cy: number;
}

const PATCHES: PatchInfo[] = [
  {
    id: "bacillus",
    name: "Bacillus",
    where: "Air filters & ventilation",
    detail:
      "Tough spore-forming bacteria. They go dormant under stress, so disinfection and drying don't always kill them. Common in HEPA filters.",
    color: "#e8a3c4",
    cx: 232,
    cy: 86,
  },
  {
    id: "staph",
    name: "Staphylococcus",
    where: "Cabin walls & touch surfaces",
    detail:
      "Common skin bacteria. Crew shed them constantly — they end up on handrails, equipment, anything someone touches.",
    color: "#c47a8a",
    cx: 440,
    cy: 138,
  },
  {
    id: "ecoli",
    name: "Enterobacteriaceae",
    where: "Water systems & food prep",
    detail:
      "Gut-flora relatives of E. coli. Damp surfaces keep them alive longer than dry ones, which is why water lines and galley fixtures are flagged in surveys.",
    color: "#a3e4c4",
    cx: 492,
    cy: 222,
  },
];

export function BiofilmModule() {
  const [selectedId, setSelectedId] = useState<PatchId | null>(null);

  const selected = selectedId
    ? PATCHES.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <div className="biofilm-module">
      <div className="biofilm-module__stage">
      <svg
        viewBox="0 0 600 300"
        className="biofilm-module__svg"
        role="img"
        aria-label="Interactive cross-section of an ISS-style module showing where biofilms have been documented."
      >
        <defs>
          <linearGradient id="bm-module-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1119" />
            <stop offset="100%" stopColor="#080a10" />
          </linearGradient>
          <radialGradient id="bm-porthole" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#1e3050" />
            <stop offset="60%" stopColor="#0a1424" />
            <stop offset="100%" stopColor="#02050a" />
          </radialGradient>
        </defs>

        {/* Module shell */}
        <rect
          x="14"
          y="32"
          width="572"
          height="240"
          rx="34"
          fill="url(#bm-module-fill)"
          stroke="#2c3447"
          strokeWidth="1.5"
        />
        {/* Inner highlight */}
        <rect
          x="20"
          y="38"
          width="560"
          height="228"
          rx="30"
          fill="none"
          stroke="#1a1f2e"
          strokeWidth="1"
        />

        {/* Porthole window */}
        <g>
          <circle cx="70" cy="152" r="34" fill="url(#bm-porthole)" stroke="#2c3447" />
          <circle cx="70" cy="152" r="34" fill="none" stroke="#1a1f2e" strokeWidth="1" />
          {/* Stars in the porthole */}
          <circle cx="60" cy="138" r="0.7" fill="#c5d4ff" />
          <circle cx="82" cy="142" r="0.6" fill="#a3e4c4" />
          <circle cx="55" cy="160" r="0.5" fill="#c5d4ff" />
          <circle cx="78" cy="170" r="0.6" fill="#c5d4ff" />
          <circle cx="68" cy="155" r="1.1" fill="#dde6ff" opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Equipment racks (left of porthole) */}
        <g opacity="0.85">
          <rect x="125" y="56" width="60" height="44" fill="#15191f" stroke="#2c3447" />
          <line x1="125" y1="80" x2="185" y2="80" stroke="#2c3447" />
          <circle cx="155" cy="70" r="3" fill="#5a7fbf" opacity="0.65">
            <animate
              attributeName="opacity"
              values="0.3;0.85;0.3"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Air filter grid (top, where bacillus is) */}
        <g>
          <rect x="200" y="56" width="120" height="36" fill="#101319" stroke="#2c3447" />
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`af-${i}`}
              x1={206 + i * 11}
              y1={60}
              x2={206 + i * 11}
              y2={88}
              stroke="#2c3447"
              strokeWidth="1"
            />
          ))}
          <text
            x={260}
            y={49}
            fill="#6e7388"
            fontSize="9"
            textAnchor="middle"
            letterSpacing="0.1em"
            fontWeight="600"
          >
            AIR FILTER
          </text>
        </g>

        {/* Cabin wall panel (middle, where staph is) */}
        <g>
          <rect x="380" y="100" width="120" height="76" fill="#101319" stroke="#2c3447" />
          <rect x="386" y="106" width="50" height="22" fill="#15191f" stroke="#1a1f2e" />
          <rect x="444" y="106" width="50" height="22" fill="#15191f" stroke="#1a1f2e" />
          <circle cx="411" cy="148" r="4" fill="#15191f" stroke="#2c3447" />
          <circle cx="425" cy="148" r="4" fill="#15191f" stroke="#2c3447" />
          <circle cx="439" cy="148" r="4" fill="#15191f" stroke="#2c3447" />
          <circle cx="453" cy="148" r="4" fill="#15191f" stroke="#2c3447" />
          <circle cx="467" cy="148" r="4" fill="#15191f" stroke="#2c3447" />
          <text
            x={440}
            y={93}
            fill="#6e7388"
            fontSize="9"
            textAnchor="middle"
            letterSpacing="0.1em"
            fontWeight="600"
          >
            CABIN WALL · CONTROLS
          </text>
        </g>

        {/* Water station (bottom right, where E. coli relatives are) */}
        <g>
          <rect x="440" y="195" width="110" height="54" fill="#101319" stroke="#2c3447" />
          <rect x="450" y="205" width="40" height="32" fill="#0a0d14" stroke="#2c3447" />
          <circle cx="520" cy="220" r="8" fill="#0a0d14" stroke="#2c3447" />
          <line x1="520" y1="228" x2="520" y2="244" stroke="#2c3447" strokeWidth="1.5" />
          {/* Water drops */}
          <circle cx="520" cy="250" r="1.5" fill="#5a7fbf" opacity="0.6">
            <animate
              attributeName="opacity"
              values="0;0.7;0"
              dur="3.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="250;258;250"
              dur="3.8s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={495}
            y={188}
            fill="#6e7388"
            fontSize="9"
            textAnchor="middle"
            letterSpacing="0.1em"
            fontWeight="600"
          >
            WATER LINE
          </text>
        </g>

        {/* Floating bits (suggesting microgravity) */}
        <g opacity="0.55">
          <circle cx="350" cy="220" r="1.6" fill="#c5d4ff">
            <animate
              attributeName="cy"
              values="220;212;224;220"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values="350;356;344;350"
              dur="7s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="280" cy="180" r="1.2" fill="#a3e4c4">
            <animate
              attributeName="cy"
              values="180;188;176;180"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="380" cy="240" r="1" fill="#c5d4ff">
            <animate
              attributeName="cx"
              values="380;372;388;380"
              dur="7.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Biofilm patches — clickable */}
        {PATCHES.map((p, i) => (
          <BiofilmPatch
            key={p.id}
            patch={p}
            order={i}
            selected={selectedId === p.id}
            onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
          />
        ))}
      </svg>

      <div
        className={
          selected
            ? "biofilm-module__info biofilm-module__info--active"
            : "biofilm-module__info"
        }
      >
        {selected ? (
          <>
            <div
              className="biofilm-module__swatch"
              style={{ background: selected.color }}
              aria-hidden="true"
            />
            <h4 className="biofilm-module__name">{selected.name}</h4>
            <p className="biofilm-module__where">{selected.where}</p>
            <p className="biofilm-module__detail">{selected.detail}</p>
          </>
        ) : (
          <p className="biofilm-module__prompt">
            Click one of the colored patches on the module to see what's been
            found there.
          </p>
        )}
      </div>
      </div>
    </div>
  );
}

interface BiofilmPatchProps {
  patch: PatchInfo;
  order: number;
  selected: boolean;
  onClick: () => void;
}

function BiofilmPatch({ patch, order, selected, onClick }: BiofilmPatchProps) {
  const baseR = 8;
  const r = selected ? baseR + 4 : baseR;
  return (
    <g
      className={selected ? "bm-patch bm-patch--selected" : "bm-patch"}
      onClick={onClick}
      style={{
        cursor: "pointer",
        transformOrigin: `${patch.cx}px ${patch.cy}px`,
        animationDelay: `${order * 0.4 + 0.6}s`,
      }}
      tabIndex={0}
      role="button"
      aria-label={`${patch.name} — ${patch.where}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Outer glow */}
      <circle
        cx={patch.cx}
        cy={patch.cy}
        r={r + 6}
        fill={patch.color}
        opacity={selected ? 0.22 : 0.12}
      />
      {/* Pulse ring (just for selected) */}
      {selected && (
        <circle
          cx={patch.cx}
          cy={patch.cy}
          r={r + 4}
          fill="none"
          stroke={patch.color}
          strokeWidth="1.5"
          opacity="0.6"
        >
          <animate
            attributeName="r"
            values={`${r + 4};${r + 12};${r + 4}`}
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* Splotch shape */}
      <circle cx={patch.cx} cy={patch.cy} r={r} fill={patch.color} opacity={0.85} />
      <circle
        cx={patch.cx - 3}
        cy={patch.cy - 2}
        r={r * 0.45}
        fill={patch.color}
        opacity={0.6}
      />
      <circle
        cx={patch.cx + 4}
        cy={patch.cy + 3}
        r={r * 0.35}
        fill={patch.color}
        opacity={0.7}
      />
    </g>
  );
}
