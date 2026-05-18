import {
  V_SED_UM_PER_S,
  V_CONV_UM_PER_S,
  V_SWIM_UM_PER_S,
} from "./constants";

export function randn(): number {
  const u1 = 1 - Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function randomUnitVec(out: [number, number, number]): void {
  const u = Math.random() * 2 - 1;
  const theta = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(Math.max(0, 1 - u * u));
  out[0] = r * Math.cos(theta);
  out[1] = u;
  out[2] = r * Math.sin(theta);
}

export function sedimentationVy(g: number, on: boolean): number {
  return on ? -V_SED_UM_PER_S * g : 0;
}

export function convectionV(
  px: number,
  py: number,
  pz: number,
  g: number,
  on: boolean,
  out: [number, number, number],
): void {
  if (!on || g === 0) {
    out[0] = 0; out[1] = 0; out[2] = 0;
    return;
  }
  const r = Math.sqrt(px * px + pz * pz);
  if (r < 0.05) {
    out[0] = 0; out[1] = 0; out[2] = 0;
    return;
  }
  const torusR = 0.55;
  const dr = r - torusR;
  const dy = py;
  const mag = Math.sqrt(dr * dr + dy * dy);
  const envCenter = 0.3;
  const envWidth = 0.25;
  const env = Math.exp(-Math.pow((mag - envCenter) / envWidth, 2));
  const speed = V_CONV_UM_PER_S * g * env;
  if (mag < 1e-4) {
    out[0] = 0; out[1] = 0; out[2] = 0;
    return;
  }
  const tangentR = -dy / mag;
  const tangentY = dr / mag;
  const rxHat = px / r;
  const rzHat = pz / r;
  out[0] = tangentR * speed * rxHat;
  out[1] = tangentY * speed;
  out[2] = tangentR * speed * rzHat;
}

export function swimV(
  hx: number,
  hy: number,
  hz: number,
  on: boolean,
  out: [number, number, number],
): void {
  if (!on) {
    out[0] = 0; out[1] = 0; out[2] = 0;
    return;
  }
  out[0] = V_SWIM_UM_PER_S * hx;
  out[1] = V_SWIM_UM_PER_S * hy;
  out[2] = V_SWIM_UM_PER_S * hz;
}
