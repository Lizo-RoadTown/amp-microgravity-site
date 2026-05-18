export const CHAMBER_HALF = 1;
export const CHIP_TOP_Y = -1 + 0.02;
export const CELL_VISUAL_RADIUS = 0.035;
export const BACTERIA_COUNT = 400;

export const V_SED_UM_PER_S = 0.5;
export const V_CONV_UM_PER_S = 2;
export const D_DIFF_UM2_PER_S = 0.4;
// V_SWIM tuned slightly below the real-world range (~10-30 µm/s for E. coli
// depending on strain and medium) for visual readability. At SIM_TIME_SCALE 50,
// 20 µm/s would render as ~1 mm/s — a swimming cell would sprint across the
// chamber in 2 seconds. 8 µm/s reads as active but unhurried, while still being
// inside the realistic range for slower strains. NB: swim speed is the same in
// 1g and µg — gravity doesn't affect individual cell propulsion. The visual
// difference between columns comes from the absence of sedimentation /
// convection in µg, which channeled and stirred motion in 1g.
export const V_SWIM_UM_PER_S = 8;
export const TAU_RUN_S = 1.0;

export const UM_PER_MM = 1000;
export const SIM_TIME_SCALE = 50;
export const MAX_DT_S = 1 / 30;

export const COLUMN_OFFSET_X = 1.4;
