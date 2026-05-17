import { ChamberScene } from "./scenes/ChamberScene";
import "./App.css";

function App() {
  return (
    <main>
      <header className="site-header">
        <p className="eyebrow">SSEP Mission 21 · Cal Poly Pomona · Honorable Mention</p>
        <h1>Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in Microgravity</h1>
        <p className="subtitle">
          A theoretical experiment proposing that the physics of how bacteria reach a sensor
          surface — not the chemistry of how they bind to it — may be what decides whether
          AMP-based biosensors can be trusted in orbit.
        </p>
      </header>

      <section id="problem" className="section">
        <h2>The Problem</h2>
        <p>
          Biofilms are a recurring presence on the International Space Station, detected on
          cabin walls, air filters, and water-handling equipment. They grow differently than
          they do on Earth and show elevated antimicrobial resistance — a documented threat to
          crew health and equipment reliability.
        </p>
        <p>
          Antimicrobial peptides (AMPs) bind negatively charged bacterial membranes and are
          increasingly used as the capture layer in optical biosensors for microbial detection.
          They work on Earth. Nobody has measured whether they still work the same way in
          orbit — and the suspicion is that the physics of <em>getting bacteria to the
          surface</em> changes enough that the sensor's calibration may not survive the trip up.
        </p>
      </section>

      <section id="mechanism" className="section">
        <h2>The Mechanism</h2>
        <p>
          On Earth, bacteria reach a surface through three combined mechanisms: sedimentation
          under gravity, buoyant convection driven by density gradients, and molecular
          diffusion supplemented by active flagellar swimming. In microgravity, the first
          two vanish.
        </p>
        <p>
          <em>Placeholder 3D scene below — this is where the side-by-side 1g vs µg chamber
          comparison will live.</em>
        </p>
        <div className="scene-frame">
          <ChamberScene />
        </div>
      </section>

      <section id="narrative" className="section">
        <h2>Why the experiment is designed this way</h2>
        <p>
          Each design choice answers a question about isolating microgravity as the sole
          variable: a fimbriae-knockout E. coli strain so observed capture is AMP-mediated
          only; two different AMPs (LL-37, Magainin I) plus PEG-only and scrambled-peptide
          controls; a three-chamber tube with crew-operated valves so bacteria are activated
          on orbit and fixed in microgravity before return.
        </p>
        <p><em>Detail and chip-stack diagram coming next.</em></p>
      </section>

      <section id="outcomes" className="section">
        <h2>What either result would mean</h2>
        <p>
          If microgravity reduces capture efficiency, spacecraft biosensors need redesign —
          longer exposure, higher AMP surface density, recalibrated detection thresholds. If
          capture is statistically equivalent, current Earth-tested designs can deploy as-is,
          and bacterial swimming has been shown to compensate for the absent transport modes.
          Either outcome is actionable.
        </p>
      </section>

      <footer className="site-footer">
        <p>
          Source proposal: <em>Comparative Capture of E. coli by Antimicrobial-Peptide
          Biosensors in Microgravity.</em> SSEP Mission 21, Cal Poly Pomona / Bronco Space Lab.
          Honorable mention — experiment not selected to fly.
        </p>
      </footer>
    </main>
  );
}

export default App;
