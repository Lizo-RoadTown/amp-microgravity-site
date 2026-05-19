import { useState } from "react";

type OutcomeId = "reduced" | "equivalent";

interface OutcomeDef {
  id: OutcomeId;
  title: string;
  blurb: string;
  oneGBar: number; // 0..100
  uGBar: number;   // 0..100
  implications: string[];
  vibeClass: string;
}

const OUTCOMES: Record<OutcomeId, OutcomeDef> = {
  reduced: {
    id: "reduced",
    title: "Microgravity reduces capture",
    blurb:
      "AMP biosensors catch noticeably fewer cells in orbit than on the bench. Diffusion + swimming alone can't replace what sedimentation + convection were doing on Earth.",
    oneGBar: 88,
    uGBar: 34,
    implications: [
      "Every AMP biosensor calibrated on the bench reads the wrong number in orbit.",
      "Spacecraft biosensors need longer exposure windows.",
      "Or denser AMP surface coatings.",
      "Or recalibrated detection thresholds before they can be trusted for contamination monitoring.",
      "Not a small adjustment — a different engineering brief.",
    ],
    vibeClass: "outcome-toggle--reduced",
  },
  equivalent: {
    id: "equivalent",
    title: "Capture is statistically equivalent",
    blurb:
      "1g and µg chips end up with similar cell counts. Active bacterial swimming compensates for the missing passive transport modes.",
    oneGBar: 84,
    uGBar: 79,
    implications: [
      "Earth-tested AMP biosensor designs can probably deploy as-is.",
      "Quietly interesting in its own right: tells us active swimming contributes much more than the passive mechanisms suggest.",
      "Calibration drift between flight and ground isn't a real risk for AMP-based sensors.",
      "Frees up the engineering brief for the next problem.",
    ],
    vibeClass: "outcome-toggle--equivalent",
  },
};

export function OutcomesToggle() {
  const [selectedId, setSelectedId] = useState<OutcomeId>("reduced");
  const o = OUTCOMES[selectedId];

  return (
    <div className={`outcome-toggle ${o.vibeClass}`}>
      <div className="outcome-toggle__switch" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedId === "reduced"}
          className={
            selectedId === "reduced"
              ? "outcome-toggle__opt outcome-toggle__opt--active"
              : "outcome-toggle__opt"
          }
          onClick={() => setSelectedId("reduced")}
        >
          <span className="outcome-toggle__opt-label">If µg reduces capture</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedId === "equivalent"}
          className={
            selectedId === "equivalent"
              ? "outcome-toggle__opt outcome-toggle__opt--active"
              : "outcome-toggle__opt"
          }
          onClick={() => setSelectedId("equivalent")}
        >
          <span className="outcome-toggle__opt-label">
            If capture is equivalent
          </span>
        </button>
      </div>

      <div className="outcome-toggle__panel">
        <div className="outcome-toggle__chart" aria-hidden="true">
          <ChartBar label="1g" value={o.oneGBar} accent="primary" />
          <ChartBar label="µg" value={o.uGBar} accent="muted" />
          <div className="outcome-toggle__yaxis">
            <span>cells / cm² captured</span>
          </div>
        </div>

        <div className="outcome-toggle__story">
          <h4 className="outcome-toggle__title">{o.title}</h4>
          <p className="outcome-toggle__blurb">{o.blurb}</p>
          <h5 className="outcome-toggle__implications-head">What it would mean</h5>
          <ul className="outcome-toggle__implications">
            {o.implications.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ChartBar({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "primary" | "muted";
}) {
  return (
    <div className={`outcome-bar outcome-bar--${accent}`}>
      <div className="outcome-bar__column">
        <div
          className="outcome-bar__fill"
          style={{ height: `${value}%` }}
        >
          <span className="outcome-bar__value">{value}</span>
        </div>
      </div>
      <div className="outcome-bar__label">{label}</div>
    </div>
  );
}
