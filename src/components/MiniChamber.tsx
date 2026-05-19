import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ChamberShell } from "../scenes/chamber/ChamberShell";
import { BacteriaInstances } from "../scenes/chamber/BacteriaInstances";
import type { SceneControls as Controls } from "../scenes/chamber/types";

type MechanismKind = "sedimentation" | "convection" | "diffusion" | "swimming";

interface Props {
  mechanism: MechanismKind;
  cellColor?: string;
}

export function MiniChamber({ mechanism, cellColor = "#c5d4ff" }: Props) {
  const [gravity, setGravity] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const controls: Controls = useMemo(
    () => ({
      gravity,
      mechanisms: {
        sedimentation: mechanism === "sedimentation",
        convection: mechanism === "convection",
        diffusion: mechanism === "diffusion",
        swimming: mechanism === "swimming",
      },
    }),
    [gravity, mechanism],
  );

  return (
    <div className="mini-chamber">
      <div className="mini-chamber__canvas">
        <Canvas camera={{ position: [0, 0.4, 3.5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 3]} intensity={0.9} />
          <ChamberShell />
          <BacteriaInstances
            key={resetKey}
            controls={controls}
            columnGravity={controls.gravity}
            cellColor={cellColor}
            cellCount={80}
          />
          <OrbitControls enablePan={false} minDistance={2.5} maxDistance={6} />
        </Canvas>
      </div>
      <div className="mini-chamber__slider">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={gravity}
          onChange={(e) => setGravity(Number(e.target.value))}
          aria-label="Gravity"
        />
        <div className="mini-chamber__legend">
          <span>µg</span>
          <span className="mini-chamber__value">{gravity.toFixed(2)} g</span>
          <span>1g</span>
        </div>
      </div>
      <button
        type="button"
        className="mini-chamber__reset"
        onClick={() => setResetKey((k) => k + 1)}
      >
        ↻ Reset cells
      </button>
    </div>
  );
}
