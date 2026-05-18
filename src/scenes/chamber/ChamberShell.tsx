import { CHAMBER_HALF, CHIP_TOP_Y } from "./constants";

export function ChamberShell() {
  const side = CHAMBER_HALF * 2;
  return (
    <group>
      <mesh>
        <boxGeometry args={[side, side, side]} />
        <meshBasicMaterial wireframe color="#3a4a6e" />
      </mesh>
      <mesh position={[0, CHIP_TOP_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[side * 0.8, side * 0.8]} />
        <meshStandardMaterial color="#5a7fbf" roughness={0.6} />
      </mesh>
    </group>
  );
}
