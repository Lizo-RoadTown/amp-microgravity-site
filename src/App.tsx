import { ChamberScene } from "./scenes/ChamberScene";
import { ChipStackDiagram } from "./components/ChipStackDiagram";
import { ElisaDiagram } from "./components/ElisaDiagram";
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
          Toggle each mechanism on or off below, and slide gravity from 1g toward
          microgravity. In the 1g column (left), sedimentation and convection do most of
          the work delivering bacteria to the chip. In the µg column (right) only diffusion
          and active swimming remain — same chemistry, very different transport regime.
        </p>
        <div className="scene-frame">
          <ChamberScene />
        </div>
      </section>

      <section id="narrative" className="section">
        <h2>Why the experiment is designed this way</h2>
        <p>
          Each design choice answers the same question: how do we isolate microgravity as
          the sole variable that could explain a difference in capture?
        </p>

        <h3>The strain — ΔfimA E. coli</h3>
        <p>
          Wild-type E. coli reach surfaces through two routes: passive transport (the
          mechanisms in the chamber above) and active adhesion through fimbriae — hair-like
          appendages that bind glycoproteins on almost any surface. If we let fimbriae
          contribute, any observed capture conflates AMP binding with non-specific
          stickiness. We use a ΔfimA knockout strain that lacks the major fimbrial subunit,
          so what reaches the chip and stays there has to be AMP-mediated.
        </p>

        <h3>The chip — AMP capture layer with controls</h3>
        <p>
          The capture surface is a layered stack. Streptavidin tetramers anchor to the
          sensor; biotinylated AMPs lock into the streptavidin (one of the strongest known
          non-covalent bonds); polyethylene glycol fills the gaps to block anything that
          isn't AMP-binding from sticking. The same chip carries two distinct AMPs (LL-37,
          a human peptide, and Magainin I, from frog skin) and two controls (PEG-only and
          a scrambled-sequence peptide), so on-orbit results are interpreted against
          on-orbit negative controls — no flight-vs-ground calibration drift.
        </p>
        <div className="diagram-frame">
          <ChipStackDiagram />
        </div>

        <h3>The hardware — three-chamber valve-gated mini-lab</h3>
        <p>
          SSEP payloads are passive: no power, no real-time crew interaction beyond
          turning two valves at scheduled times. The Rhodium RhFET-01 tube has three
          sealed chambers — freeze-dried bacteria in chamber 1, the AMP chips in chamber
          2 (immersed in PBS with BS3 crosslinker), formalin in chamber 3. On Day U-5
          (five days before undocking) crew opens Valve A — bacteria rehydrate and reach
          the chips. On Day U-2, crew opens Valve B — formalin floods chamber 2 and
          chemically locks every bound cell in place. The chips return to Earth fixed in
          the state they reached on orbit, so all the imaging and quantification happens
          on the ground without confounding the result with re-entry.
        </p>

        <h3>How you read the result — sandwich ELISA</h3>
        <p>
          The capture itself happens on orbit; the <em>counting</em> happens later on the
          bench. The fixed chips come back to Earth and go through a sandwich ELISA: a
          primary antibody specific to E. coli surface antigens binds any bacterium stuck
          to the chip; a secondary antibody linked to horseradish peroxidase binds the
          primary; a colorless TMB substrate is added and the enzyme turns it blue. The
          intensity of the blue, read at 450 nm in a spectrophotometer, is proportional
          to how much enzyme is on the chip, which is proportional to how many bacteria
          were captured. A standard curve — built from chips dosed with known cell
          concentrations — converts the absorbance number into <strong>cells per square
          centimeter</strong>.
        </p>
        <p>
          That last step is what makes the flight-vs-ground comparison quantitative
          rather than qualitative. The chamber scene above shows you the difference; the
          ELISA gives you the number.
        </p>
        <div className="diagram-frame">
          <ElisaDiagram />
        </div>
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
