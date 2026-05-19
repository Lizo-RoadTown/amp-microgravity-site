import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "dropping" | "captured";

export function AmpCaptureDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [captureCount, setCaptureCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const release = () => {
    if (phase !== "idle") return;
    setPhase("dropping");
    timeoutRef.current = window.setTimeout(() => {
      setPhase("captured");
      setCaptureCount((c) => c + 1);
    }, 2200);
  };

  const reset = () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setPhase("idle");
  };

  return (
    <div className="amp-demo">
      <svg
        viewBox="0 0 600 360"
        className="amp-demo__svg"
        role="img"
        aria-label="Interactive demonstration of an antimicrobial peptide capturing a bacterium through electrostatic attraction."
      >
        <defs>
          <linearGradient id="amp-chip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a98d8" />
            <stop offset="100%" stopColor="#2c3447" />
          </linearGradient>
          <radialGradient id="amp-bacterium-grad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="amp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sky / fluid background suggestion */}
        <rect x="0" y="0" width="600" height="360" fill="transparent" />

        {/* Attraction field lines — only visible during drop */}
        {phase === "dropping" && (
          <g className="amp-demo__field">
            {[200, 260, 300, 340, 400].map((x, i) => (
              <path
                key={`field-${i}`}
                d={`M ${x} 260 Q ${300} ${200 - i * 5} ${x} 70`}
                fill="none"
                stroke="#5a7fbf"
                strokeWidth="0.8"
                opacity="0.35"
                strokeDasharray="3 4"
              />
            ))}
          </g>
        )}

        {/* AMP capture layer — at the bottom */}
        <g>
          <rect x="40" y="296" width="520" height="14" rx="3" fill="url(#amp-chip)" />
          <rect x="40" y="296" width="520" height="2" fill="#a3b6e0" opacity="0.7" />
          {/* AMP peptides */}
          {[110, 175, 240, 300, 360, 425, 490].map((x, i) => (
            <g key={`amp-${i}`}>
              <rect
                x={x - 4}
                y={236}
                width={8}
                height={60}
                rx={4}
                fill="#c5d4ff"
                stroke="#7a98d8"
                strokeWidth="0.8"
              />
              {/* Positive charge symbol on each AMP */}
              <circle cx={x} cy={230} r={9} fill="#5a7fbf" />
              <text
                x={x}
                y={234}
                fill="#ffffff"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                +
              </text>
            </g>
          ))}
          <text
            x={300}
            y={336}
            fill="#6e7388"
            fontSize="10"
            textAnchor="middle"
            letterSpacing="0.16em"
            fontWeight="600"
          >
            AMP-COATED CHIP · POSITIVE CHARGES
          </text>
        </g>

        {/* Bacterium */}
        <g
          className={`amp-demo__bact amp-demo__bact--${phase}`}
          aria-hidden="true"
        >
          <ellipse
            cx={300}
            cy={70}
            rx={36}
            ry={20}
            fill="#c5d4ff"
            stroke="#5a7fbf"
            strokeWidth="1.5"
            filter={phase === "captured" ? "url(#amp-glow)" : undefined}
          />
          <ellipse
            cx={300}
            cy={64}
            rx={28}
            ry={10}
            fill="url(#amp-bacterium-grad)"
          />
          {/* Negative charge badges around the bacterium */}
          {[
            { dx: -28, dy: -10 },
            { dx: 28, dy: -10 },
            { dx: -22, dy: 14 },
            { dx: 22, dy: 14 },
            { dx: 0, dy: -22 },
            { dx: 0, dy: 22 },
          ].map(({ dx, dy }, i) => (
            <g key={`neg-${i}`}>
              <circle cx={300 + dx} cy={70 + dy} r={7} fill="#c47a8a" />
              <text
                x={300 + dx}
                y={74 + dy}
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                –
              </text>
            </g>
          ))}
          <text
            x={300}
            y={42}
            fill="#9aa0b4"
            fontSize="10"
            textAnchor="middle"
            letterSpacing="0.14em"
            fontWeight="600"
          >
            E. COLI · NEGATIVE CHARGES
          </text>
        </g>

        {/* Inline status text inside the SVG — keeps the reading eye on the visual */}
        <g aria-hidden="true">
          {phase === "idle" && (
            <text
              x={300}
              y={185}
              fill="#9aa0b4"
              fontSize="13"
              textAnchor="middle"
              fontStyle="italic"
            >
              Click "Release" to drop a bacterium.
            </text>
          )}
          {phase === "dropping" && (
            <text
              x={300}
              y={185}
              fill="#7a98d8"
              fontSize="13"
              textAnchor="middle"
              fontWeight="600"
            >
              + AMPs pull on – charges…
            </text>
          )}
          {phase === "captured" && (
            <text
              x={300}
              y={195}
              fill="#a3e4c4"
              fontSize="13"
              textAnchor="middle"
              fontWeight="700"
              letterSpacing="0.04em"
            >
              Stuck. Opposite charges attract.
            </text>
          )}
        </g>

        {/* Capture flash — only visible briefly when captured */}
        {phase === "captured" && (
          <g className="amp-demo__flash">
            {[110, 175, 240, 300, 360, 425, 490].map((x, i) => (
              <circle
                key={`flash-${i}`}
                cx={x}
                cy={230}
                r={14}
                fill="none"
                stroke="#a3e4c4"
                strokeWidth="2"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  values="6;22;6"
                  dur="0.9s"
                  begin={`${i * 0.04}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.8;0"
                  dur="0.9s"
                  begin={`${i * 0.04}s`}
                  fill="freeze"
                />
              </circle>
            ))}
          </g>
        )}
      </svg>

      <div className="amp-demo__controls">
        <div className="amp-demo__buttons">
          {phase !== "idle" ? (
            <button
              type="button"
              className="amp-demo__btn"
              onClick={reset}
              disabled={phase === "dropping"}
            >
              Reset
            </button>
          ) : (
            <button type="button" className="amp-demo__btn amp-demo__btn--primary" onClick={release}>
              Release bacterium
            </button>
          )}
          {captureCount > 0 && (
            <span className="amp-demo__counter">
              Captured: <strong>{captureCount}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
