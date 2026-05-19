import { useEffect, useRef, useState } from "react";

interface Step {
  id: string;
  label: string;
  detail: string;
  layers: Set<string>;
}

const STEPS: Step[] = [
  {
    id: "cell",
    label: "1. Start: a captured cell on the chip",
    detail:
      "The flight chips come back fixed. A bacterium stuck to an AMP is locked in place — the formalin made sure of that. Now we want to count it.",
    layers: new Set(["chip", "cell"]),
  },
  {
    id: "primary",
    label: "2. Add primary antibody",
    detail:
      "Flood the chip with a primary antibody that's specific to E. coli surface antigens. It binds the captured cells. Wash off anything that didn't bind.",
    layers: new Set(["chip", "cell", "primary"]),
  },
  {
    id: "secondary",
    label: "3. Add HRP-conjugated secondary antibody",
    detail:
      "Now flood with a secondary antibody that binds the primary — and this one carries a horseradish peroxidase (HRP) enzyme as a passenger. One bound bacterium ends up with several HRP enzymes parked on top of it.",
    layers: new Set(["chip", "cell", "primary", "secondary"]),
  },
  {
    id: "substrate",
    label: "4. Add TMB substrate",
    detail:
      "TMB is colorless when you add it. Wherever HRP is present, the enzyme starts turning it into a blue product. No bacterium → no HRP → no color.",
    layers: new Set(["chip", "cell", "primary", "secondary", "substrate"]),
  },
  {
    id: "color",
    label: "5. Color develops",
    detail:
      "Over a few minutes, the blue gets darker. Darker color means more enzyme — which means more cells were captured. Stop the reaction with acid at a fixed time.",
    layers: new Set(["chip", "cell", "primary", "secondary", "substrate", "color"]),
  },
  {
    id: "read",
    label: "6. Read and convert",
    detail:
      "A spectrophotometer measures the optical density at 450 nm. Plug that into the standard curve (built from chips dosed with known cell concentrations) and you get cells per square centimeter — the actual answer.",
    layers: new Set(["chip", "cell", "primary", "secondary", "substrate", "color", "readout"]),
  },
];

type LayerId =
  | "chip"
  | "cell"
  | "primary"
  | "secondary"
  | "substrate"
  | "color"
  | "readout";

function visible(stepIdx: number, layer: LayerId) {
  return STEPS[stepIdx]?.layers.has(layer) ?? false;
}

function Antibody({
  cx,
  cy,
  color,
  hrp = false,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  color: string;
  hrp?: boolean;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <line x1={0} y1={0} x2={-10} y2={-22} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1={0} y1={0} x2={10} y2={-22} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={18} stroke={color} strokeWidth={3} strokeLinecap="round" />
      {hrp && (
        <g>
          <circle cx={0} cy={22} r={7} fill="#e8c14a" stroke="#a88717" strokeWidth={1} />
          <text x={0} y={25} fill="#1a1408" fontSize={8} textAnchor="middle" fontWeight="bold">
            E
          </text>
        </g>
      )}
    </g>
  );
}

export function InteractiveElisa() {
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
    }, 2200);
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
    <div className="ielisa">
      <svg
        viewBox="-60 0 880 480"
        className="ielisa__svg"
        role="img"
        aria-label={`ELISA step ${stepIdx + 1} of ${STEPS.length}: ${step.label}`}
      >
        <defs>
          <linearGradient id="ielisa-cell-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dde6ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#9ab3e8" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="ielisa-color-cloud" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#5a7fbf" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5a7fbf" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ielisa-tmb-cloud" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#9aa0b4" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#9aa0b4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Chip + AMP base */}
        <g className={visible(stepIdx, "chip") ? "ie-layer ie-layer--on" : "ie-layer ie-layer--off"}>
          <rect x={60} y={400} width={460} height={26} fill="#1f2230" stroke="#3a4a6e" />
          <text x={60} y={444} fill="#6e7388" fontSize={11}>
            AMP-functionalized chip surface
          </text>
          {[110, 170, 230, 290, 350, 410, 470].map((x) => (
            <rect key={`amp-${x}`} x={x - 4} y={365} width={8} height={35} rx={4} fill="#c5d4ff" />
          ))}
        </g>

        {/* Captured cell */}
        <g className={visible(stepIdx, "cell") ? "ie-layer ie-layer--on" : "ie-layer ie-layer--off"}>
          <ellipse
            cx={290}
            cy={335}
            rx={70}
            ry={28}
            fill="url(#ielisa-cell-grad)"
            stroke="#5a7fbf"
            strokeWidth={1.5}
          />
          <g>
            <line x1={360} y1={335} x2={600} y2={335} stroke="#3a4a6e" strokeWidth={1} />
            <text x={608} y={330} fill="#c5c8d4" fontSize={14}>
              Captured E. coli
            </text>
            <text x={608} y={346} fill="#6e7388" fontSize={11}>
              fixed in formalin during return
            </text>
          </g>
        </g>

        {/* TMB cloud (colorless background — only when substrate added) */}
        {visible(stepIdx, "substrate") && !visible(stepIdx, "color") && (
          <g className="ie-fade-in">
            <ellipse cx={290} cy={170} rx={180} ry={70} fill="url(#ielisa-tmb-cloud)" />
            <text x={290} y={120} fill="#8a8fa3" fontSize="11" textAnchor="middle" fontStyle="italic">
              colorless TMB added
            </text>
          </g>
        )}

        {/* Color cloud (blue, develops on top) */}
        {visible(stepIdx, "color") && (
          <g className="ie-fade-in">
            <ellipse cx={290} cy={150} rx={180} ry={70} fill="url(#ielisa-color-cloud)" />
            <g>
              <line x1={120} y1={150} x2={40} y2={150} stroke="#3a4a6e" strokeWidth={1} />
              <text x={32} y={146} fill="#c5c8d4" fontSize={14} textAnchor="end">
                TMB → blue product
              </text>
              <text x={32} y={162} fill="#6e7388" fontSize={11} textAnchor="end">
                intensity scales with bound enzyme
              </text>
            </g>
          </g>
        )}

        {/* Primary antibodies */}
        <g className={visible(stepIdx, "primary") ? "ie-layer ie-layer--on" : "ie-layer ie-layer--off"}>
          <Antibody cx={245} cy={310} color="#a3e4c4" rotate={-15} />
          <Antibody cx={290} cy={302} color="#a3e4c4" rotate={0} />
          <Antibody cx={335} cy={310} color="#a3e4c4" rotate={15} />
          <g>
            <line x1={220} y1={285} x2={120} y2={250} stroke="#3a4a6e" strokeWidth={1} />
            <text x={112} y={246} fill="#c5c8d4" fontSize={14} textAnchor="end">
              Primary antibody
            </text>
            <text x={112} y={262} fill="#6e7388" fontSize={11} textAnchor="end">
              binds E. coli surface antigens
            </text>
          </g>
        </g>

        {/* Secondary antibodies with HRP */}
        <g className={visible(stepIdx, "secondary") ? "ie-layer ie-layer--on" : "ie-layer ie-layer--off"}>
          <Antibody cx={245} cy={240} color="#e8a3c4" hrp rotate={-15} />
          <Antibody cx={290} cy={232} color="#e8a3c4" hrp rotate={0} />
          <Antibody cx={335} cy={240} color="#e8a3c4" hrp rotate={15} />
          <g>
            <line x1={360} y1={220} x2={600} y2={210} stroke="#3a4a6e" strokeWidth={1} />
            <text x={608} y={206} fill="#c5c8d4" fontSize={14}>
              HRP-linked secondary antibody
            </text>
            <text x={608} y={222} fill="#6e7388" fontSize={11}>
              enzyme that converts substrate to color
            </text>
          </g>
        </g>

        {/* Readout panel — appears in final step. Outer g controls fade,
            inner g positions on the right. (CSS transform on the outer would
            otherwise clobber an SVG transform attribute.) */}
        <g className={visible(stepIdx, "readout") ? "ie-layer ie-layer--on" : "ie-layer ie-layer--off"}>
          <g transform="translate(640 100)">
            <ellipse cx={50} cy={30} rx={42} ry={12} fill="#0a0d14" stroke="#3a4a6e" strokeWidth={1} />
            <ellipse cx={50} cy={32} rx={40} ry={10} fill="#5a7fbf" opacity={0.75} />
            <text x={50} y={66} fill="#c5c8d4" fontSize={12} textAnchor="middle">
              OD₄₅₀ = 0.842
            </text>
            <line x1={50} y1={84} x2={50} y2={120} stroke="#5a7fbf" strokeDasharray="3 3" strokeWidth={1.2} />
            <polygon points="44,114 50,128 56,114" fill="#5a7fbf" />
            <text x={50} y={150} fill="#c5d4ff" fontSize={14} textAnchor="middle" fontWeight="600">
              1.2 × 10⁶
            </text>
            <text x={50} y={166} fill="#c5c8d4" fontSize={11} textAnchor="middle">
              cells / cm²
            </text>
            <text x={50} y={186} fill="#6e7388" fontSize={10} textAnchor="middle">
              via standard curve
            </text>
          </g>
        </g>
      </svg>

      <div className="ielisa__caption">
        <div className="ielisa__step-label">{step.label}</div>
        <p className="ielisa__step-detail">{step.detail}</p>
      </div>

      <div className="ielisa__controls">
        <div className="ielisa__nav">
          <button type="button" className="ielisa__btn" onClick={back} disabled={isFirst}>
            ← Back
          </button>
          <button type="button" className="ielisa__btn ielisa__btn--primary" onClick={next} disabled={isLast}>
            Next →
          </button>
          <button type="button" className="ielisa__btn" onClick={toggleAuto}>
            {auto ? "Pause" : isLast ? "Replay" : "Auto-play"}
          </button>
          {!isFirst && (
            <button type="button" className="ielisa__btn ielisa__btn--ghost" onClick={reset}>
              Reset
            </button>
          )}
        </div>
        <div className="ielisa__progress" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`ielisa__dot ${i <= stepIdx ? "ielisa__dot--on" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
