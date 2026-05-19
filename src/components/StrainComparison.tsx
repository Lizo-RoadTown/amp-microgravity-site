import { useEffect, useRef, useState } from "react";

type StrainId = "wt" | "dfim";
type SurfaceId = "glass" | "plastic" | "amp";

interface StrainDef {
  id: StrainId;
  label: string;
  subtitle: string;
}

interface SurfaceDef {
  id: SurfaceId;
  label: string;
  hint: string;
  color: string;
}

const STRAINS: StrainDef[] = [
  { id: "wt", label: "Wild-type E. coli", subtitle: "with fimbriae" },
  { id: "dfim", label: "ΔfimA E. coli", subtitle: "no fimbriae" },
];

const SURFACES: SurfaceDef[] = [
  { id: "glass", label: "Glass", hint: "blank slide", color: "#7a98d8" },
  { id: "plastic", label: "Plastic", hint: "regular panel", color: "#8a8fa3" },
  { id: "amp", label: "AMP chip", hint: "the real thing", color: "#a3e4c4" },
];

// Outcomes — wild-type sticks to everything; ΔfimA only sticks to AMP
const OUTCOMES: Record<StrainId, Record<SurfaceId, "stuck" | "bounced">> = {
  wt: { glass: "stuck", plastic: "stuck", amp: "stuck" },
  dfim: { glass: "bounced", plastic: "bounced", amp: "stuck" },
};

function cellKey(strain: StrainId, surface: SurfaceId) {
  return `${strain}-${surface}`;
}

function CellGlyph({ kind, size = 36 }: { kind: StrainId; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const rx = size * 0.35;
  const ry = size * 0.2;
  // Wild-type has little fimbriae lines poking out around the perimeter
  const fimbriae = kind === "wt";
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
      {fimbriae &&
        Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const x1 = cx + Math.cos(angle) * rx * 0.95;
          const y1 = cy + Math.sin(angle) * ry * 0.95;
          const x2 = cx + Math.cos(angle) * (rx + 4);
          const y2 = cy + Math.sin(angle) * (ry + 4);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#c47a8a"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#c5d4ff" stroke="#5a7fbf" strokeWidth="1.2" />
      <ellipse cx={cx} cy={cy - 1} rx={rx - 4} ry={ry / 2} fill="#ffffff" opacity="0.4" />
    </svg>
  );
}

function SurfaceGlyph({ kind, size = 28 }: { kind: SurfaceId; size?: number }) {
  const w = size;
  const h = size * 0.6;
  if (kind === "amp") {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
        <rect x="0" y={h * 0.7} width={w} height={h * 0.3} rx="1" fill="#5a7fbf" />
        {[2, 6, 10, 14, 18, 22, 26].filter((x) => x < w - 1).map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={h * 0.2}
            x2={x}
            y2={h * 0.7}
            stroke="#c5d4ff"
            strokeWidth="1.2"
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <rect
        x="0"
        y="2"
        width={w}
        height={h - 4}
        rx="2"
        fill={kind === "glass" ? "#7a98d8" : "#5a5f6e"}
        opacity={kind === "glass" ? 0.45 : 0.9}
        stroke="#2c3447"
      />
    </svg>
  );
}

export function StrainComparison() {
  const [results, setResults] = useState<Record<string, "stuck" | "bounced">>({});
  const [animating, setAnimating] = useState<string | null>(null);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const runTest = (strain: StrainId, surface: SurfaceId) => {
    const key = cellKey(strain, surface);
    if (results[key] || animating) return;
    setAnimating(key);
    const id = window.setTimeout(() => {
      setResults((r) => ({ ...r, [key]: OUTCOMES[strain][surface] }));
      setAnimating(null);
    }, 1100);
    timeouts.current.push(id);
  };

  const reset = () => {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    setResults({});
    setAnimating(null);
  };

  const totalDone = Object.keys(results).length;
  const wtScore = SURFACES.filter((s) => results[cellKey("wt", s.id)] === "stuck").length;
  const wtTested = SURFACES.filter((s) => results[cellKey("wt", s.id)] !== undefined).length;
  const dfimScore = SURFACES.filter((s) => results[cellKey("dfim", s.id)] === "stuck").length;
  const dfimTested = SURFACES.filter((s) => results[cellKey("dfim", s.id)] !== undefined).length;

  return (
    <div className="strain-compare">
      <div className="strain-compare__grid" role="grid">
        <div className="strain-compare__corner" aria-hidden="true" />
        {SURFACES.map((s) => (
          <div key={s.id} className="strain-compare__surface-head" role="columnheader">
            <SurfaceGlyph kind={s.id} />
            <span className="strain-compare__surface-label">{s.label}</span>
            <span className="strain-compare__surface-hint">{s.hint}</span>
          </div>
        ))}

        {STRAINS.map((strain) => (
          <div key={strain.id} className="strain-compare__row" role="row">
            <div className="strain-compare__strain-head" role="rowheader">
              <CellGlyph kind={strain.id} />
              <div className="strain-compare__strain-labels">
                <strong>{strain.label}</strong>
                <span>{strain.subtitle}</span>
              </div>
            </div>
            {SURFACES.map((surface) => {
              const key = cellKey(strain.id, surface.id);
              const result = results[key];
              const isAnimating = animating === key;
              return (
                <button
                  key={surface.id}
                  type="button"
                  className={`strain-compare__cell ${result ? `strain-compare__cell--${result}` : ""} ${isAnimating ? "strain-compare__cell--animating" : ""}`}
                  onClick={() => runTest(strain.id, surface.id)}
                  disabled={!!result || !!animating}
                  aria-label={`Test ${strain.label} on ${surface.label}`}
                  role="gridcell"
                >
                  {!result && !isAnimating && <span className="strain-compare__placeholder">?</span>}
                  {isAnimating && (
                    <span className="strain-compare__animating-cell" aria-hidden="true">
                      <CellGlyph kind={strain.id} size={28} />
                    </span>
                  )}
                  {result === "stuck" && (
                    <span className="strain-compare__result strain-compare__result--stuck">
                      <span aria-hidden="true">✓</span> stuck
                    </span>
                  )}
                  {result === "bounced" && (
                    <span className="strain-compare__result strain-compare__result--bounced">
                      <span aria-hidden="true">✗</span> bounced off
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="strain-compare__footer">
        <div className="strain-compare__scoreboard">
          <span>
            Wild-type: <strong>{wtScore}/{wtTested || 0}</strong> stuck
          </span>
          <span>
            ΔfimA: <strong>{dfimScore}/{dfimTested || 0}</strong> stuck
          </span>
        </div>
        {totalDone === 6 && (
          <p className="strain-compare__insight">
            <em>
              That's why we picked ΔfimA. With wild-type, anything could stick to
              anything — we'd never know if a cell stuck because of the AMP or
              because it's naturally sticky. With ΔfimA, capture is only AMP-mediated.
            </em>
          </p>
        )}
        {totalDone > 0 && (
          <button type="button" className="strain-compare__reset" onClick={reset}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
