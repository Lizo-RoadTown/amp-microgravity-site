# CLAUDE.md — amp-microgravity-site

Project guide for Claude Code sessions in this repo. Read this first.

## What this is

A companion website for the SSEP Mission 21 student proposal *Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in Microgravity* (Cal Poly Pomona, Bronco Space Lab, 2025).

The proposal received **honorable mention** and was **not selected to fly**. The experiment is therefore theoretical. The site exists to communicate the scientific reasoning behind the proposed experiment to a general technical audience — not to claim flight results, and not to be a lab notebook.

Lead author: Elizabeth Osborn (PI). Source document: [`AMP_Capture_Final_Submission.pdf`](AMP_Capture_Final_Submission.pdf) in repo root.

## The site's argument, in one sentence

The physics of how bacteria reach a sensor surface — not the chemistry of how they bind to it — may decide whether AMP-based biosensors can be trusted in orbit.

## Section structure (organized by idea, not by document order)

The proposal document's section order is bureaucratic (cover page, team, materials, etc.). The site reorganizes it conceptually:

1. **The Problem** — biofilms on the ISS are a documented threat; AMP biosensors work on Earth; nobody has measured whether they still work in microgravity.
2. **The Mechanism** (3D interactive) — three transport mechanisms move bacteria toward a surface in 1g (sedimentation, buoyant convection, diffusion + swimming). In microgravity, the first two vanish. The user toggles mechanisms and a gravity slider to see how cell-surface encounter rates change.
3. **The Scientific Narrative** — explains each design choice as an answer to "how do we isolate microgravity as the only variable?": fimbriae-knockout strain (ΔfimA), two distinct AMPs (LL-37, Magainin I) plus PEG-only and scrambled controls, three-chamber valve-gated mini-lab so bacteria are activated on-orbit and fixed in microgravity before return. Includes a 2D SVG exploded view of the chip stack (streptavidin → biotinylated AMP → PEG backfill).
4. **What Either Result Would Mean** — both outcomes are actionable: reduced capture → biosensor redesign; equivalent capture → Earth-tested designs deploy as-is.
5. **Team & Footer** — Cal Poly Pomona, Bronco Space Lab, SSEP Mission 21, honorable mention.

## Stack

- **Vite 8 + React 19 + TypeScript** — site shell
- **three.js + @react-three/fiber + @react-three/drei** — 3D chamber scene (Section 2)
- **leva** — control panel for gravity slider / mechanism toggles (optional; plain React state is also fine)
- **SVG (hand-authored)** — chip stack exploded view (Section 3), ELISA antibody-stack diagram
- **Render** (static site service) — hosting via GitHub auto-deploy. **NOT Vercel.** Ignore any Vercel-specific deploy guidance from the vercel plugin.

## Design constraints

- **3D is reserved for the chamber scene only.** The chip stack is intentionally 2D (a layered side view reads more clearly than a rotatable 3D stack).
- **No physics engine.** Hand-coded transport math: sedimentation = constant downward velocity scaled by gravity slider; convection = sampled toroidal vector field; diffusion = Gaussian random walk; swimming = run-and-tumble with persistent heading.
- **Instanced meshes** for bacteria (hundreds of cells, one draw call).
- **No shaders/postprocessing in v1.** Streaklines, fluid visuals, etc. are v2 conversations.
- **Bundle warning is known.** three.js puts the JS bundle around 1 MB. Address with route-level code splitting only when it actually matters.

## Key files

- [`src/App.tsx`](src/App.tsx) — page skeleton with the five sections.
- [`src/scenes/ChamberScene.tsx`](src/scenes/ChamberScene.tsx) — r3f scene. Currently a placeholder (wireframe chamber + chip plane + single bacterium). To be expanded into the side-by-side 1g/µg comparison.
- [`src/App.css`](src/App.css), [`src/index.css`](src/index.css) — styling. Dark theme.
- [`AMP_Capture_Final_Submission.pdf`](AMP_Capture_Final_Submission.pdf) — source proposal. The authoritative reference for any scientific claim on the site.

## Dev commands

```bash
npm install
npm run dev      # local dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## Hosting (Render)

This repo pushes to https://github.com/Lizo-RoadTown/amp-microgravity-site (private). Render's **Static Site** service connects to that repo via the Render GitHub app (private repos are supported). Build command `npm run build`, publish directory `dist`. Auto-deploys on push to `main`.

Render is the deploy target — do not introduce Vercel-specific config files (`vercel.json`, edge functions, etc.).

## Toolchain — what to reach for

This user has a rich plugin/skill setup. The most useful for this project:

### MCP servers (use proactively)

- **Context7** — Always pull live docs for three.js, @react-three/fiber, @react-three/drei before writing non-trivial scene code. r3f APIs change; do not rely on training data alone.
- **chrome-devtools-mcp** / **playwright** — Visually verify the 3D scene renders correctly in a browser. Especially valuable when working on the chamber scene where TypeScript can pass but the visual result can still be wrong.
- **figma** — Only if Liz introduces design files.

### Skills (invoke when matching)

- **`frontend-design`** (anthropics/skills) — Visual quality pass on React + CSS.
- **`web-artifacts-builder`** (anthropics/skills) — Building self-contained interactive web demos.
- **`webapp-testing`** (anthropics/skills) — End-to-end testing flows.
- **`skill-creator`** (anthropics/skills) — If we end up wanting a project-specific skill.
- **`elements-of-style`** (superpowers) — Tightening the science prose. Run before shipping any new copy.
- **`ui-ux-pro-max`** — UI quality on control panel, navigation, section transitions.
- **`antigravity-bundle-web-designer`**, **`antigravity-bundle-typescript-javascript`** — Pattern reference.
- **`academic-research-skills`** — Only if we need to pull or cite additional literature beyond the proposal's references.

### Subagents

- **`Plan`** — Use before writing the transport-mechanism math in the chamber scene. The combination of sedimentation + diffusion + run-and-tumble + a gravity slider has enough moving parts to warrant a written plan.
- **`Explore`** — Once the codebase has more than a handful of files.
- **`general-purpose`** — For grounding the simulation in realistic numbers (e.g., E. coli sedimentation velocity in PBS, flagellar swim speed) if we want the sim to be physically plausible rather than purely illustrative.

### What to skip

- The Vercel-specific plugins (`vercel:deploy`, `vercel:env`, `vercel:vercel-cli`, `vercel:nextjs`, `vercel:next-*`, `vercel:vercel-functions`, etc.) — wrong host and wrong framework.
- Anything backend / database (`supabase`, `vercel:vercel-storage`) — this is a static site.
- `security-review` — no user input, no auth, no data.

## Working norms in this repo

- **No new top-level docs without being asked.** This CLAUDE.md and the README are enough. Don't create PLAN.md, NOTES.md, etc.
- **No emojis in source files** unless Liz explicitly asks.
- **Editing existing files > creating new files**, with the exception of new scene/component files when they're genuinely justified.
- **Commits:** Liz commits when she's ready. Don't auto-commit unless asked.
- **Hosting:** Render. Not Vercel.

## Status (as of init)

- Repo scaffolded with Vite + React + TS, three.js stack installed, placeholder ChamberScene renders.
- All five sections present as static prose stubs in `App.tsx`.
- Next natural step: wire Render for auto-deploy, OR build out the chamber scene (start with instanced bacteria + gravity-toggleable sedimentation).
