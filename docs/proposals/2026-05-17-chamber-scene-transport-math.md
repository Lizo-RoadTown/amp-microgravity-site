# Proposal: Chamber-scene transport math

**Status:** Accepted — v1 shipped 2026-05-17 (all 7 migration steps in one PR)
**Authors:** Elizabeth Osborn (with Claude planning assist)
**Date:** 2026-05-17

## Problem

Section 2 ("The Mechanism") of the site currently renders a wireframe cube, a flat chip plane, and one static sphere. It claims to demonstrate the central scientific argument of the proposal — that in 1g three transport mechanisms move bacteria to an AMP-coated surface, and in microgravity two of them disappear — but it shows none of that. A reader cannot see the difference between 1g and µg, cannot isolate which mechanism is doing the work, and cannot form the intuition the rest of the site depends on. The placeholder also leaves the architectural choices that matter (how many cells, how forces compose, how gravity is parameterized, where state lives) undecided, so every future change to the scene risks rework. This proposal locks those choices in before code.

## Decision

Implement the scene as a single `<Canvas>` with two side-by-side viewports (left = 1g column, right = µg column), one `InstancedMesh` of ~300 capsule-shaped bacteria per column, and a `useFrame` loop that integrates four hand-coded transport contributions per cell per frame. Bacterium state lives in plain `Float32Array` typed arrays (not React state) inside a `useRef`; React only renders the chamber shell, the chip plane, the controls panel, and a `useFrame` writer that mutates the `InstancedMesh.instanceMatrix`. Scene-level state (gravity slider 0–1, four mechanism toggles, cell count) lives in a single Zustand-free `useState`-backed store at the `<ChamberScene>` level and is read by the simulation hook via `useRef` mirrors so toggling a control does not rebuild the typed arrays. Capture is a half-space test against the chip plane; captured cells are respawned at a random ceiling position so steady-state density stays visually constant.

### Why this choice

- **Versus rapier / cannon / @react-three/cannon.** A physics engine is overkill for four analytic force terms, adds 100–300 KB to a bundle already at 1 MB, and forces us into rigid-body abstractions that don't match the actual physics (Brownian diffusion is not a force, run-and-tumble is a stochastic process, not a contact). Hand-coded math is also more honest about the level of approximation — readers shouldn't think we're "simulating fluid dynamics."
- **Versus GPU compute / custom shaders.** CLAUDE.md explicitly forbids shaders in v1. With ~600 total cells at 60 Hz, CPU integration in a tight typed-array loop is well under 1 ms/frame on integrated graphics. Shaders would also block the team from reading the simulation in the debugger.
- **Versus a particle library (three-nebula, etc.).** Those libraries are tuned for VFX (smoke, fire) and bake in assumptions (emitter shapes, blending) that fight a scientific use case. We'd write more code adapting them than the loop itself.
- **Versus 2D canvas.** A 2D top-down or side view would actually read clearly, and we considered it. We're staying with 3D because (a) it matches the spatial intuition of "bacteria fall onto a chip on the chamber floor," (b) the site already pays the three.js bundle cost, and (c) the user-controlled camera orbit is itself a teaching tool — readers see the µg column has no preferred direction.
- **Versus two separate `<Canvas>` elements for 1g vs µg.** One canvas with two viewports shares a single WebGL context, halves draw-call overhead, and keeps the two simulations in lockstep on the same `useFrame` clock. The cost is slightly more setup with `gl.setScissor`; worth it.
- **Versus React state per-bacterium.** Re-rendering 600 React components at 60 Hz would melt the page. Typed arrays + direct `InstancedMesh` matrix writes is the standard r3f pattern for this scale.

### What this rules out

Listed in full in "What this proposal does NOT cover" below.

## Schema / API / Contract

### Numerical scale (anchored to E. coli in PBS)

- **1 r3f world unit = 1 mm.** The chamber is a 2 mm × 2 mm × 2 mm cube (matches the existing placeholder geometry). A 1 µm E. coli cell renders as a 0.001-unit capsule, which is invisible — so we render cells at exaggerated scale (0.04 units ≈ "40× zoom") and document the scale break in a caption. Physics math operates in real µm/s; we convert once at the matrix-write step.
- **Time:** raw `delta` from `useFrame`, clamped to `min(delta, 1/30)` to prevent giant integration jumps when the tab is backgrounded then refocused. No fixed-timestep accumulator in v1 — the integrator is explicit Euler, which is fine for first-order kinematics at this scale.
- **Cell count:** 300 per column (600 total). Headroom target: 60 fps on Intel Iris Xe. Exposed as a `bacteriaCount` constant so we can bump it if perf allows.
- **Anchor values (tunable constants, not hard-coded magic numbers):**
  - Sedimentation velocity `v_sed = 0.5 µm/s` at 1g (Stokes-law ballpark for a 1 µm cell, density 1.10 g/mL, in PBS at 25 °C).
  - Convection peak velocity `v_conv = 2 µm/s` at 1g (order-of-magnitude for buoyancy-driven flow in a mm-scale chamber).
  - Brownian diffusion `D = 0.4 µm²/s` (Stokes-Einstein for the same cell). Per-axis step: `sqrt(2 D dt) * randn()`.
  - Swim speed `v_swim = 20 µm/s`; mean run duration `τ = 1.0 s`; tumble = uniformly random new heading.
- **Visual time-scaling.** At true scale, sedimentation across a 2 mm chamber takes ~4000 s. We multiply all velocities by a single `SIM_TIME_SCALE = 50` so a sedimentation traversal takes ~80 s — slow enough to watch, fast enough to not feel broken. Document this in the caption.

### File structure

New files under `src/scenes/`:

```
src/scenes/
  ChamberScene.tsx          (existing — becomes the orchestrator)
  chamber/
    types.ts                (BacteriumState, SceneControls, MechanismFlags)
    constants.ts            (v_sed, v_conv, D, v_swim, τ, SIM_TIME_SCALE, counts)
    useBacteriaSim.ts       (the useRef + useFrame integrator hook)
    transport.ts            (pure functions: sediment, convect, diffuse, swim)
    BacteriaInstances.tsx   (the <instancedMesh> + per-frame matrix writer)
    ChamberShell.tsx        (wireframe cube + chip plane — extracted from current scene)
    SceneControls.tsx       (gravity slider + four toggles, plain React, no leva for v1)
    DualViewport.tsx        (the two-column scissor setup)
```

### Per-bacterium state (struct-of-arrays)

```ts
// types.ts
export interface BacteriaBuffers {
  // Position in chamber-local mm; origin = chamber center, y-up
  px: Float32Array; py: Float32Array; pz: Float32Array;
  // Velocity in µm/s (pre-SIM_TIME_SCALE)
  vx: Float32Array; vy: Float32Array; vz: Float32Array;
  // Heading unit vector for run-and-tumble
  hx: Float32Array; hy: Float32Array; hz: Float32Array;
  // Seconds remaining in current run before next tumble
  tumbleTimer: Float32Array;
  // 0 = free, 1 = captured (skipped by integrator, hidden or stuck to chip)
  captured: Uint8Array;
  count: number;
}
```

Struct-of-arrays (not array-of-structs) because the integrator is tight loops and the JIT vectorizes contiguous Float32Array reads much better than object property access.

### Scene-level state

```ts
// types.ts
export interface MechanismFlags {
  sedimentation: boolean;
  convection: boolean;
  diffusion: boolean;
  swimming: boolean;
}

export interface SceneControls {
  gravity: number;          // 0 (µg) … 1 (1g)
  mechanisms: MechanismFlags;
  bacteriaCount: number;    // default 300, fixed in v1
}
```

`SceneControls` lives in `useState` at `<ChamberScene>`. A `useRef<SceneControls>` mirror is updated in a `useEffect` so the `useFrame` callback reads the latest values without closing over stale state and without re-creating the integrator.

The 1g column gets the controls as-is. The µg column reads the same toggles but with `gravity` forced to 0. This way "toggle convection off" affects both columns symmetrically — the comparison stays clean.

### Per-frame update loop (order of operations)

For each column, for each non-captured cell `i`:

1. **Read latest controls** from the ref mirror once per frame.
2. **Compute mechanism contributions** (each pure, in `transport.ts`):
   - `sediment(g, flags.sedimentation) → dvy = -v_sed * g * dt` (only if flag on)
   - `convect(px, py, pz, g, flags.convection) → (dvx, dvy, dvz)` from a sampled toroidal vector field scaled by `g`. The field is a closed-form analytic torus circulating around the y-axis; no grid, no solver. Zero in the µg column because `g = 0`.
   - `diffuse(flags.diffusion) → (dpx, dpy, dpz) = sqrt(2 D dt) * randn3()` — applied directly to position, not velocity. Independent of `g`.
   - `swim(hx, hy, hz, tumbleTimer, flags.swimming, dt) → (dpx, dpy, dpz)` adds `v_swim * heading * dt`; decrements `tumbleTimer`; if it hits zero, re-randomize heading (uniform on sphere) and reset timer to `-τ * ln(rand())`. Independent of `g`.
3. **Integrate:** `v += dv * SIM_TIME_SCALE; p += v * dt * SIM_TIME_SCALE + dp_direct`.
4. **Capture test:** if `py <= chip_top_y + cell_radius`, set `captured = 1`. Optionally project the cell onto the chip surface and leave it there for one frame (see open questions on visible sticking).
5. **Wall reflection:** if `|px| > chamber_half`, reflect `px` and flip `vx`. Same for `pz`. The ceiling (`py > chamber_half`) reflects too. Floor reflection is preempted by capture.
6. **Respawn:** for each captured cell, after a configurable `RESPAWN_FRAMES = 1` delay, re-initialize position at the ceiling with random `(px, pz)`, zero velocity, random heading, fresh tumble timer, `captured = 0`. Keeps steady-state cell density visually constant.
7. **Write matrices:** loop over `count`, compute a `Matrix4` per cell (position + a tiny y-rotation to align the capsule with its heading when swimming is on, identity otherwise), call `mesh.setMatrixAt(i, m)`. Set `mesh.instanceMatrix.needsUpdate = true`.

Order matters: forces → integrate → capture (so a cell that crosses the chip in this frame is captured this frame, not next) → walls → respawn → write. Diffusion and swim contribute to `dp_direct` rather than `v` so they don't accumulate in `v` and break the gravity-scaling story.

### Force / velocity model summary

| Mechanism | Contribution | Scales with `g`? |
|---|---|---|
| Sedimentation | `dv_y = -v_sed * g * dt` | yes (linear) |
| Convection | `dv = V_torus(p) * g * dt` where `V_torus` is a closed-form toroidal field | yes (linear) |
| Diffusion | `dp = sqrt(2 D dt) * randn3()` | no |
| Swimming | `dp = v_swim * heading * dt`; heading re-rolled at Poisson-`τ` intervals | no |

Constants live in `constants.ts`. Nothing in the integrator hard-codes a number.

## Migration path

Each step is independently shippable: the scene stays viewable after every step, and each step is a single PR.

1. **Extract `ChamberShell.tsx`** (chamber cube + chip plane) from current `ChamberScene.tsx`. No behavior change. Files: `src/scenes/ChamberScene.tsx`, `src/scenes/chamber/ChamberShell.tsx` (new).
2. **Add `BacteriaInstances` with 300 static cells, no motion.** An `InstancedMesh` of small spheres at random positions inside the chamber. Proves the instancing path works. Files: `src/scenes/chamber/BacteriaInstances.tsx` (new), `src/scenes/chamber/constants.ts` (new), `src/scenes/chamber/types.ts` (new), `src/scenes/ChamberScene.tsx`.
3. **Add the `useBacteriaSim` hook with sedimentation only, no controls (gravity hard-coded to 1).** Cells fall, hit the chip, get captured, respawn at the ceiling. Validates the integrator + capture + respawn loop. Files: `src/scenes/chamber/useBacteriaSim.ts` (new), `src/scenes/chamber/transport.ts` (new), `src/scenes/chamber/BacteriaInstances.tsx`.
4. **Add the `SceneControls` panel and wire the gravity slider + sedimentation toggle.** Plain React form, dark-themed, sits below or beside the canvas. Files: `src/scenes/chamber/SceneControls.tsx` (new), `src/scenes/ChamberScene.tsx`, `src/App.css`.
5. **Add diffusion and swimming.** Both `g`-independent, so they exercise the "still moves at µg" path even before the µg column exists. Files: `src/scenes/chamber/transport.ts`, `src/scenes/chamber/useBacteriaSim.ts`, `src/scenes/chamber/SceneControls.tsx`.
6. **Add convection (toroidal analytic field).** Closes the four-mechanism set. Files: `src/scenes/chamber/transport.ts`, `src/scenes/chamber/SceneControls.tsx`.
7. **Split into dual viewport (1g | µg side by side).** The right column reuses the same hook with `gravity = 0`. Add column labels via drei `<Html>`. Files: `src/scenes/chamber/DualViewport.tsx` (new), `src/scenes/ChamberScene.tsx`.

Steps 1–3 give a noticeably-better-than-placeholder scene by themselves. Steps 4–6 build the science. Step 7 delivers the actual comparative argument the section exists for.

## What this proposal does NOT cover

- **Capture statistics / counters.** No on-screen "captured 47 / 300" readouts in v1. Deferred to a follow-up proposal — needs a UX pass on whether the numbers help or distract.
- **The 2D chip stack diagram.** That's Section 3 (`The Scientific Narrative`) and is intentionally 2D SVG. Separate work item.
- **Mobile / touch perf.** v1 targets desktop integrated graphics. Mobile may need a reduced cell count and disabled orbit controls; handled in a later perf-pass proposal.
- **Accessibility beyond `prefers-reduced-motion`.** v1 will respect `prefers-reduced-motion` by freezing the integrator and showing a static representative frame. Full a11y (screen-reader narration of the scene, keyboard-only control) is deferred.
- **Section 3+ of the site.** Anything past `<section id="mechanism">` is out of scope.
- **Realistic fluid dynamics.** The convection field is a hand-authored torus, not a Navier-Stokes solution. The point is qualitative ("there is a flow that scales with g"), not predictive.
- **Streaklines, trails, or postprocessing.** CLAUDE.md forbids shaders in v1.
- **Variable cell count from the UI.** `bacteriaCount` is a constant in `constants.ts`. Changing it requires a code edit. A UI control is a v2 conversation.

## Open questions

Each has a recommended v1 default and a revisit trigger.

1. **One canvas with two viewports, or two canvases?** *Default for v1: one canvas with scissor-test viewports.* Revisit if the scissor setup interacts badly with `OrbitControls` (drei's controls assume one viewport).
2. **Do captured bacteria visibly stick to the chip, or just disappear?** *Default for v1: stick for ~2 seconds (cell stops moving, stays rendered on the chip surface), then despawn and respawn at the ceiling.* The visible accumulation is part of the teaching — readers should see "more cells pile up in the 1g column." Revisit if visual clutter obscures incoming cells.
3. **Leva panel or plain React controls?** *Default for v1: plain React.* Leva is already a dependency, but the control surface is small (one slider, four checkboxes), and a custom panel matches the dark theme without leva's default chrome. Revisit if we add more than ~8 controls.
4. **Camera: one shared orbit, two independent orbits, or fixed cameras?** *Default for v1: one shared `OrbitControls` driving both viewport cameras synchronously, so the columns stay visually aligned.* Revisit if users want to inspect one column closely.
5. **Should the µg column be `g = 0` exactly, or `g = 1e-6` to match ISS reality?** *Default for v1: exactly 0.* The point is the asymptotic comparison; small numbers add noise to the visual without adding accuracy.
6. **Cell geometry: sphere, capsule, or rod?** *Default for v1: sphere (cheapest instancing, smallest geometry).* Revisit when swimming heading visualization becomes important enough that orientation needs to read at a glance — then switch to capsule + per-instance rotation.
7. **Convection field shape: torus, double-cell, or single up-down loop?** *Default for v1: single torus circulating around the y-axis.* It's the simplest closed-form analytic field that's clearly buoyancy-shaped. Revisit if it visually competes with sedimentation in a confusing way.
8. **Where does `SceneControls` live in the DOM — overlay on the canvas, or below it?** *Default for v1: below the canvas, inside the existing `.scene-frame` container.* Overlay risks colliding with `OrbitControls`'s gesture area. Revisit if vertical real estate becomes tight.
9. **Do we expose a "show transport vectors" debug toggle?** *Default for v1: no.* It's a debugging affordance, not a teaching one. Revisit if we end up giving talks where the per-mechanism contribution needs to be visible separately.

## Implementation notes (2026-05-17)

Two deliberate deviations from the Decision section, both made during the v1 build:

1. **Two columns rendered side-by-side in world space, not scissor viewports.** Single `<Canvas>`, single `<PerspectiveCamera>`, single `<OrbitControls>`, two `<group>`s offset by `±COLUMN_OFFSET_X`. This matches open question #4's chosen default of "one shared OrbitControls driving both columns synchronously" and skips the drei `<View>` + scissor infrastructure entirely. The comparison reads identically; the camera orbits around both columns together which itself reinforces "the two scenes are the same setup at different gravity." If we later need independent column inspection, switching to `<View>`-based viewports is mechanical.

2. **Velocity arrays dropped from `BacteriaBuffers`.** The Decision specified persisted `vx/vy/vz`, but on implementation each mechanism turned out to express as either a terminal velocity (sedimentation, convection) or a direct position kick (diffusion, swim) — none have inertia in this model. Storing `v` between frames was vestigial state that would have invited future bugs ("why is v not zero when sedimentation is off?"). Per-frame total velocity is computed fresh from the active mechanisms in the integrator. If we ever add a force that needs inertia (drag, electrostatics), `v` arrays come back.

One side-effect change to `vite.config.ts`: added `server.allowedHosts: ['host.docker.internal', 'localhost']` so Claude's Docker-hosted Playwright browser can hit the dev server during in-session visual verification. Dev-only, no production impact.

### Files added

- `src/scenes/chamber/types.ts`, `constants.ts`, `transport.ts`, `useBacteriaSim.ts`, `BacteriaInstances.tsx`, `ChamberShell.tsx`, `SceneControls.tsx`
- (`DualViewport.tsx` was not created — see deviation #1 above)

### Files modified

- `src/scenes/ChamberScene.tsx` — rewritten as orchestrator
- `src/App.tsx` — Section 2 copy updated, no longer references "placeholder scene"
- `src/App.css` — added `.chamber-scene`, `.chamber-canvas`, `.chamber-label`, `.chamber-caption`, `.scene-controls__*`
- `vite.config.ts` — `server.allowedHosts` (see above)

### Verified

- `npm run build` clean
- Rendered in browser via Docker Playwright; visible behavior confirmed:
  - 1g column: clear pileup of captured cells at the chip surface
  - µg column: uniform volumetric distribution
  - Sedimentation toggle: 1g pileup disappears, cells redistribute
  - Controls live-update without rebuilding typed arrays
