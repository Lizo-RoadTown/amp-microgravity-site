import { useEffect, useMemo, useRef } from "react";
import type { BacteriaBuffers, SceneControls } from "./types";
import {
  BACTERIA_COUNT,
  CHAMBER_HALF,
  CHIP_TOP_Y,
  CELL_VISUAL_RADIUS,
  D_DIFF_UM2_PER_S,
  TAU_RUN_S,
  UM_PER_MM,
  SIM_TIME_SCALE,
  MAX_DT_S,
} from "./constants";
import {
  randn,
  randomUnitVec,
  sedimentationVy,
  convectionV,
  swimV,
} from "./transport";

function spawnRandomVolume(b: BacteriaBuffers, i: number) {
  b.px[i] = (Math.random() * 2 - 1) * CHAMBER_HALF * 0.9;
  b.py[i] = (Math.random() * 2 - 1) * CHAMBER_HALF * 0.9;
  b.pz[i] = (Math.random() * 2 - 1) * CHAMBER_HALF * 0.9;
  const h: [number, number, number] = [0, 0, 0];
  randomUnitVec(h);
  b.hx[i] = h[0]; b.hy[i] = h[1]; b.hz[i] = h[2];
  b.tumbleTimer[i] = -TAU_RUN_S * Math.log(1 - Math.random());
  b.captured[i] = 0;
  b.capturedTimer[i] = 0;
}

export function useBacteriaSim(
  controls: SceneControls,
  columnGravity: number,
  cellCount: number = BACTERIA_COUNT,
): {
  buffers: BacteriaBuffers;
  tick: (deltaRaw: number) => void;
} {
  const buffers = useMemo<BacteriaBuffers>(() => {
    const n = cellCount;
    const b: BacteriaBuffers = {
      px: new Float32Array(n),
      py: new Float32Array(n),
      pz: new Float32Array(n),
      hx: new Float32Array(n),
      hy: new Float32Array(n),
      hz: new Float32Array(n),
      tumbleTimer: new Float32Array(n),
      captured: new Uint8Array(n),
      capturedTimer: new Float32Array(n),
      count: n,
    };
    for (let i = 0; i < n; i++) spawnRandomVolume(b, i);
    return b;
  }, []);

  const controlsRef = useRef<SceneControls>(controls);
  const gravityRef = useRef<number>(columnGravity);
  useEffect(() => { controlsRef.current = controls; }, [controls]);
  useEffect(() => { gravityRef.current = columnGravity; }, [columnGravity]);

  const convOut = useRef<[number, number, number]>([0, 0, 0]);
  const swimOut = useRef<[number, number, number]>([0, 0, 0]);
  const tumbleHeading = useRef<[number, number, number]>([0, 0, 0]);

  const tick = (deltaRaw: number) => {
    const dt = Math.min(deltaRaw, MAX_DT_S);
    const simDt = dt * SIM_TIME_SCALE;
    const c = controlsRef.current;
    const g = gravityRef.current;
    const m = c.mechanisms;
    const b = buffers;

    // Ambient damping for diffusion + swim that scales with gravity. Physically
    // at the single-cell scale, neither of these depends on gravity — but the
    // chamber as a whole has less fluid energy without gravity-driven bulk
    // motion (convection, sedimentation). Damping to 0.5× at µg reads as
    // "still happens, just in a calmer environment" without claiming the
    // mechanisms themselves stop.
    const ambient = 0.5 + 0.5 * g;
    const diffStep = Math.sqrt(2 * D_DIFF_UM2_PER_S * simDt) * ambient;

    for (let i = 0; i < b.count; i++) {
      if (b.captured[i]) {
        // Captured cells stick permanently — the visible pile-up IS the result.
        continue;
      }

      const vy_sed = sedimentationVy(g, m.sedimentation);
      convectionV(b.px[i], b.py[i], b.pz[i], g, m.convection, convOut.current);
      swimV(b.hx[i], b.hy[i], b.hz[i], m.swimming, swimOut.current);

      const vx_um = convOut.current[0] + swimOut.current[0] * ambient;
      const vy_um = vy_sed + convOut.current[1] + swimOut.current[1] * ambient;
      const vz_um = convOut.current[2] + swimOut.current[2] * ambient;

      let dpx_um = vx_um * simDt;
      let dpy_um = vy_um * simDt;
      let dpz_um = vz_um * simDt;

      if (m.diffusion) {
        dpx_um += diffStep * randn();
        dpy_um += diffStep * randn();
        dpz_um += diffStep * randn();
      }

      b.px[i] += dpx_um / UM_PER_MM;
      b.py[i] += dpy_um / UM_PER_MM;
      b.pz[i] += dpz_um / UM_PER_MM;

      if (m.swimming) {
        b.tumbleTimer[i] -= simDt;
        if (b.tumbleTimer[i] <= 0) {
          randomUnitVec(tumbleHeading.current);
          b.hx[i] = tumbleHeading.current[0];
          b.hy[i] = tumbleHeading.current[1];
          b.hz[i] = tumbleHeading.current[2];
          b.tumbleTimer[i] = -TAU_RUN_S * Math.log(1 - Math.random());
        }
      }

      if (b.py[i] <= CHIP_TOP_Y + CELL_VISUAL_RADIUS) {
        b.py[i] = CHIP_TOP_Y + CELL_VISUAL_RADIUS;
        b.captured[i] = 1;
        continue;
      }

      if (b.px[i] > CHAMBER_HALF) b.px[i] = CHAMBER_HALF - (b.px[i] - CHAMBER_HALF);
      else if (b.px[i] < -CHAMBER_HALF) b.px[i] = -CHAMBER_HALF - (b.px[i] + CHAMBER_HALF);
      if (b.pz[i] > CHAMBER_HALF) b.pz[i] = CHAMBER_HALF - (b.pz[i] - CHAMBER_HALF);
      else if (b.pz[i] < -CHAMBER_HALF) b.pz[i] = -CHAMBER_HALF - (b.pz[i] + CHAMBER_HALF);
      if (b.py[i] > CHAMBER_HALF) b.py[i] = CHAMBER_HALF - (b.py[i] - CHAMBER_HALF);
    }
  };

  return { buffers, tick };
}
