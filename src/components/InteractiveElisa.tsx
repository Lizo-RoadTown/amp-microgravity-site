import { useEffect, useRef, useState } from "react";

interface Step {
  id: string;
  label: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    id: "cell",
    label: "Captured cell on the chip",
    detail:
      "The flight chips come back fixed in formalin. A bacterium stuck to an AMP is locked in place. Now we want to count it.",
  },
  {
    id: "primary-flood",
    label: "Flood with primary antibody",
    detail:
      "Primary antibodies that specifically recognize E. coli surface molecules flood the chip. Many of them just drift past; a few find a cell and lock onto it. The two arms of the antibody Y are the recognition sites.",
  },
  {
    id: "primary-wash",
    label: "Wash off unbound primary",
    detail:
      "Rinse the chip. Free primary antibodies — the ones that didn't find a cell — get carried away. Only the ones gripping a cell stay behind.",
  },
  {
    id: "secondary-flood",
    label: "Flood with HRP-secondary antibody",
    detail:
      "Now a second antibody — this one carries an enzyme called horseradish peroxidase (HRP) as a passenger. Its job is to find and bind the primary antibody. Each captured cell ends up with several HRP enzymes parked on top.",
  },
  {
    id: "secondary-wash",
    label: "Wash off unbound secondary",
    detail:
      "Rinse again. Anything not anchored to a cell-then-primary-antibody gets carried away.",
  },
  {
    id: "substrate",
    label: "Add TMB substrate",
    detail:
      "TMB is a colorless small molecule. Wherever HRP is sitting, it starts converting TMB into a blue product. No bacterium → no HRP → no color.",
  },
  {
    id: "color",
    label: "Color develops",
    detail:
      "After a few minutes the blue gets darker. More cells captured = more HRP enzymes = more blue. Stop the reaction with acid at a fixed time so every chip is read at the same point.",
  },
  {
    id: "read",
    label: "Read at 450 nm and convert",
    detail:
      "A spectrophotometer measures the optical density at 450 nm. Plug that into a standard curve built from chips dosed with known cell concentrations and you get cells per square centimeter.",
  },
];

// Antibody binding positions on the cell (top half of the captured ellipse)
const ANTIBODY_POSITIONS = [
  { x: 240, rotate: -22 },
  { x: 290, rotate: 0 },
  { x: 340, rotate: 22 },
];

const SVG_W = 760;
const SVG_H = 460;
const CHIP_Y = 410;
const CELL_CY = 350;

// Visibility helpers based on step id
function showCell(stepIdx: number) {
  return stepIdx >= 0;
}

function showPrimaryFlooding(stepIdx: number) {
  return STEPS[stepIdx]?.id === "primary-flood";
}

function showPrimaryBound(stepIdx: number) {
  // Primary stays bound from primary-flood onward
  const idx = STEPS.findIndex((s) => s.id === "primary-flood");
  return stepIdx >= idx;
}

function showSecondaryFlooding(stepIdx: number) {
  return STEPS[stepIdx]?.id === "secondary-flood";
}

function showSecondaryBound(stepIdx: number) {
  const idx = STEPS.findIndex((s) => s.id === "secondary-flood");
  return stepIdx >= idx;
}

function showSubstrate(stepIdx: number) {
  const idx = STEPS.findIndex((s) => s.id === "substrate");
  return stepIdx >= idx;
}

function showColor(stepIdx: number) {
  const idx = STEPS.findIndex((s) => s.id === "color");
  return stepIdx >= idx;
}

function showReadout(stepIdx: number) {
  return STEPS[stepIdx]?.id === "read";
}

// A chunky filled-Y antibody glyph
function Antibody({
  cx,
  cy,
  rotate,
  color,
  stroke,
  hrp = false,
}: {
  cx: number;
  cy: number;
  rotate: number;
  color: string;
  stroke: string;
  hrp?: boolean;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      {/* Body / stem of the Y */}
      <path
        d="M -2.5 0 L 2.5 0 L 3 22 L -3 22 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Left arm */}
      <path
        d="M -2 -2 L -14 -22 L -9 -25 L 1 -3 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Right arm */}
      <path
        d="M 2 -2 L 14 -22 L 9 -25 L -1 -3 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Binding-site dots at the arm tips */}
      <circle cx={-11.5} cy={-23} r={2.5} fill="#f5f6fa" stroke={stroke} strokeWidth="0.6" />
      <circle cx={11.5} cy={-23} r={2.5} fill="#f5f6fa" stroke={stroke} strokeWidth="0.6" />
      {/* HRP enzyme — at the base of the stem */}
      {hrp && (
        <g transform="translate(0 28)">
          <circle r={8} fill="#e8c14a" stroke="#a88717" strokeWidth="1" />
          <text
            y={3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#1a1408"
          >
            HRP
          </text>
        </g>
      )}
    </g>
  );
}

// Several free-floating antibodies (used during flood/wash steps)
function FloatingAntibody({
  cx,
  cy,
  rotate,
  color,
  stroke,
  hrp = false,
  delay = 0,
  flooding,
  washing,
}: {
  cx: number;
  cy: number;
  rotate: number;
  color: string;
  stroke: string;
  hrp?: boolean;
  delay?: number;
  flooding: boolean;
  washing: boolean;
}) {
  const animClass = washing
    ? "ielisa-anim-wash"
    : flooding
    ? "ielisa-anim-flood"
    : "";
  return (
    <g
      className={animClass}
      style={{ animationDelay: `${delay}s`, transformOrigin: `${cx}px ${cy}px` }}
    >
      <Antibody cx={cx} cy={cy} rotate={rotate} color={color} stroke={stroke} hrp={hrp} />
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
    }, 2400);
  }, [auto, stepIdx]);

  const step = STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STEPS.length - 1;

  const next = () => !isLast && setStepIdx(stepIdx + 1);
  const back = () => !isFirst && setStepIdx(stepIdx - 1);
  const reset = () => { setAuto(false); setStepIdx(0); };
  const toggleAuto = () => {
    if (auto) setAuto(false);
    else {
      if (isLast) setStepIdx(0);
      setAuto(true);
    }
  };

  return (
    <div className="ielisa">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="ielisa__svg"
        role="img"
        aria-label={`ELISA step ${stepIdx + 1} of ${STEPS.length}: ${step.label}`}
      >
        <defs>
          <linearGradient id="ielisa-cell-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dde6ff" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#9ab3e8" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="ielisa-chip-glow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="#5a7fbf" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5a7fbf" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft glow above chip */}
        <ellipse cx={SVG_W / 2} cy={CHIP_Y} rx={300} ry={180} fill="url(#ielisa-chip-glow)" />

        {/* Chip + AMP base */}
        <g>
          <rect x={120} y={CHIP_Y} width={520} height={28} fill="#1f2230" stroke="#3a4a6e" />
          {/* AMP capture columns */}
          {[170, 220, 270, 320, 370, 420, 470, 520, 570].map((x) => (
            <rect
              key={`amp-${x}`}
              x={x - 4}
              y={CHIP_Y - 32}
              width={8}
              height={32}
              rx={4}
              fill="#c5d4ff"
              opacity="0.85"
            />
          ))}
          <text
            x={SVG_W / 2}
            y={CHIP_Y + 50}
            fill="#6e7388"
            fontSize="11"
            textAnchor="middle"
            letterSpacing="0.1em"
            fontWeight="600"
          >
            AMP-FUNCTIONALIZED CHIP
          </text>
        </g>

        {/* Captured cell */}
        {showCell(stepIdx) && (
          <g>
            <ellipse
              cx={290}
              cy={CELL_CY}
              rx={62}
              ry={22}
              fill="url(#ielisa-cell-grad)"
              stroke="#5a7fbf"
              strokeWidth="1.5"
            />
            {/* Surface antigen markers — small bumps representing the antibody binding targets */}
            {[
              { dx: -42, dy: -16 },
              { dx: -22, dy: -20 },
              { dx: 0, dy: -22 },
              { dx: 22, dy: -20 },
              { dx: 42, dy: -16 },
            ].map((p, i) => (
              <circle
                key={`ag-${i}`}
                cx={290 + p.dx}
                cy={CELL_CY + p.dy}
                r={3}
                fill="#7a98d8"
                stroke="#3a4a6e"
                strokeWidth="0.8"
              />
            ))}
            <text
              x={380}
              y={CELL_CY + 4}
              fill="#c5c8d4"
              fontSize="12"
              fontWeight="600"
            >
              E. coli
            </text>
            <text
              x={380}
              y={CELL_CY + 18}
              fill="#6e7388"
              fontSize="10"
            >
              captured, fixed
            </text>
          </g>
        )}

        {/* Primary antibody — bound forms */}
        {showPrimaryBound(stepIdx) && (
          <g className="ielisa-fade-in">
            {ANTIBODY_POSITIONS.map((p, i) => (
              <Antibody
                key={`pri-bound-${i}`}
                cx={p.x}
                cy={CELL_CY - 16}
                rotate={p.rotate}
                color="#a3e4c4"
                stroke="#5fbf8c"
              />
            ))}
            <text
              x={130}
              y={CELL_CY - 50}
              fill="#a3e4c4"
              fontSize="11"
              fontWeight="600"
              letterSpacing="0.06em"
            >
              PRIMARY ANTIBODY
            </text>
            <text x={130} y={CELL_CY - 36} fill="#6e7388" fontSize="10">
              binds E. coli antigens
            </text>
          </g>
        )}

        {/* Primary antibodies — flooding state (extra free ones) */}
        {showPrimaryFlooding(stepIdx) && (
          <>
            {[
              { x: 180, y: 200, r: 12, delay: 0 },
              { x: 250, y: 160, r: -18, delay: 0.15 },
              { x: 380, y: 180, r: -5, delay: 0.3 },
              { x: 450, y: 220, r: 24, delay: 0.45 },
              { x: 520, y: 170, r: -12, delay: 0.6 },
              { x: 600, y: 210, r: 8, delay: 0.75 },
            ].map((p, i) => (
              <FloatingAntibody
                key={`pri-free-${i}`}
                cx={p.x}
                cy={p.y}
                rotate={p.r}
                color="#a3e4c4"
                stroke="#5fbf8c"
                delay={p.delay}
                flooding
                washing={false}
              />
            ))}
          </>
        )}

        {/* Primary wash — unbound antibodies fading and sliding away */}
        {STEPS[stepIdx]?.id === "primary-wash" && (
          <>
            {[
              { x: 180, y: 200, r: 12, delay: 0 },
              { x: 380, y: 180, r: -5, delay: 0.1 },
              { x: 520, y: 170, r: -12, delay: 0.2 },
              { x: 600, y: 210, r: 8, delay: 0.3 },
            ].map((p, i) => (
              <FloatingAntibody
                key={`pri-wash-${i}`}
                cx={p.x}
                cy={p.y}
                rotate={p.r}
                color="#a3e4c4"
                stroke="#5fbf8c"
                delay={p.delay}
                flooding={false}
                washing
              />
            ))}
            <WashLabel y={120} />
          </>
        )}

        {/* Secondary antibody — bound forms */}
        {showSecondaryBound(stepIdx) && (
          <g className="ielisa-fade-in">
            {ANTIBODY_POSITIONS.map((p, i) => (
              <Antibody
                key={`sec-bound-${i}`}
                cx={p.x}
                cy={CELL_CY - 56}
                rotate={p.rotate * 0.5}
                color="#e8a3c4"
                stroke="#b8628a"
                hrp
              />
            ))}
            <text
              x={460}
              y={CELL_CY - 90}
              fill="#e8a3c4"
              fontSize="11"
              fontWeight="600"
              letterSpacing="0.06em"
            >
              SECONDARY + HRP
            </text>
            <text x={460} y={CELL_CY - 76} fill="#6e7388" fontSize="10">
              enzyme that makes color
            </text>
          </g>
        )}

        {/* Secondary flood */}
        {showSecondaryFlooding(stepIdx) && (
          <>
            {[
              { x: 180, y: 110, r: 12, delay: 0 },
              { x: 250, y: 90, r: -18, delay: 0.15 },
              { x: 410, y: 100, r: -5, delay: 0.3 },
              { x: 480, y: 130, r: 24, delay: 0.45 },
              { x: 560, y: 110, r: -12, delay: 0.6 },
            ].map((p, i) => (
              <FloatingAntibody
                key={`sec-free-${i}`}
                cx={p.x}
                cy={p.y}
                rotate={p.r}
                color="#e8a3c4"
                stroke="#b8628a"
                hrp
                delay={p.delay}
                flooding
                washing={false}
              />
            ))}
          </>
        )}

        {/* Secondary wash */}
        {STEPS[stepIdx]?.id === "secondary-wash" && (
          <>
            {[
              { x: 180, y: 110, r: 12, delay: 0 },
              { x: 410, y: 100, r: -5, delay: 0.1 },
              { x: 560, y: 110, r: -12, delay: 0.2 },
            ].map((p, i) => (
              <FloatingAntibody
                key={`sec-wash-${i}`}
                cx={p.x}
                cy={p.y}
                rotate={p.r}
                color="#e8a3c4"
                stroke="#b8628a"
                hrp
                delay={p.delay}
                flooding={false}
                washing
              />
            ))}
            <WashLabel y={60} />
          </>
        )}

        {/* TMB substrate molecules — colorless dots floating near the HRP zone */}
        {showSubstrate(stepIdx) && !showColor(stepIdx) && (
          <g className="ielisa-fade-in">
            {[
              { x: 220, y: 240 },
              { x: 260, y: 220 },
              { x: 300, y: 230 },
              { x: 350, y: 215 },
              { x: 390, y: 245 },
              { x: 200, y: 280 },
              { x: 420, y: 270 },
              { x: 280, y: 195 },
              { x: 340, y: 260 },
            ].map((p, i) => (
              <circle
                key={`tmb-${i}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#9aa0b4"
                stroke="#6e7388"
                strokeWidth="0.6"
                opacity="0.75"
              >
                <animate
                  attributeName="cy"
                  values={`${p.y};${p.y - 8};${p.y}`}
                  dur={`${3 + (i % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
            <text
              x={600}
              y={240}
              fill="#9aa0b4"
              fontSize="11"
              fontWeight="600"
              letterSpacing="0.06em"
            >
              TMB SUBSTRATE
            </text>
            <text x={600} y={254} fill="#6e7388" fontSize="10">
              colorless — yet
            </text>
          </g>
        )}

        {/* Color development — TMB molecules turn blue */}
        {showColor(stepIdx) && (
          <g className="ielisa-fade-in">
            {[
              { x: 220, y: 240, delay: 0 },
              { x: 260, y: 220, delay: 0.05 },
              { x: 300, y: 230, delay: 0.1 },
              { x: 350, y: 215, delay: 0.15 },
              { x: 390, y: 245, delay: 0.2 },
              { x: 200, y: 280, delay: 0.25 },
              { x: 420, y: 270, delay: 0.3 },
              { x: 280, y: 195, delay: 0.35 },
              { x: 340, y: 260, delay: 0.4 },
              { x: 250, y: 260, delay: 0.18 },
              { x: 320, y: 200, delay: 0.22 },
              { x: 370, y: 285, delay: 0.32 },
            ].map((p, i) => (
              <circle
                key={`blue-${i}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="#5a7fbf"
                stroke="#7a98d8"
                strokeWidth="0.6"
                style={{ animationDelay: `${p.delay}s` }}
                className="ielisa-color-dot"
              />
            ))}
            {/* Soft blue cloud overlay */}
            <ellipse
              cx={290}
              cy={240}
              rx={170}
              ry={60}
              fill="#5a7fbf"
              opacity="0.18"
              className="ielisa-cloud-in"
            />
            <text
              x={600}
              y={240}
              fill="#7a98d8"
              fontSize="11"
              fontWeight="600"
              letterSpacing="0.06em"
            >
              BLUE PRODUCT
            </text>
            <text x={600} y={254} fill="#6e7388" fontSize="10">
              made by HRP enzyme
            </text>
          </g>
        )}

        {/* Readout panel — wrapped in outer/inner for fade + position */}
        <g
          className={showReadout(stepIdx) ? "ielisa-readout ielisa-readout--on" : "ielisa-readout ielisa-readout--off"}
        >
          <g transform="translate(620 60)">
            {/* Well */}
            <ellipse cx={50} cy={26} rx={42} ry={12} fill="#0a0d14" stroke="#3a4a6e" strokeWidth={1} />
            <ellipse cx={50} cy={28} rx={40} ry={10} fill="#5a7fbf" opacity={0.78} />
            <text x={50} y={62} fill="#c5c8d4" fontSize="12" textAnchor="middle">
              OD₄₅₀ = 0.842
            </text>
            <line x1={50} y1={80} x2={50} y2={120} stroke="#5a7fbf" strokeDasharray="3 3" strokeWidth={1.2} />
            <polygon points="44,114 50,128 56,114" fill="#5a7fbf" />
            <text x={50} y={146} fill="#c5d4ff" fontSize="13" textAnchor="middle" fontWeight="700">
              1.2 × 10⁶
            </text>
            <text x={50} y={160} fill="#c5c8d4" fontSize="10" textAnchor="middle">
              cells / cm²
            </text>
            <text x={50} y={178} fill="#6e7388" fontSize="9" textAnchor="middle">
              via standard curve
            </text>
          </g>
        </g>

        {/* Step badge — top left */}
        <g transform="translate(30 30)">
          <circle r={18} fill="#11161f" stroke="#5a7fbf" strokeWidth="1.5" />
          <text
            y={5}
            fontSize="15"
            fontWeight="700"
            fill="#c5d4ff"
            textAnchor="middle"
          >
            {stepIdx + 1}
          </text>
        </g>
        <text
          x={62}
          y={28}
          fill="#c5d4ff"
          fontSize="12"
          fontWeight="600"
          letterSpacing="0.05em"
        >
          STEP {stepIdx + 1} / {STEPS.length}
        </text>
        <text x={62} y={42} fill="#8a8fa3" fontSize="10">
          {step.label}
        </text>
      </svg>

      <div className="ielisa__caption">
        <div className="ielisa__step-label">
          {stepIdx + 1}. {step.label}
        </div>
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

function WashLabel({ y }: { y: number }) {
  return (
    <g className="ielisa-fade-in">
      <rect
        x={SVG_W / 2 - 80}
        y={y - 12}
        width={160}
        height={24}
        rx={12}
        fill="rgba(122, 152, 216, 0.18)"
        stroke="#5a7fbf"
        strokeWidth="1"
      />
      <text
        x={SVG_W / 2}
        y={y + 4}
        textAnchor="middle"
        fill="#c5d4ff"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        WASH
      </text>
    </g>
  );
}
