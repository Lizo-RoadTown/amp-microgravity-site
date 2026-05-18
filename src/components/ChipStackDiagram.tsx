const AMP_COLUMN_XS = [180, 260, 340, 420, 500];
const STREP_XS = [160, 240, 320, 400, 480];

export function ChipStackDiagram() {
  return (
    <svg
      viewBox="-60 0 840 520"
      className="chip-stack-diagram"
      role="img"
      aria-labelledby="chipStackTitle chipStackDesc"
    >
      <title id="chipStackTitle">AMP biosensor chip-stack exploded view</title>
      <desc id="chipStackDesc">
        Layered diagram of the antimicrobial-peptide biosensor surface. From bottom: optical
        sensor substrate, streptavidin tetramer layer, biotin–streptavidin coupling, AMP
        capture peptides (LL-37 or Magainin I), PEG backfill between AMPs that blocks
        non-specific binding, and an approaching E. coli cell (ΔfimA strain).
      </desc>

      <defs>
        <linearGradient id="cellGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dde6ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#9ab3e8" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="substrateGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#222637" />
          <stop offset="100%" stopColor="#11141d" />
        </linearGradient>
      </defs>

      {/* E. coli cell */}
      <g>
        <ellipse cx="340" cy="60" rx="56" ry="26" fill="url(#cellGradient)" stroke="#5a7fbf" strokeWidth="1.5" />
        <line x1="340" y1="90" x2="340" y2="155" stroke="#5a7fbf" strokeDasharray="4 4" strokeWidth="1.2" />
        <polygon points="334,150 340,164 346,150" fill="#5a7fbf" />
      </g>
      <g className="chip-stack-label">
        <line x1="400" y1="60" x2="540" y2="60" stroke="#3a4a6e" strokeWidth="1" />
        <text x="548" y="56" fill="#c5c8d4" fontSize="14">E. coli</text>
        <text x="548" y="72" fill="#6e7388" fontSize="11">ΔfimA strain — no fimbriae</text>
      </g>

      {/* AMP capture layer */}
      {AMP_COLUMN_XS.map((x) => (
        <g key={`amp-${x}`}>
          <rect x={x - 5} y={180} width={10} height={110} rx={5} fill="#c5d4ff" stroke="#7a98d8" strokeWidth="0.8" />
          <rect x={x - 4} y={184} width={2} height={102} rx={1} fill="#ffffff" opacity="0.25" />
        </g>
      ))}
      <g className="chip-stack-label">
        <line x1="220" y1="200" x2="120" y2="200" stroke="#3a4a6e" strokeWidth="1" />
        <text x="112" y="196" fill="#c5c8d4" fontSize="14" textAnchor="end">Antimicrobial peptide</text>
        <text x="112" y="212" fill="#6e7388" fontSize="11" textAnchor="end">LL-37 or Magainin I</text>
      </g>

      {/* PEG backfill — squiggles between AMP columns */}
      {[220, 300, 380, 460].map((x) => (
        <path
          key={`peg-${x}`}
          d={`M ${x} 285 C ${x + 8} 270, ${x - 8} 255, ${x} 240 C ${x + 8} 225, ${x - 8} 210, ${x} 195`}
          stroke="#7a8aa8"
          strokeWidth="1.4"
          fill="none"
          opacity="0.85"
        />
      ))}
      <g className="chip-stack-label">
        <line x1="540" y1="245" x2="460" y2="245" stroke="#3a4a6e" strokeWidth="1" />
        <text x="548" y="241" fill="#c5c8d4" fontSize="14">PEG backfill</text>
        <text x="548" y="257" fill="#6e7388" fontSize="11">blocks non-specific binding</text>
      </g>

      {/* Biotin head + linker */}
      {AMP_COLUMN_XS.map((x) => (
        <g key={`biotin-${x}`}>
          <line x1={x} y1={290} x2={x} y2={320} stroke="#a3e4c4" strokeWidth="2" />
          <circle cx={x} cy={295} r={6} fill="#a3e4c4" stroke="#5fbf8c" strokeWidth="0.8" />
        </g>
      ))}
      <g className="chip-stack-label">
        <line x1="220" y1="305" x2="120" y2="305" stroke="#3a4a6e" strokeWidth="1" />
        <text x="112" y="301" fill="#c5c8d4" fontSize="14" textAnchor="end">Biotin–streptavidin coupling</text>
        <text x="112" y="317" fill="#6e7388" fontSize="11" textAnchor="end">covalent linker</text>
      </g>

      {/* Streptavidin tetramer layer */}
      {STREP_XS.map((x) => (
        <g key={`strep-${x}`}>
          <rect x={x} y={320} width={40} height={32} rx={5} fill="#5a7fbf" stroke="#7a98d8" strokeWidth="0.8" />
          <line x1={x + 20} y1={320} x2={x + 20} y2={352} stroke="#3a4a6e" strokeWidth="0.6" />
          <line x1={x} y1={336} x2={x + 40} y2={336} stroke="#3a4a6e" strokeWidth="0.6" />
        </g>
      ))}
      <g className="chip-stack-label">
        <line x1="540" y1="336" x2="520" y2="336" stroke="#3a4a6e" strokeWidth="1" />
        <text x="548" y="332" fill="#c5c8d4" fontSize="14">Streptavidin tetramer</text>
        <text x="548" y="348" fill="#6e7388" fontSize="11">binds biotin with high affinity</text>
      </g>

      {/* Substrate / sensor surface */}
      <rect x="80" y="395" width="480" height="50" fill="url(#substrateGradient)" stroke="#3a4a6e" strokeWidth="1" />
      <g opacity="0.4">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={80 + i * 20}
            y1={395}
            x2={80 + i * 20}
            y2={445}
            stroke="#3a4a6e"
            strokeWidth="0.4"
          />
        ))}
      </g>
      <g className="chip-stack-label">
        <line x1="540" y1="420" x2="560" y2="420" stroke="#3a4a6e" strokeWidth="1" />
        <text x="568" y="416" fill="#c5c8d4" fontSize="14">Optical sensor surface</text>
        <text x="568" y="432" fill="#6e7388" fontSize="11">SPR, fluorescence, etc.</text>
      </g>

      {/* Caption footer */}
      <text x="340" y="490" fill="#6e7388" fontSize="11" textAnchor="middle">
        Exploded view — vertical scale is illustrative, not proportional.
      </text>
    </svg>
  );
}
