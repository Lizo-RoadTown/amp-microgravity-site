export interface MechanismFlags {
  sedimentation: boolean;
  convection: boolean;
  diffusion: boolean;
  swimming: boolean;
}

export interface SceneControls {
  gravity: number;
  mechanisms: MechanismFlags;
}

export interface BacteriaBuffers {
  px: Float32Array; py: Float32Array; pz: Float32Array;
  hx: Float32Array; hy: Float32Array; hz: Float32Array;
  tumbleTimer: Float32Array;
  captured: Uint8Array;
  capturedTimer: Float32Array;
  count: number;
}
