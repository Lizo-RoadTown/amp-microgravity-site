import { ChamberScene } from "./scenes/ChamberScene";
import { ChipStackDiagram } from "./components/ChipStackDiagram";
import { ElisaDiagram } from "./components/ElisaDiagram";
import { TubeDiagram } from "./components/TubeDiagram";
import { CrewTimeline } from "./components/CrewTimeline";
import { MechanismComparison } from "./components/MechanismComparison";
import { SectionNav } from "./components/SectionNav";
import "./App.css";

function App() {
  return (
    <main>
      <SectionNav />
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

        <h3>Bacteria don't politely stay on Earth</h3>
        <p>
          The International Space Station has been continuously inhabited since 2000, and
          microbial surveys keep turning up the same kinds of communities living on cabin
          walls, air filters, and the water systems: <em>Staphylococcus</em>,{" "}
          <em>Bacillus</em>, and gut-flora relatives like <em>E. coli</em>. They don't
          just survive up there — they grow into <strong>biofilms</strong> (sticky
          surface-bound mats of cells), and once they're on a surface they're notoriously
          hard to kill. Worse, ISS biofilms have been documented growing in patterns and
          showing antimicrobial-resistance levels that don't match what the same strains
          do on Earth. This is a real, ongoing operational concern for crew health and
          equipment reliability — not a theoretical one.
        </p>

        <h3>What we have to detect them</h3>
        <p>
          One of the most promising tools for catching bacteria on a surface is an{" "}
          <strong>antimicrobial-peptide biosensor</strong>. Antimicrobial peptides (AMPs)
          are short chains of amino acids — small proteins — that carry a positive
          electrical charge. Bacterial cell membranes carry a negative one. Opposite
          charges attract, so when an AMP and a bacterium meet they stick. Biosensor
          chips coat their surfaces with a dense lawn of immobilized AMPs and use that
          lawn as a kind of biological velcro: bacteria drifting past get caught, and a
          detector reads out how many landed. This works well on Earth. The question this
          experiment asks is whether it still works the same way in orbit.
        </p>

        <h3>Why this is even a question — gravity changes how bacteria move</h3>
        <p>
          The chemistry of "AMP grabs bacterium" doesn't care about gravity. But for the
          chemistry to happen, the bacterium has to physically <em>reach</em> the AMP
          first. On Earth, four different processes nudge bacteria toward a nearby
          surface. <strong>Two of them only work because gravity exists.</strong> In low
          earth orbit you're not actually "weightless" — the ISS is falling around the
          planet — but you and everything inside the station are falling at the same
          rate, so locally the effect is the same: no <em>down</em>.
        </p>

        <div className="diagram-frame">
          <MechanismComparison />
        </div>

        <p>
          The four mechanisms, in plain language:
        </p>

        <h3>Sedimentation — dense stuff falls</h3>
        <p>
          Drop a handful of sand into a glass of water and the grains drift to the
          bottom. They drift because they are denser than water, and gravity pulls denser
          things down through less dense ones. A bacterium is slightly denser than the
          salt solution it lives in, so it does the same thing — much more slowly (about
          half a micrometer per second for a 1-µm E. coli cell), but continuously,
          forever, as long as gravity is on. In orbit, there is no down. The sand stays
          suspended, the bacteria stop drifting, and one of the two main ways cells reach
          a surface from across a chamber simply turns off.
        </p>

        <h3>Buoyant convection — bubbles rise, currents form</h3>
        <p>
          If you heat the bottom of a pot of soup, the warm liquid at the bottom expands,
          becomes less dense, and rises; the cooler liquid at the top sinks to take its
          place. That's a convection current. The same physics is why air bubbles rise in
          carbonated water — the gas is less dense than the liquid around it. In any real
          chamber on Earth, tiny density gradients (from temperature, from dissolved
          stuff, from the bacteria themselves) drive slow bulk flows that constantly stir
          the fluid and carry cells around. Take gravity away and those flows stop. The
          bubbles stay where they are. The soup just sits there.
        </p>

        <h3>Brownian diffusion — molecular jiggling (still works)</h3>
        <p>
          Even perfectly still water isn't actually still at small scales. Water
          molecules are in constant thermal motion, and they collide randomly with
          anything small enough to feel the impact — including bacteria. The result is a
          jittery, unpredictable drift called Brownian motion. A bacterium suspended in
          water is being kicked in every direction many thousands of times per second,
          and the net effect is a slow random walk through the fluid. This is unchanged
          in orbit. The molecules don't care about gravity.
        </p>

        <h3>Flagellar swimming — bacteria with little tails (still works)</h3>
        <p>
          Many bacteria, including E. coli, grow long whip-like appendages called{" "}
          <strong>flagella</strong>. They spin them like propellers to push themselves
          through liquid. E. coli swims at roughly 20 micrometers per second — much
          faster than diffusion drifts it at the same scale. Every second or so it
          tumbles randomly and takes off in a new direction. This is also unchanged in
          orbit. The flagella work the same in free-fall as they do on a lab bench.
        </p>

        <h3>So what's left?</h3>
        <p>
          On Earth, all four mechanisms combine to deliver bacteria onto surfaces. In
          orbit, you're down to the bottom two: random thermal drift, and active
          swimming. The experiment this site is about asks one question:{" "}
          <strong>is that enough?</strong> Does an AMP biosensor catch bacteria as
          efficiently when it's lost the two transport mechanisms it depended on the
          most? If yes, every Earth-tested spacecraft biosensor deploys as-is. If no,
          every one of them needs to be redesigned.
        </p>
      </section>

      <section id="mechanism" className="section">
        <h2>See it run</h2>
        <p>
          Here are the four mechanisms running side by side — 1g on the left, microgravity
          on the right. Drag the gravity slider toward zero and watch sedimentation fall
          off. Toggle individual mechanisms to see how each one contributes (or doesn't).
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

      <section id="constraints" className="section">
        <h2>What it has to fit through</h2>
        <p>
          The constraints on a student ISS experiment are severe, and they shape every
          decision above. Three of them are worth seeing directly: the tube, the crew
          time, and the no-do-overs nature of spaceflight.
        </p>

        <h3>The tube</h3>
        <p>
          The whole experiment lives inside a Rhodium RhFET-01 tube — about the size of
          a sturdy marker pen. Three chambers, two crew-operated valves, 20 mL of total
          fluid capacity. Everything you have read about — the bacteria, the AMP chips,
          the fixative — fits in this volume.
        </p>
        <div className="diagram-frame">
          <TubeDiagram />
        </div>

        <h3>The crew time</h3>
        <p>
          Astronaut time on the ISS is one of the most expensive resources in the solar
          system. The experiment is designed around the assumption that crew can spare
          almost none of it. The entire interactive portion of the protocol is two valve
          turns, fifteen seconds of gentle shaking each.
        </p>
        <div className="diagram-frame diagram-frame--narrow">
          <CrewTimeline />
        </div>

        <h3>No do-overs</h3>
        <p>
          A ground-based experiment can be repeated when something goes wrong. This one
          cannot. If a valve sticks, if a chip detaches, if the fixative leaks early —
          there is no second sample on orbit, no way to send a correction. Every choice
          in the proposal (freeze-drying the bacteria so they survive launch dormant,
          the BS3 crosslinker that covalently locks captured cells in place, the
          formalin fixation before re-entry) is a hedge against a single point of
          failure. The design is disciplined because it has to be.
        </p>
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
