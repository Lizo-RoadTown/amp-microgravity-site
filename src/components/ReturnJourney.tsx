import { useEffect, useRef, useState } from "react";

interface Stage {
  id: string;
  label: string;
  detail: string;
  capsuleY: number; // 0 = near ISS, 1 = at ocean
  capsuleScale: number;
  plasma: boolean;
  parachute: boolean;
  splash: boolean;
  boat: boolean;
  labArrow: boolean;
}

const STAGES: Stage[] = [
  {
    id: "docked",
    label: "Day U-2 · fixed on orbit",
    detail:
      "Crew opens Valve B. Formalin locks every bound cell — from now on, whatever's on the chips stays on the chips.",
    capsuleY: 0.08,
    capsuleScale: 1,
    plasma: false,
    parachute: false,
    splash: false,
    boat: false,
    labArrow: false,
  },
  {
    id: "undock",
    label: "Day U-0 · undocking",
    detail:
      "The Dragon capsule separates from the ISS and begins its descent. Our tube is sealed inside the cargo bay.",
    capsuleY: 0.22,
    capsuleScale: 1,
    plasma: false,
    parachute: false,
    splash: false,
    boat: false,
    labArrow: false,
  },
  {
    id: "reentry",
    label: "Atmospheric reentry",
    detail:
      "~28,000 km/h, ~1,650°C plasma sheath outside. Cargo bay stays comfortable.",
    capsuleY: 0.5,
    capsuleScale: 0.92,
    plasma: true,
    parachute: false,
    splash: false,
    boat: false,
    labArrow: false,
  },
  {
    id: "parachute",
    label: "Parachute deploy",
    detail:
      "Drogue then mains deploy around 5–10 km up. Supersonic → ~25 km/h.",
    capsuleY: 0.72,
    capsuleScale: 0.95,
    plasma: false,
    parachute: true,
    splash: false,
    boat: false,
    labArrow: false,
  },
  {
    id: "splashdown",
    label: "Splashdown",
    detail:
      "Splashdown off Florida or California. The tube hasn't moved; the formalin held.",
    capsuleY: 0.93,
    capsuleScale: 0.9,
    plasma: false,
    parachute: false,
    splash: true,
    boat: false,
    labArrow: false,
  },
  {
    id: "recovery",
    label: "Recovery",
    detail:
      "Recovery boats in ~30 min. Cargo helicoptered to staging, then flown to the lab.",
    capsuleY: 0.95,
    capsuleScale: 0.85,
    plasma: false,
    parachute: false,
    splash: false,
    boat: true,
    labArrow: false,
  },
  {
    id: "lab",
    label: "Back to the lab",
    detail:
      "Chips on the bench. What we image now is exactly what happened on orbit.",
    capsuleY: 0.95,
    capsuleScale: 0.8,
    plasma: false,
    parachute: false,
    splash: false,
    boat: true,
    labArrow: true,
  },
];

const VIEW_W = 600;
const VIEW_H = 540;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ReturnJourney() {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (playTimer.current !== null) window.clearTimeout(playTimer.current);
    };
  }, []);

  useEffect(() => {
    if (playTimer.current !== null) window.clearTimeout(playTimer.current);
    if (!playing) return;
    if (stepIdx >= STAGES.length - 1) {
      setPlaying(false);
      return;
    }
    playTimer.current = window.setTimeout(() => {
      setStepIdx((s) => s + 1);
    }, 2200);
  }, [playing, stepIdx]);

  const stage = STAGES[stepIdx];
  const capsuleY = lerp(40, VIEW_H - 60, stage.capsuleY);
  const capsuleX = VIEW_W / 2;

  const isFirst = stepIdx === 0;
  const isLast = stepIdx === STAGES.length - 1;

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (isLast) setStepIdx(0);
      setPlaying(true);
    }
  };

  const next = () => {
    setPlaying(false);
    if (!isLast) setStepIdx(stepIdx + 1);
  };
  const back = () => {
    setPlaying(false);
    if (!isFirst) setStepIdx(stepIdx - 1);
  };
  const reset = () => {
    setPlaying(false);
    setStepIdx(0);
  };

  return (
    <div className="rjourney">
      <div className="rjourney__stage">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="rjourney__svg"
        role="img"
        aria-label={`Return journey, step ${stepIdx + 1} of ${STAGES.length}: ${stage.label}`}
      >
        <defs>
          <linearGradient id="rj-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02050a" />
            <stop offset="30%" stopColor="#0a1424" />
            <stop offset="55%" stopColor="#1a3a5a" />
            <stop offset="78%" stopColor="#2a5e8a" />
            <stop offset="92%" stopColor="#1a3a5a" />
            <stop offset="100%" stopColor="#0a1c30" />
          </linearGradient>
          <linearGradient id="rj-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e2438" />
            <stop offset="100%" stopColor="#050d18" />
          </linearGradient>
          <radialGradient id="rj-plasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd17a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#ff6b3d" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff6b3d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky background */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H * 0.85} fill="url(#rj-sky)" />
        {/* Ocean */}
        <rect x="0" y={VIEW_H * 0.85} width={VIEW_W} height={VIEW_H * 0.15} fill="url(#rj-ocean)" />
        {/* Ocean wave hint */}
        <path
          d={`M 0 ${VIEW_H * 0.85} Q ${VIEW_W / 4} ${VIEW_H * 0.85 - 4} ${VIEW_W / 2} ${VIEW_H * 0.85} T ${VIEW_W} ${VIEW_H * 0.85}`}
          stroke="#5a7fbf"
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
        />

        {/* Stars (top half) */}
        <g opacity="0.85">
          {[
            { x: 50, y: 60, r: 0.7 },
            { x: 120, y: 30, r: 0.6 },
            { x: 200, y: 80, r: 0.5 },
            { x: 340, y: 40, r: 0.7 },
            { x: 440, y: 70, r: 0.6 },
            { x: 520, y: 30, r: 0.8 },
            { x: 80, y: 130, r: 0.5 },
            { x: 280, y: 150, r: 0.6 },
            { x: 480, y: 140, r: 0.5 },
            { x: 560, y: 100, r: 0.6 },
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#c5d4ff" />
          ))}
        </g>

        {/* ISS silhouette at top */}
        <g>
          {/* Truss */}
          <rect x={VIEW_W / 2 - 80} y="30" width="160" height="6" fill="#3a4a6e" />
          {/* Modules */}
          <rect x={VIEW_W / 2 - 20} y="22" width="40" height="22" rx="6" fill="#5a7fbf" stroke="#7a98d8" strokeWidth="0.8" />
          <rect x={VIEW_W / 2 - 50} y="38" width="22" height="14" rx="4" fill="#3a4a6e" stroke="#5a7fbf" strokeWidth="0.5" />
          <rect x={VIEW_W / 2 + 28} y="38" width="22" height="14" rx="4" fill="#3a4a6e" stroke="#5a7fbf" strokeWidth="0.5" />
          {/* Solar panels */}
          <rect x={VIEW_W / 2 - 130} y="26" width="46" height="16" fill="#1a3a5a" stroke="#5a7fbf" strokeWidth="0.5" />
          <rect x={VIEW_W / 2 + 84} y="26" width="46" height="16" fill="#1a3a5a" stroke="#5a7fbf" strokeWidth="0.5" />
          {/* Panel grid */}
          {[0, 1, 2, 3].map((i) => (
            <line key={`pl-${i}`} x1={VIEW_W / 2 - 130 + i * 12} y1="26" x2={VIEW_W / 2 - 130 + i * 12} y2="42" stroke="#5a7fbf" strokeWidth="0.3" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`pr-${i}`} x1={VIEW_W / 2 + 84 + i * 12} y1="26" x2={VIEW_W / 2 + 84 + i * 12} y2="42" stroke="#5a7fbf" strokeWidth="0.3" />
          ))}
          <text x={VIEW_W / 2} y={16} fill="#8a8fa3" fontSize={9} textAnchor="middle" letterSpacing="0.1em" fontWeight="600">
            ISS
          </text>
        </g>

        {/* Recovery boat (bottom) */}
        {stage.boat && (
          <g className="rj-fade-in" style={{ animationDelay: "0.2s" }}>
            <rect
              x={VIEW_W / 2 - 90}
              y={VIEW_H * 0.85 - 18}
              width="50"
              height="14"
              rx="2"
              fill="#5a7fbf"
              stroke="#7a98d8"
              strokeWidth="0.5"
            />
            <polygon
              points={`${VIEW_W / 2 - 90},${VIEW_H * 0.85 - 4} ${VIEW_W / 2 - 40},${VIEW_H * 0.85 - 4} ${VIEW_W / 2 - 47},${VIEW_H * 0.85 + 2} ${VIEW_W / 2 - 83},${VIEW_H * 0.85 + 2}`}
              fill="#3a4a6e"
            />
            <rect x={VIEW_W / 2 - 70} y={VIEW_H * 0.85 - 24} width="14" height="8" fill="#7a98d8" />
            <text x={VIEW_W / 2 - 65} y={VIEW_H * 0.85 - 28} fill="#8a8fa3" fontSize="9" textAnchor="middle" letterSpacing="0.1em" fontWeight="600">
              RECOVERY
            </text>
          </g>
        )}

        {/* Lab arrow off-frame */}
        {stage.labArrow && (
          <g className="rj-fade-in">
            <line
              x1={VIEW_W / 2 + 20}
              y1={VIEW_H - 22}
              x2={VIEW_W - 40}
              y2={VIEW_H - 22}
              stroke="#a3e4c4"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <polygon
              points={`${VIEW_W - 40},${VIEW_H - 27} ${VIEW_W - 24},${VIEW_H - 22} ${VIEW_W - 40},${VIEW_H - 17}`}
              fill="#a3e4c4"
            />
            <text
              x={VIEW_W - 64}
              y={VIEW_H - 34}
              fill="#a3e4c4"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.1em"
              textAnchor="end"
            >
              TO LAB →
            </text>
          </g>
        )}

        {/* Splash effect */}
        {stage.splash && (
          <g className="rj-splash">
            {[-20, -10, 0, 10, 20].map((dx, i) => (
              <line
                key={`splash-${i}`}
                x1={capsuleX + dx}
                y1={VIEW_H * 0.85 - 2}
                x2={capsuleX + dx * 2}
                y2={VIEW_H * 0.85 - 18}
                stroke="#a3b6e0"
                strokeWidth="1.2"
                opacity="0.7"
              >
                <animate
                  attributeName="opacity"
                  values="0;0.8;0"
                  dur="1.5s"
                  begin={`${i * 0.05}s`}
                  fill="freeze"
                />
              </line>
            ))}
            <ellipse
              cx={capsuleX}
              cy={VIEW_H * 0.85}
              rx="40"
              ry="6"
              fill="none"
              stroke="#a3b6e0"
              strokeWidth="1.5"
              opacity="0.6"
            >
              <animate attributeName="rx" values="10;60;10" dur="1.2s" fill="freeze" />
              <animate attributeName="opacity" values="0.8;0;0" dur="1.2s" fill="freeze" />
            </ellipse>
          </g>
        )}

        {/* Parachute */}
        {stage.parachute && (
          <g className="rj-fade-in" style={{ transform: `translate(${capsuleX}px, ${capsuleY - 50}px)` }}>
            <path
              d="M -40 0 Q -40 -28 0 -32 Q 40 -28 40 0 Z"
              fill="#e85a3d"
              stroke="#a83e26"
              strokeWidth="1"
            />
            <path
              d="M -20 0 Q -20 -28 0 -32 Q 20 -28 20 0"
              fill="#ffffff"
              opacity="0.9"
              stroke="#a83e26"
              strokeWidth="0.6"
            />
            <line x1="-30" y1="-2" x2="-4" y2="14" stroke="#3a4a6e" strokeWidth="0.6" />
            <line x1="0" y1="-2" x2="0" y2="14" stroke="#3a4a6e" strokeWidth="0.6" />
            <line x1="30" y1="-2" x2="4" y2="14" stroke="#3a4a6e" strokeWidth="0.6" />
          </g>
        )}

        {/* Capsule */}
        <g
          style={{
            transform: `translate(${capsuleX}px, ${capsuleY}px) scale(${stage.capsuleScale})`,
            transformOrigin: "center",
            transition: "transform 1.4s cubic-bezier(0.42, 0, 0.58, 1)",
          }}
        >
          {/* Plasma sheath */}
          {stage.plasma && (
            <ellipse cx="0" cy="14" rx="38" ry="22" fill="url(#rj-plasma)">
              <animate attributeName="opacity" values="0.85;1;0.85" dur="0.6s" repeatCount="indefinite" />
            </ellipse>
          )}
          {/* Capsule body — Dragon-like */}
          <path
            d="M -18 -14 L 18 -14 L 22 18 L -22 18 Z"
            fill="#c5c8d4"
            stroke="#7a98d8"
            strokeWidth="0.8"
          />
          <rect x="-14" y="-10" width="28" height="6" rx="2" fill="#11141d" stroke="#3a4a6e" strokeWidth="0.4" />
          {/* Heat shield */}
          <path d="M -22 18 L 22 18 L 18 22 L -18 22 Z" fill="#5a3a2a" stroke="#a83e26" strokeWidth="0.6" />
        </g>

        {/* Status indicator — persistent "cells locked" badge */}
        <g transform={`translate(14 ${stepIdx === 0 ? 90 : 60})`}>
          <rect
            x="0"
            y="-10"
            width="146"
            height="22"
            rx="11"
            fill="rgba(163, 228, 196, 0.14)"
            stroke="#5fbf8c"
            strokeWidth="1"
          />
          <circle cx="14" cy="1" r="3.5" fill="#a3e4c4">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="24" y="5" fill="#a3e4c4" fontSize="10" fontWeight="600" letterSpacing="0.04em">
            cells: locked since U-2
          </text>
        </g>
      </svg>

      <div className="rjourney__caption">
        <div className="rjourney__stage-label">{stage.label}</div>
        <p className="rjourney__stage-detail">{stage.detail}</p>
      </div>
      </div>

      <div className="rjourney__controls">
        <div className="rjourney__nav">
          <button type="button" className="rjourney__btn" onClick={back} disabled={isFirst}>
            ← Back
          </button>
          <button type="button" className="rjourney__btn rjourney__btn--primary" onClick={next} disabled={isLast}>
            Next →
          </button>
          <button type="button" className="rjourney__btn" onClick={togglePlay}>
            {playing ? "Pause" : isLast ? "Replay" : "Play journey"}
          </button>
          {!isFirst && (
            <button type="button" className="rjourney__btn rjourney__btn--ghost" onClick={reset}>
              Reset
            </button>
          )}
        </div>
        <div className="rjourney__progress" aria-hidden="true">
          {STAGES.map((_, i) => (
            <span key={i} className={`rjourney__dot ${i <= stepIdx ? "rjourney__dot--on" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
