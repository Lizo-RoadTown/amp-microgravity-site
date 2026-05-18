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

export function ElisaDiagram() {
  return (
    <svg
      viewBox="-60 0 880 480"
      className="elisa-diagram"
      role="img"
      aria-labelledby="elisaTitle elisaDesc"
    >
      <title id="elisaTitle">Sandwich ELISA detection on the AMP capture chip</title>
      <desc id="elisaDesc">
        Cross-section of the post-flight sandwich ELISA. A captured E. coli cell sits on an
        AMP-coated chip. A primary anti–E. coli antibody binds the cell. A secondary
        antibody linked to horseradish peroxidase (HRP) binds the primary antibody. The
        enzyme converts TMB substrate into a blue product. Optical density at 450 nm,
        compared against a standard curve, gives bacterial surface density in cells per
        square centimeter.
      </desc>

      <defs>
        <linearGradient id="elisaCellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dde6ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#9ab3e8" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="colorCloud" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#5a7fbf" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5a7fbf" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Chip + AMP base layer (minimal — referenced as continuation of chip-stack) */}
      <rect x={60} y={400} width={460} height={26} fill="#1f2230" stroke="#3a4a6e" />
      <text x={60} y={444} fill="#6e7388" fontSize={11}>
        AMP-functionalized chip surface
      </text>

      {/* AMP capture columns — simplified */}
      {[110, 170, 230, 290, 350, 410, 470].map((x) => (
        <g key={`amp-${x}`}>
          <rect x={x - 4} y={365} width={8} height={35} rx={4} fill="#c5d4ff" />
        </g>
      ))}

      {/* Captured E. coli cell sitting on the AMPs */}
      <ellipse cx={290} cy={335} rx={70} ry={28} fill="url(#elisaCellGrad)" stroke="#5a7fbf" strokeWidth={1.5} />
      <g className="elisa-label">
        <line x1={360} y1={335} x2={600} y2={335} stroke="#3a4a6e" strokeWidth={1} />
        <text x={608} y={330} fill="#c5c8d4" fontSize={14}>
          Captured E. coli
        </text>
        <text x={608} y={346} fill="#6e7388" fontSize={11}>
          fixed in formalin during return
        </text>
      </g>

      {/* Primary antibodies — bound to cell surface */}
      <Antibody cx={245} cy={310} color="#a3e4c4" rotate={-15} />
      <Antibody cx={290} cy={302} color="#a3e4c4" rotate={0} />
      <Antibody cx={335} cy={310} color="#a3e4c4" rotate={15} />
      <g className="elisa-label">
        <line x1={220} y1={285} x2={120} y2={250} stroke="#3a4a6e" strokeWidth={1} />
        <text x={112} y={246} fill="#c5c8d4" fontSize={14} textAnchor="end">
          Primary antibody
        </text>
        <text x={112} y={262} fill="#6e7388" fontSize={11} textAnchor="end">
          binds E. coli surface antigens
        </text>
      </g>

      {/* Secondary antibodies with HRP enzyme — bound to primary */}
      <Antibody cx={245} cy={240} color="#e8a3c4" hrp rotate={-15} />
      <Antibody cx={290} cy={232} color="#e8a3c4" hrp rotate={0} />
      <Antibody cx={335} cy={240} color="#e8a3c4" hrp rotate={15} />
      <g className="elisa-label">
        <line x1={360} y1={220} x2={600} y2={210} stroke="#3a4a6e" strokeWidth={1} />
        <text x={608} y={206} fill="#c5c8d4" fontSize={14}>
          HRP-linked secondary antibody
        </text>
        <text x={608} y={222} fill="#6e7388" fontSize={11}>
          enzyme converts substrate to color
        </text>
      </g>

      {/* Color development cloud — above the stack */}
      <ellipse cx={290} cy={150} rx={170} ry={55} fill="url(#colorCloud)" />
      <g className="elisa-label">
        <line x1={120} y1={150} x2={40} y2={150} stroke="#3a4a6e" strokeWidth={1} />
        <text x={32} y={146} fill="#c5c8d4" fontSize={14} textAnchor="end">
          TMB → blue product
        </text>
        <text x={32} y={162} fill="#6e7388" fontSize={11} textAnchor="end">
          intensity scales with bound enzyme
        </text>
      </g>

      {/* Readout panel — bracket and arrow on the right */}
      <g transform="translate(640 100)">
        {/* Well showing color */}
        <ellipse cx={50} cy={30} rx={42} ry={12} fill="#0a0d14" stroke="#3a4a6e" strokeWidth={1} />
        <ellipse cx={50} cy={32} rx={40} ry={10} fill="#5a7fbf" opacity={0.7} />
        <text x={50} y={66} fill="#c5c8d4" fontSize={12} textAnchor="middle">
          OD₄₅₀ = 0.842
        </text>

        {/* Arrow down */}
        <line x1={50} y1={84} x2={50} y2={120} stroke="#5a7fbf" strokeDasharray="3 3" strokeWidth={1.2} />
        <polygon points="44,114 50,128 56,114" fill="#5a7fbf" />

        {/* Result */}
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

      {/* Caption */}
      <text x={340} y={470} fill="#6e7388" fontSize={11} textAnchor="middle">
        Post-flight readout — performed in the lab after chips return to Earth, not on orbit.
      </text>
    </svg>
  );
}
