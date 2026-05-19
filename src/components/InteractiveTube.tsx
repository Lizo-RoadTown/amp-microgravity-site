import { useEffect, useRef, useState } from "react";

const CM_TO_PX = 18;
const TUBE_Y = 70;
const TUBE_HEIGHT = 56;

const CAP_CM = 1;
const VALVE_CM = 2;
const CHAMBER_1_CM = 5;
const CHAMBER_2_CM = 13;
const CHAMBER_3_CM = 5;

const TUBE_OFFSET_X = 110;

function px(cm: number) {
  return cm * CM_TO_PX;
}

type SelectableId = "c1" | "c2" | "c3" | "vA" | "vB" | null;

interface SelectionInfo {
  title: string;
  detail: string;
  hint?: string;
}

const SELECTION_TEXT: Record<Exclude<SelectableId, null>, SelectionInfo> = {
  c1: {
    title: "Chamber 1 — freeze-dried bacteria",
    detail:
      "5 cm long, 5 mL capacity. Loaded with freeze-dried ΔfimA E. coli (K-12, Keio Collection JW1881). Completely dry, inert, sealed off from the rest of the tube until Valve A opens.",
  },
  vA: {
    title: "Valve A",
    detail:
      "Crew opens this on Day U-5 (five days before the capsule undocks from the ISS) and shakes the tube gently for 15 seconds. Chamber 1 contents — buffer + freeze-dried bacteria — flow through into Chamber 2, where the chips are waiting. This is when the capture experiment actually begins.",
    hint: "Click the valve to open it.",
  },
  c2: {
    title: "Chamber 2 — chip chamber",
    detail:
      "13 cm long, 10 mL capacity. The biggest chamber. Holds six 8 × 8 mm AMP-coated glass chips in PBS with BS3 crosslinker. After Valve A opens, the rehydrated bacteria mix in here and start binding to the chips.",
  },
  vB: {
    title: "Valve B",
    detail:
      "Crew opens this on Day U-2 (two days before undocking). Formalin from Chamber 3 floods Chamber 2 and chemically locks every bound cell in place. After this, the chips are essentially frozen in whatever state they reached on orbit.",
    hint: "Click the valve to open it.",
  },
  c3: {
    title: "Chamber 3 — formalin",
    detail:
      "5 cm long, 5 mL capacity. Holds 10% neutral-buffered formalin — the standard tissue fixative. Sits sealed until Valve B opens, then floods Chamber 2 to fix the experiment.",
  },
};

type ValveState = "closed" | "open";

export function InteractiveTube() {
  const [selected, setSelected] = useState<SelectableId>(null);
  const [vAState, setVAState] = useState<ValveState>("closed");
  const [vBState, setVBState] = useState<ValveState>("closed");
  const sequenceTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      sequenceTimers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Layout calculations
  let cursor = TUBE_OFFSET_X;
  const capL = { x: cursor, w: px(CAP_CM) }; cursor += capL.w;
  const c1 = { x: cursor, w: px(CHAMBER_1_CM) }; cursor += c1.w;
  const vA = { x: cursor, w: px(VALVE_CM) }; cursor += vA.w;
  const c2 = { x: cursor, w: px(CHAMBER_2_CM) }; cursor += c2.w;
  const vB = { x: cursor, w: px(VALVE_CM) }; cursor += vB.w;
  const c3 = { x: cursor, w: px(CHAMBER_3_CM) }; cursor += c3.w;
  const capR = { x: cursor, w: px(CAP_CM) }; cursor += capR.w;
  const tubeRight = cursor;
  const tubeLeft = TUBE_OFFSET_X;

  const handleValveClick = (which: "A" | "B") => {
    if (which === "A") {
      setVAState((s) => (s === "closed" ? "open" : "closed"));
    } else {
      setVBState((s) => (s === "closed" ? "open" : "closed"));
    }
    setSelected(which === "A" ? "vA" : "vB");
  };

  const runSequence = () => {
    sequenceTimers.current.forEach((t) => window.clearTimeout(t));
    sequenceTimers.current = [];
    setVAState("closed");
    setVBState("closed");
    setSelected("vA");
    sequenceTimers.current.push(
      window.setTimeout(() => {
        setVAState("open");
      }, 400),
    );
    sequenceTimers.current.push(
      window.setTimeout(() => {
        setSelected("vB");
      }, 2800),
    );
    sequenceTimers.current.push(
      window.setTimeout(() => {
        setVBState("open");
      }, 3200),
    );
  };

  const reset = () => {
    sequenceTimers.current.forEach((t) => window.clearTimeout(t));
    sequenceTimers.current = [];
    setVAState("closed");
    setVBState("closed");
    setSelected(null);
  };

  const info = selected ? SELECTION_TEXT[selected] : null;

  // Chamber 2 fill changes based on valve states
  const c2Fill =
    vBState === "open"
      ? "#5a4a2a"  // formalin (warm)
      : vAState === "open"
      ? "#1a3a5a"  // bacteria-laden buffer (slightly darker blue)
      : "#1a3a5a"; // initial PBS

  const c2Opacity = vAState === "open" || vBState === "open" ? 0.65 : 0.45;

  // For chamber 1: dots fade out when valve A opens
  const c1DotsOpacity = vAState === "open" ? 0.15 : 0.85;

  // For chamber 3: warm fill fades when valve B opens
  const c3Opacity = vBState === "open" ? 0.08 : 0.35;

  return (
    <div className="itube">
      <div className="itube__overlay">
        {info ? (
          <>
            <span className="itube__overlay-title">{info.title}</span>
            <span className="itube__overlay-detail">{info.detail}</span>
            {info.hint && <span className="itube__overlay-hint">{info.hint}</span>}
          </>
        ) : (
          <span className="itube__overlay-prompt">
            Click any chamber or valve below. Click a valve a second time to open it.
          </span>
        )}
      </div>
      <svg
        viewBox="0 0 800 280"
        className="itube__svg"
        role="img"
        aria-label="Interactive cross-section of the RhFET-01 tube. Click chambers and valves to learn what they do; click valves to open them."
      >
        <defs>
          <linearGradient id="itube-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1d28" />
            <stop offset="50%" stopColor="#11141d" />
            <stop offset="100%" stopColor="#1a1d28" />
          </linearGradient>
        </defs>

        {/* End caps */}
        <ellipse
          cx={capL.x + capL.w / 2}
          cy={TUBE_Y + TUBE_HEIGHT / 2}
          rx={capL.w / 2 + 2}
          ry={TUBE_HEIGHT / 2 + 1}
          fill="#2a2f3e"
          stroke="#3a4a6e"
        />
        <ellipse
          cx={capR.x + capR.w / 2}
          cy={TUBE_Y + TUBE_HEIGHT / 2}
          rx={capR.w / 2 + 2}
          ry={TUBE_HEIGHT / 2 + 1}
          fill="#2a2f3e"
          stroke="#3a4a6e"
        />

        {/* Tube body */}
        <rect
          x={c1.x}
          y={TUBE_Y}
          width={c3.x + c3.w - c1.x}
          height={TUBE_HEIGHT}
          fill="url(#itube-body)"
          stroke="#3a4a6e"
        />

        {/* Chamber 1 — clickable */}
        <g
          className={`itube-target ${selected === "c1" ? "itube-target--selected" : ""}`}
          onClick={() => setSelected("c1")}
          role="button"
          tabIndex={0}
          aria-label="Chamber 1"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelected("c1");
            }
          }}
        >
          <rect
            x={c1.x}
            y={TUBE_Y}
            width={c1.w}
            height={TUBE_HEIGHT}
            fill="transparent"
          />
          <g style={{ opacity: c1DotsOpacity, transition: "opacity 0.8s ease" }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <circle
                key={i}
                cx={c1.x + 6 + (i % 7) * (c1.w / 8)}
                cy={TUBE_Y + 14 + Math.floor(i / 7) * 24}
                r={1.6}
                fill="#c5d4ff"
                opacity={0.85}
              />
            ))}
          </g>
        </g>

        {/* Bacteria flow particles when Valve A opens */}
        {vAState === "open" && (
          <g className="itube-flow itube-flow--a">
            {Array.from({ length: 10 }).map((_, i) => {
              const startX = c1.x + 18 + (i % 3) * 14;
              const endX = c2.x + 30 + (i % 5) * 40;
              const startY = TUBE_Y + 18 + (i % 4) * 8;
              const endY = TUBE_Y + 20 + (i % 5) * 7;
              return (
                <circle
                  key={`flow-a-${i}`}
                  r={2}
                  fill="#c5d4ff"
                  opacity="0.9"
                >
                  <animate
                    attributeName="cx"
                    values={`${startX};${endX}`}
                    dur="1.6s"
                    begin={`${i * 0.12}s`}
                    fill="freeze"
                  />
                  <animate
                    attributeName="cy"
                    values={`${startY};${endY}`}
                    dur="1.6s"
                    begin={`${i * 0.12}s`}
                    fill="freeze"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.9;0.9;0"
                    dur="1.6s"
                    begin={`${i * 0.12}s`}
                    fill="freeze"
                  />
                </circle>
              );
            })}
          </g>
        )}

        {/* Valve A — clickable */}
        <g
          className={`itube-target itube-valve ${selected === "vA" ? "itube-target--selected" : ""} itube-valve--${vAState}`}
          onClick={() => handleValveClick("A")}
          role="button"
          tabIndex={0}
          aria-label={`Valve A — ${vAState}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleValveClick("A");
            }
          }}
        >
          <rect
            x={vA.x}
            y={TUBE_Y - 6}
            width={vA.w}
            height={TUBE_HEIGHT + 12}
            fill={vAState === "open" ? "#1a3a5a" : "#0a0d14"}
            stroke="#5a7fbf"
            style={{ transition: "fill 0.4s ease" }}
          />
          <circle
            cx={vA.x + vA.w / 2}
            cy={TUBE_Y + TUBE_HEIGHT / 2}
            r={9}
            fill={vAState === "open" ? "#a3e4c4" : "#3a4a6e"}
            stroke={vAState === "open" ? "#5fbf8c" : "#5a7fbf"}
            style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
          />
          <text
            x={vA.x + vA.w / 2}
            y={TUBE_Y + TUBE_HEIGHT / 2 + 3}
            fill={vAState === "open" ? "#0a0d14" : "#c5d4ff"}
            fontSize={10}
            textAnchor="middle"
            fontWeight="bold"
            style={{ transition: "fill 0.3s ease" }}
          >
            A
          </text>
        </g>

        {/* Chamber 2 — clickable */}
        <g
          className={`itube-target ${selected === "c2" ? "itube-target--selected" : ""}`}
          onClick={() => setSelected("c2")}
          role="button"
          tabIndex={0}
          aria-label="Chamber 2"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelected("c2");
            }
          }}
        >
          <rect
            x={c2.x}
            y={TUBE_Y}
            width={c2.w}
            height={TUBE_HEIGHT}
            fill="transparent"
          />
          <rect
            x={c2.x + 2}
            y={TUBE_Y + 6}
            width={c2.w - 4}
            height={TUBE_HEIGHT - 12}
            fill={c2Fill}
            opacity={c2Opacity}
            style={{ transition: "fill 0.8s ease, opacity 0.8s ease" }}
          />
          {/* 6 chips */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = c2.x + 16 + i * ((c2.w - 32) / 5);
            const y = TUBE_Y + (i % 2 === 0 ? 18 : 32);
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={8}
                height={8}
                fill="#5a7fbf"
                stroke="#7a98d8"
                strokeWidth={0.6}
              />
            );
          })}
        </g>

        {/* Formalin flow particles when Valve B opens */}
        {vBState === "open" && (
          <g className="itube-flow itube-flow--b">
            {Array.from({ length: 12 }).map((_, i) => {
              const startX = c3.x + 18 + (i % 3) * 14;
              const endX = c2.x + c2.w - 30 - (i % 5) * 40;
              const startY = TUBE_Y + 18 + (i % 4) * 8;
              const endY = TUBE_Y + 20 + (i % 5) * 7;
              return (
                <circle
                  key={`flow-b-${i}`}
                  r={2}
                  fill="#e8c14a"
                  opacity="0.85"
                >
                  <animate
                    attributeName="cx"
                    values={`${startX};${endX}`}
                    dur="1.6s"
                    begin={`${i * 0.1}s`}
                    fill="freeze"
                  />
                  <animate
                    attributeName="cy"
                    values={`${startY};${endY}`}
                    dur="1.6s"
                    begin={`${i * 0.1}s`}
                    fill="freeze"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.85;0.85;0"
                    dur="1.6s"
                    begin={`${i * 0.1}s`}
                    fill="freeze"
                  />
                </circle>
              );
            })}
          </g>
        )}

        {/* Valve B — clickable */}
        <g
          className={`itube-target itube-valve ${selected === "vB" ? "itube-target--selected" : ""} itube-valve--${vBState}`}
          onClick={() => handleValveClick("B")}
          role="button"
          tabIndex={0}
          aria-label={`Valve B — ${vBState}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleValveClick("B");
            }
          }}
        >
          <rect
            x={vB.x}
            y={TUBE_Y - 6}
            width={vB.w}
            height={TUBE_HEIGHT + 12}
            fill={vBState === "open" ? "#5a4a2a" : "#0a0d14"}
            stroke="#5a7fbf"
            style={{ transition: "fill 0.4s ease" }}
          />
          <circle
            cx={vB.x + vB.w / 2}
            cy={TUBE_Y + TUBE_HEIGHT / 2}
            r={9}
            fill={vBState === "open" ? "#e8c14a" : "#3a4a6e"}
            stroke={vBState === "open" ? "#b8941c" : "#5a7fbf"}
            style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
          />
          <text
            x={vB.x + vB.w / 2}
            y={TUBE_Y + TUBE_HEIGHT / 2 + 3}
            fill={vBState === "open" ? "#0a0d14" : "#c5d4ff"}
            fontSize={10}
            textAnchor="middle"
            fontWeight="bold"
            style={{ transition: "fill 0.3s ease" }}
          >
            B
          </text>
        </g>

        {/* Chamber 3 — clickable */}
        <g
          className={`itube-target ${selected === "c3" ? "itube-target--selected" : ""}`}
          onClick={() => setSelected("c3")}
          role="button"
          tabIndex={0}
          aria-label="Chamber 3"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelected("c3");
            }
          }}
        >
          <rect
            x={c3.x}
            y={TUBE_Y}
            width={c3.w}
            height={TUBE_HEIGHT}
            fill="transparent"
          />
          <rect
            x={c3.x + 2}
            y={TUBE_Y + 6}
            width={c3.w - 4}
            height={TUBE_HEIGHT - 12}
            fill="#5a4a2a"
            opacity={c3Opacity}
            style={{ transition: "opacity 0.8s ease" }}
          />
        </g>

        {/* Selected highlight rings */}
        {selected === "c1" && (
          <rect
            x={c1.x - 2}
            y={TUBE_Y - 2}
            width={c1.w + 4}
            height={TUBE_HEIGHT + 4}
            fill="none"
            stroke="#c5d4ff"
            strokeWidth="1.5"
            rx="2"
          />
        )}
        {selected === "c2" && (
          <rect
            x={c2.x - 2}
            y={TUBE_Y - 2}
            width={c2.w + 4}
            height={TUBE_HEIGHT + 4}
            fill="none"
            stroke="#c5d4ff"
            strokeWidth="1.5"
            rx="2"
          />
        )}
        {selected === "c3" && (
          <rect
            x={c3.x - 2}
            y={TUBE_Y - 2}
            width={c3.w + 4}
            height={TUBE_HEIGHT + 4}
            fill="none"
            stroke="#c5d4ff"
            strokeWidth="1.5"
            rx="2"
          />
        )}

        {/* Labels above chambers */}
        <text x={c1.x + c1.w / 2} y={TUBE_Y - 14} fill="#c5c8d4" fontSize={11} textAnchor="middle">
          chamber 1
        </text>
        <text x={c2.x + c2.w / 2} y={TUBE_Y - 14} fill="#c5c8d4" fontSize={11} textAnchor="middle">
          chamber 2 (chips)
        </text>
        <text x={c3.x + c3.w / 2} y={TUBE_Y - 14} fill="#c5c8d4" fontSize={11} textAnchor="middle">
          chamber 3
        </text>

        {/* Dimension labels below */}
        {[
          { x: c1.x, w: c1.w, text: "5 cm" },
          { x: c2.x, w: c2.w, text: "13 cm" },
          { x: c3.x, w: c3.w, text: "5 cm" },
        ].map((d, i) => (
          <g key={i}>
            <line x1={d.x + 2} y1={TUBE_Y + TUBE_HEIGHT + 8} x2={d.x + d.w - 2} y2={TUBE_Y + TUBE_HEIGHT + 8} stroke="#6e7388" strokeWidth={1} />
            <line x1={d.x + 2} y1={TUBE_Y + TUBE_HEIGHT + 5} x2={d.x + 2} y2={TUBE_Y + TUBE_HEIGHT + 11} stroke="#6e7388" />
            <line x1={d.x + d.w - 2} y1={TUBE_Y + TUBE_HEIGHT + 5} x2={d.x + d.w - 2} y2={TUBE_Y + TUBE_HEIGHT + 11} stroke="#6e7388" />
            <text x={d.x + d.w / 2} y={TUBE_Y + TUBE_HEIGHT + 22} fill="#8a8fa3" fontSize={10} textAnchor="middle">{d.text}</text>
          </g>
        ))}

        {/* Total length bracket */}
        <line x1={tubeLeft} y1={TUBE_Y + TUBE_HEIGHT + 42} x2={tubeRight} y2={TUBE_Y + TUBE_HEIGHT + 42} stroke="#5a7fbf" strokeWidth={1} />
        <line x1={tubeLeft} y1={TUBE_Y + TUBE_HEIGHT + 38} x2={tubeLeft} y2={TUBE_Y + TUBE_HEIGHT + 46} stroke="#5a7fbf" />
        <line x1={tubeRight} y1={TUBE_Y + TUBE_HEIGHT + 38} x2={tubeRight} y2={TUBE_Y + TUBE_HEIGHT + 46} stroke="#5a7fbf" />
        <text x={(tubeLeft + tubeRight) / 2} y={TUBE_Y + TUBE_HEIGHT + 58} fill="#c5d4ff" fontSize={12} textAnchor="middle" fontWeight="500">
          29 cm total · 12 mm outer diameter · 20 mL total fluid
        </text>
      </svg>

      <div className="itube__controls">
        <div className="itube__valve-states">
          <span className={vAState === "open" ? "itube__valve-pill itube__valve-pill--open" : "itube__valve-pill"}>
            Valve A: <strong>{vAState}</strong>
          </span>
          <span className={vBState === "open" ? "itube__valve-pill itube__valve-pill--open" : "itube__valve-pill"}>
            Valve B: <strong>{vBState}</strong>
          </span>
        </div>
        <div className="itube__buttons">
          <button type="button" className="itube__btn itube__btn--primary" onClick={runSequence}>
            Run U-5 → U-2 sequence
          </button>
          <button type="button" className="itube__btn itube__btn--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

    </div>
  );
}
