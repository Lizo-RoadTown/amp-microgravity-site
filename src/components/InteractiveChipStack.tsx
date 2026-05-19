import { useEffect, useRef, useState } from "react";

const AMP_COLUMN_XS = [180, 260, 340, 420, 500];
const STREP_XS = [160, 240, 320, 400, 480];

interface Step {
  id: string;
  label: string;
  detail: string;
  layers: Set<string>;
}

const ORDER = [
  "substrate",
  "streptavidin",
  "biotin",
  "amp",
  "peg",
  "cell",
] as const;
type LayerId = (typeof ORDER)[number];

const STEPS: Step[] = [
  {
    id: "substrate",
    label: "1. Glass sensor substrate",
    detail: "Start with a plain glass chip — 8 mm × 8 mm. Nothing else.",
    layers: new Set(["substrate"]),
  },
  {
    id: "streptavidin",
    label: "2. Streptavidin layer",
    detail:
      "Coat it with streptavidin tetramers. Each one offers four binding sites for biotin.",
    layers: new Set(["substrate", "streptavidin"]),
  },
  {
    id: "biotin",
    label: "3. Biotin–streptavidin coupling",
    detail:
      "Snap a biotin head into each streptavidin. The biotin–streptavidin bond is famously strong.",
    layers: new Set(["substrate", "streptavidin", "biotin"]),
  },
  {
    id: "amp",
    label: "4. Antimicrobial peptide",
    detail:
      "Each biotin head carries an AMP up top — LL-37 or Magainin I. This is the capture layer.",
    layers: new Set(["substrate", "streptavidin", "biotin", "amp"]),
  },
  {
    id: "peg",
    label: "5. PEG backfill",
    detail:
      "Fill the empty space between AMPs with polyethylene glycol — blocks anything that isn't AMP-binding from sticking.",
    layers: new Set(["substrate", "streptavidin", "biotin", "amp", "peg"]),
  },
  {
    id: "cell",
    label: "6. E. coli approaches",
    detail: "A ΔfimA E. coli drifts in. The AMPs grab it; the PEG keeps it specific.",
    layers: new Set(["substrate", "streptavidin", "biotin", "amp", "peg", "cell"]),
  },
];

function visible(stepIdx: number, layer: LayerId) {
  return STEPS[stepIdx]?.layers.has(layer) ?? false;
}

export function InteractiveChipStack() {
  const [stepIdx, setStepIdx] = useState(0);
  const [auto, setAuto] = useState(false);
  const autoTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
    };
  }, []);

  useEffect(() => {
    if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
    if (!auto) return;
    if (stepIdx >= STEPS.length - 1) {
      setAuto(false);
      return;
    }
    autoTimer.current = window.setTimeout(() => {
      setStepIdx((s) => s + 1);
    }, 1600);
  }, [auto, stepIdx]);

  const step = STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;

  const next = () => {
    if (!isLast) setStepIdx(stepIdx + 1);
  };
  const back = () => {
    if (!isFirst) setStepIdx(stepIdx - 1);
  };
  const reset = () => {
    setAuto(false);
    setStepIdx(0);
  };
  const toggleAuto = () => {
    if (auto) {
      setAuto(false);
    } else {
      if (isLast) setStepIdx(0);
      setAuto(true);
    }
  };

  return (
    <div className="chip-build">
      <div className="chip-build__viewport">
      <div className="chip-build__overlay">
        <span className="chip-build__overlay-step">
          Step {stepIdx + 1} / {STEPS.length}
        </span>
        <span className="chip-build__overlay-label">{step.label}</span>
        <span className="chip-build__overlay-detail">{step.detail}</span>
      </div>
      <svg
        viewBox="-60 -70 840 590"
        className="chip-build__svg"
        role="img"
        aria-label={`Step ${stepIdx + 1} of ${STEPS.length}: ${step.label}`}
      >
        <defs>
          <linearGradient id="cb-cell-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dde6ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#9ab3e8" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="cb-substrate-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#222637" />
            <stop offset="100%" stopColor="#11141d" />
          </linearGradient>
        </defs>

        {/* Substrate — always visible */}
        <g className={`chip-layer ${visible(stepIdx, "substrate") ? "chip-layer--on" : "chip-layer--off"}`}>
          <rect x="80" y="395" width="480" height="50" fill="url(#cb-substrate-grad)" stroke="#3a4a6e" strokeWidth="1" />
          <g opacity="0.4">
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1={80 + i * 20}
                y1={395}
                x2={80 + i * 20}
                y2={445}
                stroke="#3a4a6e"
                strokeWidth="0.4"
              />
            ))}
          </g>
          <g className="chip-stack-label">
            <line x1="540" y1="420" x2="560" y2="420" stroke="#3a4a6e" strokeWidth="1" />
            <text x="568" y="416" fill="#c5c8d4" fontSize="14">Glass chip</text>
            <text x="568" y="432" fill="#6e7388" fontSize="11">8 mm × 8 mm</text>
          </g>
        </g>

        {/* Streptavidin layer */}
        <g className={`chip-layer ${visible(stepIdx, "streptavidin") ? "chip-layer--on" : "chip-layer--off"}`}>
          {STREP_XS.map((x) => (
            <g key={`strep-${x}`}>
              <rect x={x} y={320} width={40} height={32} rx={5} fill="#5a7fbf" stroke="#7a98d8" strokeWidth="0.8" />
              <line x1={x + 20} y1={320} x2={x + 20} y2={352} stroke="#3a4a6e" strokeWidth="0.6" />
              <line x1={x} y1={336} x2={x + 40} y2={336} stroke="#3a4a6e" strokeWidth="0.6" />
            </g>
          ))}
          <g className="chip-stack-label">
            <line x1="540" y1="336" x2="520" y2="336" stroke="#3a4a6e" strokeWidth="1" />
            <text x="548" y="332" fill="#c5c8d4" fontSize="14">Streptavidin tetramer</text>
            <text x="548" y="348" fill="#6e7388" fontSize="11">binds biotin with high affinity</text>
          </g>
        </g>

        {/* Biotin head + linker */}
        <g className={`chip-layer ${visible(stepIdx, "biotin") ? "chip-layer--on" : "chip-layer--off"}`}>
          {AMP_COLUMN_XS.map((x) => (
            <g key={`biotin-${x}`}>
              <line x1={x} y1={290} x2={x} y2={320} stroke="#a3e4c4" strokeWidth="2" />
              <circle cx={x} cy={295} r={6} fill="#a3e4c4" stroke="#5fbf8c" strokeWidth="0.8" />
            </g>
          ))}
          <g className="chip-stack-label">
            <line x1="220" y1="305" x2="120" y2="305" stroke="#3a4a6e" strokeWidth="1" />
            <text x="112" y="301" fill="#c5c8d4" fontSize="14" textAnchor="end">Biotin–streptavidin coupling</text>
            <text x="112" y="317" fill="#6e7388" fontSize="11" textAnchor="end">covalent linker</text>
          </g>
        </g>

        {/* AMP layer */}
        <g className={`chip-layer ${visible(stepIdx, "amp") ? "chip-layer--on" : "chip-layer--off"}`}>
          {AMP_COLUMN_XS.map((x) => (
            <g key={`amp-${x}`}>
              <rect x={x - 5} y={180} width={10} height={110} rx={5} fill="#c5d4ff" stroke="#7a98d8" strokeWidth="0.8" />
              <rect x={x - 4} y={184} width={2} height={102} rx={1} fill="#ffffff" opacity="0.25" />
            </g>
          ))}
          <g className="chip-stack-label">
            <line x1="220" y1="200" x2="120" y2="200" stroke="#3a4a6e" strokeWidth="1" />
            <text x="112" y="196" fill="#c5c8d4" fontSize="14" textAnchor="end">Antimicrobial peptide</text>
            <text x="112" y="212" fill="#6e7388" fontSize="11" textAnchor="end">LL-37 or Magainin I</text>
          </g>
        </g>

        {/* PEG backfill */}
        <g className={`chip-layer ${visible(stepIdx, "peg") ? "chip-layer--on" : "chip-layer--off"}`}>
          {[220, 300, 380, 460].map((x) => (
            <path
              key={`peg-${x}`}
              d={`M ${x} 285 C ${x + 8} 270, ${x - 8} 255, ${x} 240 C ${x + 8} 225, ${x - 8} 210, ${x} 195`}
              stroke="#7a8aa8"
              strokeWidth="1.4"
              fill="none"
              opacity="0.85"
            />
          ))}
          <g className="chip-stack-label">
            <line x1="540" y1="245" x2="460" y2="245" stroke="#3a4a6e" strokeWidth="1" />
            <text x="548" y="241" fill="#c5c8d4" fontSize="14">PEG backfill</text>
            <text x="548" y="257" fill="#6e7388" fontSize="11">blocks non-specific binding</text>
          </g>
        </g>

        {/* E. coli cell */}
        <g className={`chip-layer chip-layer--cell ${visible(stepIdx, "cell") ? "chip-layer--on" : "chip-layer--off"}`}>
          <ellipse cx="340" cy="60" rx="56" ry="26" fill="url(#cb-cell-grad)" stroke="#5a7fbf" strokeWidth="1.5" />
          <line x1="340" y1="90" x2="340" y2="155" stroke="#5a7fbf" strokeDasharray="4 4" strokeWidth="1.2" />
          <polygon points="334,150 340,164 346,150" fill="#5a7fbf" />
          <g className="chip-stack-label">
            <line x1="400" y1="60" x2="540" y2="60" stroke="#3a4a6e" strokeWidth="1" />
            <text x="548" y="56" fill="#c5c8d4" fontSize="14">E. coli</text>
            <text x="548" y="72" fill="#6e7388" fontSize="11">ΔfimA strain — no fimbriae</text>
          </g>
        </g>
      </svg>

      </div>

      <div className="chip-build__controls">
        <div className="chip-build__nav">
          <button
            type="button"
            className="chip-build__btn"
            onClick={back}
            disabled={isFirst}
          >
            ← Back
          </button>
          <button
            type="button"
            className="chip-build__btn chip-build__btn--primary"
            onClick={next}
            disabled={isLast}
          >
            Next →
          </button>
          <button
            type="button"
            className="chip-build__btn"
            onClick={toggleAuto}
          >
            {auto ? "Pause" : isLast ? "Replay" : "Auto-play"}
          </button>
          {!isFirst && (
            <button
              type="button"
              className="chip-build__btn chip-build__btn--ghost"
              onClick={reset}
            >
              Reset
            </button>
          )}
        </div>
        <div className="chip-build__progress" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`chip-build__dot ${i <= stepIdx ? "chip-build__dot--on" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
