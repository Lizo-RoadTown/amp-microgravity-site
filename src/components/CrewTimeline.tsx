type Event = {
  day: string;
  label: string;
  detail?: string;
  highlight?: boolean;
};

const EVENTS: Event[] = [
  { day: "Launch", label: "Launch", detail: "tube boards the resupply vehicle" },
  { day: "U-14", label: "Arrival", detail: "tube reaches ISS, stowed" },
  { day: "U-5", label: "Valve A", detail: "open + shake 15 sec — bacteria rehydrate, reach chips", highlight: true },
  { day: "U-2", label: "Valve B", detail: "open + shake 15 sec — formalin floods, cells fixed", highlight: true },
  { day: "U-0", label: "Undock", detail: "capsule departs ISS" },
  { day: "Splash", label: "Recovery", detail: "tube returns to lab for ELISA" },
];

const VIEW_W = 800;
const VIEW_H = 280;
const TIMELINE_Y = 110;
const PAD_X = 60;

export function CrewTimeline() {
  const n = EVENTS.length;
  const spanW = VIEW_W - PAD_X * 2;
  const stepW = spanW / (n - 1);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="crew-timeline"
      role="img"
      aria-labelledby="crewTimelineTitle crewTimelineDesc"
    >
      <title id="crewTimelineTitle">Crew interaction timeline</title>
      <desc id="crewTimelineDesc">
        Schedule of crew interactions with the experiment. Across roughly six weeks on
        the ISS, astronaut involvement consists of opening two valves on two separate
        days, with a 15-second shake each time. Total active crew interaction is about
        30 seconds.
      </desc>

      {/* Spine */}
      <line x1={PAD_X} y1={TIMELINE_Y} x2={VIEW_W - PAD_X} y2={TIMELINE_Y} stroke="#3a4a6e" strokeWidth={2} />

      {EVENTS.map((e, i) => {
        const x = PAD_X + i * stepW;
        const isHighlight = e.highlight ?? false;
        return (
          <g key={e.day}>
            {/* Tick */}
            <circle
              cx={x}
              cy={TIMELINE_Y}
              r={isHighlight ? 10 : 5}
              fill={isHighlight ? "#a3e4c4" : "#5a7fbf"}
              stroke={isHighlight ? "#5fbf8c" : "#3a4a6e"}
              strokeWidth={isHighlight ? 1.5 : 1}
            />
            {/* Day label (above) */}
            <text x={x} y={TIMELINE_Y - 22} fill={isHighlight ? "#a3e4c4" : "#c5c8d4"} fontSize={12} textAnchor="middle" fontWeight={isHighlight ? "600" : "400"}>
              {e.day}
            </text>
            {/* Event label (below) */}
            <text x={x} y={TIMELINE_Y + 28} fill="#c5c8d4" fontSize={12} textAnchor="middle" fontWeight={isHighlight ? "600" : "400"}>
              {e.label}
            </text>
            {/* Detail (smaller, multi-line via tspan if needed) */}
            {e.detail && (
              <text x={x} y={TIMELINE_Y + 46} fill="#6e7388" fontSize={10} textAnchor="middle">
                {e.detail.length > 38 ? (
                  <>
                    <tspan x={x} dy={0}>{splitLines(e.detail)[0]}</tspan>
                    <tspan x={x} dy={12}>{splitLines(e.detail)[1]}</tspan>
                  </>
                ) : (
                  e.detail
                )}
              </text>
            )}
          </g>
        );
      })}

      {/* Total interaction callout */}
      <g transform={`translate(${VIEW_W / 2} ${VIEW_H - 36})`}>
        <text x={0} y={0} fill="#c5d4ff" fontSize={14} textAnchor="middle" fontWeight="600">
          Total active crew time: ≈ 30 seconds across two days
        </text>
        <text x={0} y={18} fill="#6e7388" fontSize={11} textAnchor="middle">
          Everything else happens passively — the chemistry runs on its own.
        </text>
      </g>
    </svg>
  );
}

function splitLines(s: string): [string, string] {
  const mid = Math.floor(s.length / 2);
  const left = s.lastIndexOf(" ", mid);
  const right = s.indexOf(" ", mid);
  const cut = mid - left < right - mid ? left : right;
  if (cut < 0) return [s, ""];
  return [s.slice(0, cut), s.slice(cut + 1)];
}
