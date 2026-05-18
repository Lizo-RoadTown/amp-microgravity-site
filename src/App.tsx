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
        <p className="eyebrow">SSEP Mission 21 · AT³ Micro & Nano Program, Cal Poly Pomona · Honorable Mention</p>
        <h1>Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in Microgravity</h1>
        <p className="subtitle">
          We're a student team from the AT³ Micro and Nanotechnology Program at Cal Poly
          Pomona, with advisors from the Bronco Space Lab (also at Cal Poly Pomona) and
          faculty from Bridgeport University. We put this experiment together for SSEP
          Mission 21 — the program that flies student-designed experiments to the ISS.
          Ours got honorable mention, which means it didn't get selected to fly. So
          everything here is theoretical: what we wanted to test, why, and the parts we
          couldn't answer without actually doing it. The question we kept coming back to
          is whether the <em>physics of how bacteria reach a sensor surface</em> — not
          the chemistry of how they bind to it — is what decides whether AMP-based
          biosensors can be trusted in orbit.
        </p>
      </header>

      <section id="microgravity" className="section">
        <h2>Why microgravity?</h2>
        <p>
          The International Space Station has been continuously inhabited since 2000, and
          microbial surveys keep turning up the same kinds of communities living on cabin
          walls, air filters, and the water systems: <em>Staphylococcus</em>,{" "}
          <em>Bacillus</em>, and gut-flora relatives like <em>E. coli</em>. They don't
          just survive up there — they grow into <strong>biofilms</strong> (sticky
          surface-bound mats of cells), and once they're on a surface they're notoriously
          hard to kill. Worse, ISS biofilms have been documented growing in patterns and
          showing antimicrobial-resistance levels that don't match what the same strains
          do on Earth. That's the part that pulled us in — it's not a theoretical
          concern, it's an ongoing operational one for crew health and equipment
          reliability.
        </p>
      </section>

      <section id="biosensors" className="section">
        <h2>How do you detect bacteria?</h2>
        <p>
          One of the most promising tools for catching bacteria on a surface is an{" "}
          <strong>antimicrobial-peptide biosensor</strong>. Antimicrobial peptides (AMPs)
          are short chains of amino acids — small proteins — that carry a positive
          electrical charge. Bacterial cell membranes carry a negative one. Opposite
          charges attract, so when an AMP and a bacterium meet they stick. Biosensor
          chips coat their surfaces with a dense lawn of immobilized AMPs and use that
          lawn as a kind of biological velcro: bacteria drifting past get caught, and a
          detector reads out how many landed. This works well on Earth. What we wanted
          to ask is whether it still works the same way in orbit — and if it doesn't, by
          how much.
        </p>
      </section>

      <section id="bacteria-move" className="section">
        <h2>How do bacteria move toward a surface?</h2>
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

        <p>The four mechanisms, in plain language:</p>

        <h3>Sedimentation — dense stuff falls</h3>
        <p>
          Drop a handful of sand into a glass of water and the grains drift to the
          bottom. They drift because they're denser than water, and gravity pulls denser
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
          place. That's a convection current. The same physics is why air bubbles rise
          in carbonated water — the gas is less dense than the liquid around it. In any
          real chamber on Earth, tiny density gradients (from temperature, from
          dissolved stuff, from the bacteria themselves) drive slow bulk flows that
          constantly stir the fluid and carry cells around. Take gravity away and those
          flows stop. The bubbles stay where they are. The soup just sits there.
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

        <p>
          So on Earth, all four mechanisms combine to deliver bacteria onto surfaces.
          In orbit, you're down to the bottom two: random thermal drift, and active
          swimming. Our experiment asks one question: <strong>is that enough?</strong>{" "}
          Does an AMP biosensor still catch bacteria when it's lost the two transport
          mechanisms it depended on the most? If yes, every Earth-tested spacecraft
          biosensor can deploy as-is. If no, every one of them probably needs to be
          rethought. Either way, somebody should check — and that's what we proposed
          to do.
        </p>
      </section>

      <section id="watch" className="section">
        <h2>Watch what happens</h2>
        <p>
          We built this so you don't have to take our word for it — here are the four
          mechanisms running side by side. 1g on the left, microgravity on the right.
          Drag the gravity slider toward zero and watch the 1g pile-up at the chip stop.
          Toggle individual mechanisms to see how each one contributes (or doesn't). The
          capture counter on each chamber is the number of cells that have stuck to the
          chip so far.
        </p>
        <p>
          Worth saying out loud: this is an illustrative simulation, not a physical
          model of the experiment. The transport math is right in shape, but the numbers
          are tuned for what reads well on screen. The real exposure window in the
          proposal is three days, not eighty seconds.
        </p>
        <div className="scene-frame">
          <ChamberScene />
        </div>
      </section>

      <section id="design" className="section">
        <h2>Why we designed it this way</h2>
        <p>
          Each of the design choices below comes back to the same question we kept
          asking ourselves: how do we make sure microgravity is the <em>only</em> thing
          that could explain a difference in capture? If two of our chips end up
          different, we want it to be because of gravity — not the strain, not the chip
          prep, not calibration drift between flight and ground.
        </p>
      </section>

      <section id="strain" className="section">
        <h2>Which bacteria, and why that one?</h2>
        <p>
          Wild-type E. coli reach surfaces two ways: the passive transport mechanisms in
          the chamber above, and active adhesion through fimbriae — hair-like appendages
          that bind to almost any surface. If we let fimbriae contribute, we'd never
          know whether a cell stuck because of the AMP or because it's just naturally
          sticky. So we picked a ΔfimA knockout strain — specifically <em>E. coli</em>{" "}
          K-12 (Keio Collection JW1881) — that lacks the major fimbrial subunit.
          Anything that reaches the chip and stays there has to be AMP-mediated.
        </p>
      </section>

      <section id="chip" className="section">
        <h2>What's on the chip?</h2>
        <p>
          The capture surface is a layered stack. Streptavidin tetramers anchor to a
          glass chip; biotinylated AMPs lock into the streptavidin (the
          biotin–streptavidin bond is one of the strongest known non-covalent bonds,
          which is why this kind of construction is everywhere in lab biology);
          polyethylene glycol fills the gaps to block anything that isn't AMP-binding
          from sticking. We carry two different AMPs — LL-37, which humans make, and
          Magainin I, which comes from frog skin — plus streptavidin-only chips as a
          "what would stick if there were no AMP at all?" negative control. The point
          of having the controls on the same flight is so the comparison is on-orbit
          vs on-orbit, not on-orbit vs lab — no calibration drift to argue about.
        </p>
        <div className="diagram-frame">
          <ChipStackDiagram />
        </div>
      </section>

      <section id="return" className="section">
        <h2>How does it come back to Earth?</h2>
        <p>
          The capture itself happens on orbit, but we deliberately do all the
          measurement on the ground. The fix-on-orbit-then-return choice is what makes
          that possible. On Day U-2 — two days before the capsule undocks from the ISS
          — the crew opens Valve B, and formalin (10% neutral buffered formalin, the
          standard tissue fixative) floods the chamber where the chips are. Formalin
          crosslinks proteins in place, so every bacterium that's bound to the chip at
          that moment is chemically locked there. Anything that hasn't stuck yet gets
          killed before it can stick on the trip down. So when the chips come back to
          the lab, they're frozen — not literally, chemically — in whatever state they
          actually reached on orbit. No risk of re-entry conditions mucking up the
          numbers.
        </p>
      </section>

      <section id="elisa" className="section">
        <h2>How do you count what was caught?</h2>
        <p>
          The chips come back fixed, and from there it's a standard <strong>sandwich
          ELISA</strong> on the bench. A primary antibody specific to E. coli surface
          antigens binds any bacterium stuck to the chip; a secondary antibody linked to
          horseradish peroxidase (HRP) binds the primary; a colorless TMB substrate is
          added and the enzyme turns it blue. The intensity of the blue, read at 450 nm
          in a spectrophotometer, is proportional to how much enzyme is on the chip,
          which is proportional to how many bacteria were captured. A standard curve —
          built from chips dosed with known cell concentrations — converts the
          absorbance number into <strong>cells per square centimeter</strong>.
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

      <section id="tube" className="section">
        <h2>What does the testing tube look like?</h2>
        <p>
          We didn't get to pick the hardware shape — SSEP gives you a Rhodium RhFET-01
          tube and you fit your experiment inside it. The whole thing is about the size
          of a sturdy marker pen. Three chambers, two crew-operated valves, 20 mL of
          total fluid capacity. Everything you've read about — the freeze-dried
          bacteria, the AMP chips and PBS/BS3 solution, the formalin — has to fit in
          this volume.
        </p>
        <div className="diagram-frame">
          <TubeDiagram />
        </div>
      </section>

      <section id="crew" className="section">
        <h2>How much crew time does it take?</h2>
        <p>
          Astronaut time on the ISS is one of the most expensive resources in the solar
          system. The experiment is designed around the assumption that crew can spare
          almost none of it. The entire interactive portion of the protocol is two
          valve turns, fifteen seconds of gentle shaking each.
        </p>
        <div className="diagram-frame diagram-frame--narrow">
          <CrewTimeline />
        </div>
      </section>

      <section id="risk" className="section">
        <h2>What if something goes wrong?</h2>
        <p>
          A ground-based experiment can be repeated when something breaks. This one
          can't. If a valve sticks, if a chip detaches, if the fixative leaks early —
          there's no second sample on orbit and no way to send a correction. So a lot
          of our design choices (freeze-drying the bacteria so they survive launch
          dormant, the BS3 crosslinker that covalently locks captured cells in place,
          the formalin fixation before re-entry) are basically hedges against a single
          point of failure. The design is disciplined because it has to be.
        </p>
      </section>

      <section id="outcomes" className="section">
        <h2>What would either result have meant?</h2>
        <p>
          The honest answer is: we don't know. We didn't get to fly it. But the reason
          we cared about this question — and the reason we'd still like to see somebody
          run it — is that <em>both</em> possible outcomes are useful.
        </p>

        <h3>If microgravity reduces capture</h3>
        <p>
          That would mean diffusion + swimming alone can't do the job sedimentation +
          convection were doing on Earth, and every AMP biosensor that was calibrated on
          a benchtop is reading the wrong number in orbit. Practically: spacecraft
          biosensors would need longer exposure windows, denser AMP coatings, or
          recalibrated detection thresholds before they're trustworthy for contamination
          monitoring. That's not a small adjustment — it's a different engineering
          brief.
        </p>

        <h3>If capture is statistically equivalent</h3>
        <p>
          That would mean active bacterial swimming is doing enough work on its own to
          compensate for the missing transport modes, and current Earth-tested designs
          can probably deploy as-is. It would also be quietly interesting on its own
          terms: it would say something specific about how much active microbial
          transport contributes relative to the passive mechanisms, which isn't well
          characterized.
        </p>

        <h3>What we couldn't have answered even with a flight</h3>
        <p>
          A few things we'd want to know but couldn't, even with the experiment as
          designed: whether different bacterial species behave differently (we picked
          one strain to keep the variable count down); whether longer exposures change
          the picture (our window is three days, which is short for biofilm formation);
          whether the formalin fixation itself perturbs the count (it shouldn't, but we
          can't verify on orbit). If this ever does fly — ours or someone else's —
          those would be the natural next questions.
        </p>

        <h3>Why we're putting this up anyway</h3>
        <p>
          A project that didn't fly is easy to file away and forget. We think this
          particular question is worth keeping in front of people — both because biofilm
          monitoring in long-duration spaceflight is a real problem someone will need to
          solve, and because the transport-vs-chemistry distinction we kept coming back
          to seems load-bearing. If you read this and have a way to get it tested for
          real, we'd love to hear about it.
        </p>
      </section>

      <footer className="site-footer">
        <p>
          Built by a student team from the AT³ Micro and Nanotechnology Program at
          Cal Poly Pomona — PI Elizabeth Osborn, with Frank Puga-Raya, Steven Picazo,
          Jesus Coca, Alejandro Lopez, Damian Palacios-Rosas, and Maya Ramirez — advised
          by Michael Pham (Bronco Space Lab, Cal Poly Pomona) and Dr. Chris Buser
          (BioCubic / Bridgeport University faculty).
        </p>
        <p>
          Source proposal: <em>Comparative Capture of E. coli by Antimicrobial-Peptide
          Biosensors in Microgravity.</em> Submitted to SSEP Mission 21 (NCESSE),
          honorable mention — not selected to fly.
        </p>
      </footer>
    </main>
  );
}

export default App;
