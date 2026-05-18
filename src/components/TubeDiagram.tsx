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

export function TubeDiagram() {
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

  // Scale comparison: bars below the tube, left-aligned, same cm-scale
  const compY = 230;
  const compRowH = 26;
  const items = [
    { cm: 29, label: "RhFET-01 tube", note: "29 cm", color: "#5a7fbf" },
    { cm: 19, label: "Standard pencil", note: "≈ 19 cm", color: "#8a8fa3" },
    { cm: 11, label: "Adult index finger", note: "≈ 11 cm", color: "#8a8fa3" },
    { cm: 4.4, label: "AA battery", note: "≈ 4.4 cm", color: "#8a8fa3" },
  ];

  return (
    <svg
      viewBox="0 0 800 380"
      className="tube-diagram"
      role="img"
      aria-labelledby="tubeTitle tubeDesc"
    >
      <title id="tubeTitle">Rhodium RhFET-01 mini-laboratory tube</title>
      <desc id="tubeDesc">
        Cross-section of the experiment tube with three chambers and two crew-operated
        valves. Chamber 1 (5 cm) holds freeze-dried E. coli. Chamber 2 (13 cm) holds six
        AMP chips immersed in PBS with BS3 crosslinker. Chamber 3 (5 cm) holds 10%
        neutral-buffered formalin. Total length 29 cm, outer diameter 12 mm.
        Below: scale comparison with common objects.
      </desc>

      <defs>
        <linearGradient id="tubeBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1d28" />
          <stop offset="50%" stopColor="#11141d" />
          <stop offset="100%" stopColor="#1a1d28" />
        </linearGradient>
      </defs>

      {/* End caps */}
      <ellipse cx={capL.x + capL.w / 2} cy={TUBE_Y + TUBE_HEIGHT / 2} rx={capL.w / 2 + 2} ry={TUBE_HEIGHT / 2 + 1} fill="#2a2f3e" stroke="#3a4a6e" />
      <ellipse cx={capR.x + capR.w / 2} cy={TUBE_Y + TUBE_HEIGHT / 2} rx={capR.w / 2 + 2} ry={TUBE_HEIGHT / 2 + 1} fill="#2a2f3e" stroke="#3a4a6e" />

      {/* Tube body */}
      <rect x={c1.x} y={TUBE_Y} width={c3.x + c3.w - c1.x} height={TUBE_HEIGHT} fill="url(#tubeBody)" stroke="#3a4a6e" />

      {/* Chamber 1 — freeze-dried E. coli (pale dots) */}
      <g>
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

      {/* Valve A */}
      <rect x={vA.x} y={TUBE_Y - 6} width={vA.w} height={TUBE_HEIGHT + 12} fill="#0a0d14" stroke="#5a7fbf" />
      <circle cx={vA.x + vA.w / 2} cy={TUBE_Y + TUBE_HEIGHT / 2} r={9} fill="#3a4a6e" stroke="#5a7fbf" />
      <text x={vA.x + vA.w / 2} y={TUBE_Y + TUBE_HEIGHT / 2 + 3} fill="#c5d4ff" fontSize={10} textAnchor="middle" fontWeight="bold">A</text>

      {/* Chamber 2 — chips in solution (small chip squares + droplet shading) */}
      <rect x={c2.x + 2} y={TUBE_Y + 6} width={c2.w - 4} height={TUBE_HEIGHT - 12} fill="#1a3a5a" opacity={0.45} />
      {Array.from({ length: 6 }).map((_, i) => {
        const x = c2.x + 16 + i * ((c2.w - 32) / 5);
        const y = TUBE_Y + (i % 2 === 0 ? 18 : 32);
        return <rect key={i} x={x} y={y} width={8} height={8} fill="#5a7fbf" stroke="#7a98d8" strokeWidth={0.6} />;
      })}

      {/* Valve B */}
      <rect x={vB.x} y={TUBE_Y - 6} width={vB.w} height={TUBE_HEIGHT + 12} fill="#0a0d14" stroke="#5a7fbf" />
      <circle cx={vB.x + vB.w / 2} cy={TUBE_Y + TUBE_HEIGHT / 2} r={9} fill="#3a4a6e" stroke="#5a7fbf" />
      <text x={vB.x + vB.w / 2} y={TUBE_Y + TUBE_HEIGHT / 2 + 3} fill="#c5d4ff" fontSize={10} textAnchor="middle" fontWeight="bold">B</text>

      {/* Chamber 3 — formalin (warm tint) */}
      <rect x={c3.x + 2} y={TUBE_Y + 6} width={c3.w - 4} height={TUBE_HEIGHT - 12} fill="#5a4a2a" opacity={0.35} />

      {/* Chamber content labels (above tube) */}
      <text x={c1.x + c1.w / 2} y={TUBE_Y - 14} fill="#c5c8d4" fontSize={11} textAnchor="middle">freeze-dried E. coli</text>
      <text x={c2.x + c2.w / 2} y={TUBE_Y - 14} fill="#c5c8d4" fontSize={11} textAnchor="middle">6 AMP chips in PBS / BS3</text>
      <text x={c3.x + c3.w / 2} y={TUBE_Y - 14} fill="#c5c8d4" fontSize={11} textAnchor="middle">formalin</text>

      {/* Chamber dimension labels (below tube) */}
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

      {/* Total length bracket below */}
      <line x1={tubeLeft} y1={TUBE_Y + TUBE_HEIGHT + 42} x2={tubeRight} y2={TUBE_Y + TUBE_HEIGHT + 42} stroke="#5a7fbf" strokeWidth={1} />
      <line x1={tubeLeft} y1={TUBE_Y + TUBE_HEIGHT + 38} x2={tubeLeft} y2={TUBE_Y + TUBE_HEIGHT + 46} stroke="#5a7fbf" />
      <line x1={tubeRight} y1={TUBE_Y + TUBE_HEIGHT + 38} x2={tubeRight} y2={TUBE_Y + TUBE_HEIGHT + 46} stroke="#5a7fbf" />
      <text x={(tubeLeft + tubeRight) / 2} y={TUBE_Y + TUBE_HEIGHT + 58} fill="#c5d4ff" fontSize={12} textAnchor="middle" fontWeight="500">
        29 cm total · 12 mm outer diameter · 20 mL total fluid
      </text>

      {/* Scale comparison heading */}
      <text x={tubeLeft} y={compY - 14} fill="#c5c8d4" fontSize={12} fontWeight="600">For scale</text>

      {/* Scale comparison bars */}
      {items.map((it, i) => {
        const w = it.cm * CM_TO_PX;
        const y = compY + i * compRowH;
        return (
          <g key={it.label}>
            <rect x={tubeLeft} y={y} width={w} height={14} rx={2} fill={it.color} opacity={i === 0 ? 1 : 0.55} />
            <text x={tubeLeft + w + 8} y={y + 11} fill="#c5c8d4" fontSize={11}>
              {it.label}
            </text>
            <text x={tubeLeft + w + 8} y={y + 11} dx={it.label.length * 6 + 16} fill="#6e7388" fontSize={11}>
              {it.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
