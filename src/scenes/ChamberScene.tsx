import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { ChamberShell } from "./chamber/ChamberShell";
import { BacteriaInstances } from "./chamber/BacteriaInstances";
import { SceneControls } from "./chamber/SceneControls";
import type { SceneControls as Controls } from "./chamber/types";
import { COLUMN_OFFSET_X, CHAMBER_HALF, BACTERIA_COUNT } from "./chamber/constants";

const INITIAL_CONTROLS: Controls = {
  gravity: 1,
  mechanisms: {
    sedimentation: true,
    convection: true,
    diffusion: true,
    swimming: true,
  },
};

export function ChamberScene() {
  const [controls, setControls] = useState<Controls>(INITIAL_CONTROLS);
  const [count1g, setCount1g] = useState(0);
  const [countUg, setCountUg] = useState(0);

  return (
    <div className="chamber-scene">
      <div className="chamber-canvas">
        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 6, 4]} intensity={0.9} />

          <group position={[-COLUMN_OFFSET_X, 0, 0]}>
            <ChamberShell />
            <BacteriaInstances
              controls={controls}
              columnGravity={controls.gravity}
              cellColor="#c5d4ff"
              onCountChange={setCount1g}
            />
            <Html position={[0, CHAMBER_HALF + 0.35, 0]} center distanceFactor={6}>
              <div className="chamber-label">
                <strong>1g</strong>
                <span>Earth column</span>
                <span className="chamber-label__count">
                  {count1g} / {BACTERIA_COUNT} captured
                </span>
              </div>
            </Html>
          </group>

          <group position={[COLUMN_OFFSET_X, 0, 0]}>
            <ChamberShell />
            <BacteriaInstances
              controls={controls}
              columnGravity={0}
              cellColor="#a3e4c4"
              onCountChange={setCountUg}
            />
            <Html position={[0, CHAMBER_HALF + 0.35, 0]} center distanceFactor={6}>
              <div className="chamber-label">
                <strong>µg</strong>
                <span>Microgravity column</span>
                <span className="chamber-label__count">
                  {countUg} / {BACTERIA_COUNT} captured
                </span>
              </div>
            </Html>
          </group>

          <OrbitControls enablePan={false} minDistance={3} maxDistance={12} />
        </Canvas>
      </div>
      <SceneControls value={controls} onChange={setControls} />
      <p className="chamber-caption">
        Scale break — cells are rendered ~40× their physical size and time runs
        ~50× faster so a 1g sedimentation traversal takes about 80 seconds
        instead of ~4000.
      </p>
    </div>
  );
}
