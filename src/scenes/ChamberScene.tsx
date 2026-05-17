import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function ChamberScene() {
  return (
    <Canvas camera={{ position: [3, 2, 4], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Chamber outline — a wireframe cube standing in for the fluid volume */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial wireframe color="#3a4a6e" />
      </mesh>

      {/* AMP-coated chip — a plane at the bottom of the chamber */}
      <mesh position={[0, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshStandardMaterial color="#5a7fbf" roughness={0.6} />
      </mesh>

      {/* Placeholder bacterium */}
      <mesh position={[0.3, 0.2, -0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#c5d4ff" />
      </mesh>

      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
