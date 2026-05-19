import { useState } from "react";

interface TimelineEvent {
  id: string;
  day: string;
  label: string;
  whatHappens: string;
  decision?: { headline: string; detail: string };
  highlight?: boolean;
}

const EVENTS: TimelineEvent[] = [
  {
    id: "launch",
    day: "L+0",
    label: "Launch",
    whatHappens:
      "Our tube rides up on a resupply mission (Cargo Dragon, Cygnus, etc.) from Cape Canaveral or Wallops. Inside, the bacteria are freeze-dried — alive but dormant.",
    decision: {
      headline: "Why we freeze-dried the bacteria",
      detail:
        "Bacteria don't sit still. If we'd just packed living E. coli onto a rocket, they'd be growing, dividing, and sticking to surfaces the whole way up. The experiment would be over before it started. Freeze-drying puts them in suspended animation — they only wake up when crew adds water on orbit.",
    },
  },
  {
    id: "transit",
    day: "L → ISS",
    label: "In transit",
    whatHappens:
      "The resupply capsule takes anywhere from about 6 hours to 3 days to reach the ISS, depending on the launch profile. The tube stays at ambient temperature the whole time.",
    decision: {
      headline: "Why no refrigeration",
      detail:
        "Freeze-dried bacteria, dry sterile chips, and sealed formalin are all stable at room temperature for weeks. Skipping cold-chain means our experiment is compatible with any flight schedule and any cargo bay slot.",
    },
  },
  {
    id: "stow",
    day: "U-14",
    label: "Stowed on ISS",
    whatHappens:
      "Tube arrives at the ISS and is stowed in the experiment bay until it's time. The wait can be days or even weeks before the first crew interaction.",
    decision: {
      headline: "Why we designed for variable wait time",
      detail:
        "We can't control when our experiment gets activated — it depends on crew schedule. The bacteria need to stay dormant the whole time, so our chambers keep the dry samples completely sealed from the buffer and the formalin until valves are opened.",
    },
  },
  {
    id: "valve-a",
    day: "U-5",
    label: "Valve A opens",
    whatHappens:
      "Five days before the capsule undocks from the ISS, crew opens Valve A and gently shakes the tube for 15 seconds. The buffer solution mixes with the freeze-dried bacteria — they rehydrate, wake up, and start moving toward the chips.",
    decision: {
      headline: "Why five days before undocking",
      detail:
        "Bacterial capture on a chip takes time — long enough for cells to reach the surface and for AMP binding to saturate, but short enough that biofilm overgrowth doesn't take over. About three days is the practical sweet spot from the literature.",
    },
    highlight: true,
  },
  {
    id: "valve-b",
    day: "U-2",
    label: "Valve B opens",
    whatHappens:
      "Two days before undocking, crew opens Valve B and shakes again for 15 seconds. Formalin floods the chip chamber and chemically locks every bound cell in place.",
    decision: {
      headline: "Why we fix on orbit",
      detail:
        "Any motion or temperature change during reentry could move cells around or shake them off the chip. Formalin crosslinks the proteins where they sit, so whatever state the chips reach on orbit is exactly what comes home.",
    },
    highlight: true,
  },
  {
    id: "undock",
    day: "U-0",
    label: "Undocking",
    whatHappens:
      "The capsule departs the ISS and begins atmospheric reentry. Our tube is sealed inside the cargo bay.",
  },
  {
    id: "splash",
    day: "Splashdown",
    label: "Recovery",
    whatHappens:
      "Capsule splashes down (Florida or Pacific depending on the vehicle). Recovery teams pull the cargo. Eventually the tube reaches our lab — and then the real measurement starts.",
    decision: {
      headline: "Why we do the counting on Earth",
      detail:
        "A sandwich ELISA needs precise reagent handling and a spectrophotometer that's bench-bound. Running it on orbit would need flight-qualified hardware and crew time we don't have. Fixing on orbit + counting on Earth gives us the best of both: the result is locked in space, but read out where we have proper instruments.",
    },
  },
];

const VIEW_W = 800;
const VIEW_H = 200;
const TIMELINE_Y = 90;
const PAD_X = 60;

export function MissionTimeline() {
  const [selectedId, setSelectedId] = useState<string>(EVENTS[0].id);

  const selected = EVENTS.find((e) => e.id === selectedId) ?? EVENTS[0];

  const n = EVENTS.length;
  const spanW = VIEW_W - PAD_X * 2;
  const stepW = spanW / (n - 1);

  return (
    <div className="mission-timeline">
      <p className="mission-timeline__crew-callout">
        <strong>Total active crew time across the whole mission:</strong>{" "}
        approximately 30 seconds across two days. Everything else is passive
        chemistry running on its own.
      </p>

      {selected.decision && (
        <details className="mission-timeline__decision mission-timeline__decision--above">
          <summary>{selected.decision.headline}</summary>
          <p className="mission-timeline__decision-detail">
            {selected.decision.detail}
          </p>
        </details>
      )}

      <div className="mission-timeline__overlay">
        <div className="mission-timeline__overlay-head">
          <span className="mission-timeline__overlay-day">{selected.day}</span>
          <span className="mission-timeline__overlay-label">{selected.label}</span>
        </div>
        <p className="mission-timeline__overlay-what">{selected.whatHappens}</p>
      </div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mission-timeline__svg"
        role="img"
        aria-label="Mission timeline from launch to splashdown."
      >
        <line
          x1={PAD_X}
          y1={TIMELINE_Y}
          x2={VIEW_W - PAD_X}
          y2={TIMELINE_Y}
          stroke="#3a4a6e"
          strokeWidth="2"
        />

        {EVENTS.map((e, i) => {
          const x = PAD_X + i * stepW;
          const isSelected = e.id === selectedId;
          const isHighlight = e.highlight ?? false;
          return (
            <g
              key={e.id}
              className={`mt-event ${isSelected ? "mt-event--selected" : ""}`}
              onClick={() => setSelectedId(e.id)}
              style={{ cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-label={`${e.day} — ${e.label}`}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  setSelectedId(e.id);
                }
              }}
            >
              {/* Hit target — invisible, generous */}
              <rect
                x={x - 30}
                y={TIMELINE_Y - 50}
                width={60}
                height={100}
                fill="transparent"
              />

              {/* Day label above */}
              <text
                x={x}
                y={TIMELINE_Y - 32}
                fill={isSelected ? "#c5d4ff" : isHighlight ? "#a3e4c4" : "#8a8fa3"}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                letterSpacing="0.04em"
              >
                {e.day}
              </text>

              {/* Dot */}
              <circle
                cx={x}
                cy={TIMELINE_Y}
                r={isSelected ? 11 : isHighlight ? 8 : 5}
                fill={
                  isSelected
                    ? "#c5d4ff"
                    : isHighlight
                    ? "#a3e4c4"
                    : "#5a7fbf"
                }
                stroke={isSelected ? "#7a98d8" : isHighlight ? "#5fbf8c" : "#3a4a6e"}
                strokeWidth={isSelected ? 2 : 1}
              />

              {/* Pulse ring when selected */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={TIMELINE_Y}
                  r={11}
                  fill="none"
                  stroke="#c5d4ff"
                  strokeWidth="1.5"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="11;19;11"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Event label below */}
              <text
                x={x}
                y={TIMELINE_Y + 28}
                fill={isSelected ? "#f5f6fa" : "#c5c8d4"}
                fontSize="12"
                fontWeight={isSelected || isHighlight ? "600" : "400"}
                textAnchor="middle"
              >
                {e.label}
              </text>
            </g>
          );
        })}
      </svg>

    </div>
  );
}
