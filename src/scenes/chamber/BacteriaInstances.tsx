import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBacteriaSim } from "./useBacteriaSim";
import type { SceneControls } from "./types";
import { BACTERIA_COUNT, CELL_VISUAL_RADIUS } from "./constants";

interface Props {
  controls: SceneControls;
  columnGravity: number;
  cellColor: string;
}

const tmpMatrix = new THREE.Matrix4();
const tmpPos = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpScale = new THREE.Vector3(1, 1, 1);

export function BacteriaInstances({ controls, columnGravity, cellColor }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { buffers, tick } = useBacteriaSim(controls, columnGravity);

  const writeMatrices = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < BACTERIA_COUNT; i++) {
      tmpPos.set(buffers.px[i], buffers.py[i], buffers.pz[i]);
      tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
      mesh.setMatrixAt(i, tmpMatrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => {
    writeMatrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    tick(delta);
    writeMatrices();
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, BACTERIA_COUNT]}
      castShadow={false}
    >
      <sphereGeometry args={[CELL_VISUAL_RADIUS, 8, 8]} />
      <meshStandardMaterial color={cellColor} roughness={0.4} />
    </instancedMesh>
  );
}
