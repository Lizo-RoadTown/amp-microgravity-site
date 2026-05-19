import type { FC } from "react";
import { ChamberScene } from "../scenes/ChamberScene";
import { ChipStackDiagram } from "../components/ChipStackDiagram";
import { ElisaDiagram } from "../components/ElisaDiagram";
import { TubeDiagram } from "../components/TubeDiagram";
import { CrewTimeline } from "../components/CrewTimeline";
import { MechanismCard } from "../components/MechanismComparison";
import { BiofilmModule } from "../components/BiofilmModule";
import { AmpCaptureDemo } from "../components/AmpCaptureDemo";
import { StrainComparison } from "../components/StrainComparison";

export interface SectionDef {
  id: string;
  label: string;
  title: string;
  summary: string;
  Body: FC;
}

const MicrogravityBody: FC = () => (
  <>
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
    <p>
      Click a colored patch on the module below to see what's been found where.
    </p>
    <BiofilmModule />
  </>
);

const BiosensorsBody: FC = () => (
  <>
    <p>
      The approach we wanted to try is a sensor built out of{" "}
      <strong>antimicrobial peptides</strong> (AMPs) — short chains of amino acids
      (basically small proteins) that carry a positive electrical charge. Bacterial
      cell membranes carry a negative one. Opposite charges attract, so when an AMP
      and a bacterium meet they stick. The idea is to coat a chip's surface with a
      dense lawn of immobilized AMPs and use that lawn as a kind of biological
      velcro: bacteria drifting past get caught, and a detector reads out how many
      landed.
    </p>
    <p>Click <em>Release bacterium</em> below to see the idea in motion.</p>
    <AmpCaptureDemo />
    <p>
      This kind of design has been demonstrated on Earth. What we wanted to ask is
      whether it still works in orbit — and if it doesn't, by how much.
    </p>
  </>
);

const HowTheyMoveBody: FC = () => (
  <>
    <p>
      The chemistry of "AMP grabs bacterium" doesn't care about gravity. But for the
      chemistry to happen, the bacterium has to physically <em>reach</em> the AMP first.
      On Earth, four different processes nudge bacteria toward a nearby surface.{" "}
      <strong>Two of them only work because gravity exists.</strong> In low earth orbit
      you're not actually "weightless" — the ISS is falling around the planet — but you
      and everything inside the station are falling at the same rate, so locally the
      effect is the same: no <em>down</em>.
    </p>

    <p>The four mechanisms, in plain language:</p>

    <h3>Sedimentation — dense stuff falls</h3>
    <div className="mechanism-inline">
      <MechanismCard name="Sedimentation" />
      <p>
        Drop a handful of sand into a glass of water and the grains drift to the
        bottom. They drift because they're denser than water, and gravity pulls denser
        things down through less dense ones. A bacterium is slightly denser than the
        salt solution it lives in, so it does the same thing — much more slowly (about
        half a micrometer per second for a 1-µm E. coli cell), but continuously,
        forever, as long as gravity is on. In orbit, there is no down. The sand stays
        suspended, the bacteria stop drifting, and one of the two main ways cells
        reach a surface from across a chamber simply turns off.
      </p>
    </div>

    <h3>Buoyant convection — bubbles rise, currents form</h3>
    <div className="mechanism-inline">
      <MechanismCard name="Buoyant convection" />
      <p>
        If you heat the bottom of a pot of soup, the warm liquid at the bottom
        expands, becomes less dense, and rises; the cooler liquid at the top sinks to
        take its place. That's a convection current. The same physics is why air
        bubbles rise in carbonated water — the gas is less dense than the liquid
        around it. In any real chamber on Earth, tiny density gradients (from
        temperature, from dissolved stuff, from the bacteria themselves) drive slow
        bulk flows that constantly stir the fluid and carry cells around. Take gravity
        away and those flows stop. The bubbles stay where they are. The soup just sits
        there.
      </p>
    </div>

    <h3>Brownian diffusion — molecular jiggling (still works)</h3>
    <div className="mechanism-inline">
      <MechanismCard name="Brownian diffusion" />
      <p>
        Even perfectly still water isn't actually still at small scales. Water
        molecules are in constant thermal motion, and they collide randomly with
        anything small enough to feel the impact — including bacteria. The result is a
        jittery, unpredictable drift called Brownian motion. A bacterium suspended in
        water is being kicked in every direction many thousands of times per second,
        and the net effect is a slow random walk through the fluid. This is unchanged
        in orbit. The molecules don't care about gravity.
      </p>
    </div>

    <h3>Flagellar swimming — bacteria with little tails (still works)</h3>
    <div className="mechanism-inline">
      <MechanismCard name="Flagellar swimming" />
      <p>
        Many bacteria, including E. coli, grow long whip-like appendages called{" "}
        <strong>flagella</strong>. They spin them like propellers to push themselves
        through liquid. E. coli swims at roughly 20 micrometers per second — much
        faster than diffusion drifts it at the same scale. Every second or so it
        tumbles randomly and takes off in a new direction. This is also unchanged in
        orbit. The flagella work the same in free-fall as they do on a lab bench.
      </p>
    </div>

    <p>
      So on Earth, all four mechanisms combine to deliver bacteria onto surfaces. In
      orbit, you're down to the bottom two: random thermal drift, and active swimming.
      Our experiment asks one question: <strong>is that enough?</strong> Does an AMP
      biosensor still catch bacteria when it's lost the two transport mechanisms it
      depended on the most? If yes, Earth-tested spacecraft biosensor designs can
      probably deploy as-is. If no, they'd need to be rethought. Either way, somebody
      should check — and that's what we proposed to do.
    </p>
  </>
);

const WatchBody: FC = () => (
  <>
    <p>
      We built this so you don't have to take our word for it — here are the four
      mechanisms running side by side. 1g on the left, microgravity on the right. Drag
      the gravity slider toward zero and watch the 1g pile-up at the chip stop. Toggle
      individual mechanisms to see how each one contributes (or doesn't). The capture
      counter on each chamber is the number of cells that have stuck to the chip so far.
    </p>
    <p>
      Worth saying out loud: this is an illustrative simulation, not a physical model
      of the experiment. The transport math is right in shape, but the numbers are tuned
      for what reads well on screen. The real exposure window in the proposal is three
      days, not eighty seconds.
    </p>
    <div className="scene-frame">
      <ChamberScene />
    </div>
  </>
);

const StrainBody: FC = () => (
  <>
    <p>
      For this experiment we needed bacteria that would behave themselves — meaning,
      anything that ended up stuck to the chip should have stuck because of the AMPs,
      not because the cells were just naturally clingy. Wild-type <em>E. coli</em>
      have <strong>fimbriae</strong> — hair-like appendages that bind to almost any
      surface. That makes them sticky on glass, on plastic, on the AMP chip, on the
      walls of the tube. We can't tell which captures came from the AMPs.
    </p>
    <p>
      Try it both ways: click each cell in the table to test that strain on that
      surface and see what sticks.
    </p>
    <StrainComparison />
    <p>
      So we picked the ΔfimA knockout strain — specifically <em>E. coli</em> K-12
      (Keio Collection JW1881) — that lacks the major fimbrial subunit. Anything that
      reaches the chip and stays there has to be AMP-mediated.
    </p>
    <p>
      There's a second problem: living bacteria don't sit still. If we just packed a
      tube of <em>E. coli</em> onto a rocket, they'd be growing, dying, and sticking
      to things the whole way up. The experiment would be over before the experiment
      started. So we freeze-dry them. They go dormant — alive but inert — until
      astronauts rehydrate them on orbit by opening the first valve on the tube. Once
      water hits them, they wake up and the clock starts.
    </p>
  </>
);

const ChipBody: FC = () => (
  <>
    <p>
      The capture surface is a layered stack. Streptavidin tetramers anchor to a glass
      chip; biotinylated AMPs lock into the streptavidin (the biotin–streptavidin bond
      is one of the strongest known non-covalent bonds, which is why this kind of
      construction is everywhere in lab biology); polyethylene glycol fills the gaps
      to block anything that isn't AMP-binding from sticking. We carry two different
      AMPs — LL-37, which humans make, and Magainin I, which comes from frog skin —
      plus streptavidin-only chips as a "what would stick if there were no AMP at all?"
      negative control. The point of having the controls on the same flight is so the
      comparison is on-orbit vs on-orbit, not on-orbit vs lab — no calibration drift
      to argue about.
    </p>
    <div className="diagram-frame">
      <ChipStackDiagram />
    </div>
  </>
);

const ReturnBody: FC = () => (
  <p>
    The capture itself happens on orbit, but we deliberately do all the measurement on
    the ground. The fix-on-orbit-then-return choice is what makes that possible. On
    Day U-2 — two days before the capsule undocks from the ISS — the crew opens Valve
    B, and formalin (10% neutral buffered formalin, the standard tissue fixative)
    floods the chamber where the chips are. Formalin crosslinks proteins in place, so
    every bacterium that's bound to the chip at that moment is chemically locked there.
    Anything that hasn't stuck yet gets killed before it can stick on the trip down. So
    when the chips come back to the lab, they're frozen — not literally, chemically —
    in whatever state they actually reached on orbit. No risk of re-entry conditions
    mucking up the numbers.
  </p>
);

const CountingBody: FC = () => (
  <>
    <p>
      The chips come back fixed, and from there it's a standard{" "}
      <strong>sandwich ELISA</strong> on the bench. A primary antibody specific to E.
      coli surface antigens binds any bacterium stuck to the chip; a secondary antibody
      linked to horseradish peroxidase (HRP) binds the primary; a colorless TMB
      substrate is added and the enzyme turns it blue. The intensity of the blue, read
      at 450 nm in a spectrophotometer, is proportional to how much enzyme is on the
      chip, which is proportional to how many bacteria were captured. A standard curve
      — built from chips dosed with known cell concentrations — converts the absorbance
      number into <strong>cells per square centimeter</strong>.
    </p>
    <p>
      That last step is what makes the flight-vs-ground comparison quantitative rather
      than qualitative. The chamber scene shows you the difference; the ELISA gives
      you the number.
    </p>
    <div className="diagram-frame">
      <ElisaDiagram />
    </div>
  </>
);

const TubeBody: FC = () => (
  <>
    <p>
      SSEP gives every team the same hardware: a Rhodium RhFET-01 tube about the
      size of a sturdy marker pen, and your job is to fit your experiment inside it. Three chambers, two crew-operated valves, 20 mL of total fluid
      capacity. Everything you've read about — the freeze-dried bacteria, the AMP chips
      and PBS/BS3 solution, the formalin — has to fit in this volume.
    </p>
    <div className="diagram-frame">
      <TubeDiagram />
    </div>
  </>
);

const CrewBody: FC = () => (
  <>
    <p>
      Astronaut time on the ISS is rationed in minutes. SSEP experiments in particular
      are designed assuming crew can spare almost none of it — they're essentially
      passive once installed. Our entire interactive protocol is two valve turns,
      fifteen seconds of gentle shaking each.
    </p>
    <div className="diagram-frame diagram-frame--narrow">
      <CrewTimeline />
    </div>
  </>
);

const RiskBody: FC = () => (
  <p>
    A ground-based experiment can be repeated when something breaks. This one can't.
    If a valve sticks, if a chip detaches, if the fixative leaks early — there's no
    second sample on orbit and no way to send a correction. So a lot of our design
    choices (freeze-drying the bacteria so they survive launch dormant, the BS3
    crosslinker that covalently locks captured cells in place, the formalin fixation
    before re-entry) are basically hedges against a single point of failure. The
    design is disciplined because it has to be.
  </p>
);

const OutcomesBody: FC = () => (
  <>
    <p>
      Both possible outcomes from this experiment are useful. Here's what each one
      would tell us about how AMP biosensors behave in space.
    </p>

    <h3>If microgravity reduces capture</h3>
    <p>
      That would mean diffusion + swimming alone can't do the job sedimentation +
      convection were doing on Earth, and every AMP biosensor that was calibrated on
      a benchtop is reading the wrong number in orbit. Practically: spacecraft
      biosensors would need longer exposure windows, denser AMP coatings, or
      recalibrated detection thresholds before they're trustworthy for contamination
      monitoring. That's not a small adjustment — it's a different engineering brief.
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

    <h3>Where this experiment would stop</h3>
    <p>
      A few questions are bigger than our design. Whether different bacterial species
      behave differently — we picked one strain to keep the variable count down.
      Whether longer exposures change the picture — our window is three days, which
      is short for biofilm formation. Whether the formalin fixation itself perturbs
      the count — it shouldn't, but verifying that needs its own experiment. Those
      are the natural follow-ups.
    </p>

    <h3>Why this matters</h3>
    <p>
      Biofilm monitoring in long-duration spaceflight is a real problem someone will
      need to solve, and the transport-vs-chemistry distinction we kept coming back
      to seems load-bearing. We think the question is worth keeping in front of
      people. If you read this and want to talk about it, we'd love that.
    </p>
  </>
);

export interface SectionGroup {
  label: string;
  blurb?: string;
  sectionIds: string[];
}

export const SECTION_GROUPS: SectionGroup[] = [
  {
    label: "The question",
    blurb: "Why this matters, and what we wanted to try.",
    sectionIds: ["microgravity", "biosensors"],
  },
  {
    label: "The hardware",
    blurb: "The pieces laid out on the table — bacteria, chip, tube.",
    sectionIds: ["strain", "chip", "tube"],
  },
  {
    label: "The procedure",
    blurb: "What happens once it's on orbit and how we'd read the result.",
    sectionIds: ["crew", "return", "counting", "risk"],
  },
  {
    label: "The physics",
    blurb: "The actual question the experiment tests — visualized.",
    sectionIds: ["bacteria-move", "watch"],
  },
  {
    label: "What we'd have learned",
    blurb: "If we'd flown it.",
    sectionIds: ["outcomes"],
  },
];

export const SECTIONS: SectionDef[] = [
  {
    id: "microgravity",
    label: "Why µg?",
    title: "Why microgravity?",
    summary: "Biofilms on the ISS grow differently than on Earth and threaten crew health. That's what got us interested.",
    Body: MicrogravityBody,
  },
  {
    id: "biosensors",
    label: "The approach",
    title: "What we wanted to try",
    summary: "Antimicrobial peptides as a capture layer — biological velcro for bacteria. The thing we wanted to see flown in microgravity.",
    Body: BiosensorsBody,
  },
  {
    id: "strain",
    label: "The bacteria",
    title: "Which bacteria, and why that one?",
    summary: "A ΔfimA knockout strain — no fimbriae, so anything that sticks must have stuck via the AMPs. Plus the freeze-drying step so they survive launch.",
    Body: StrainBody,
  },
  {
    id: "chip",
    label: "The chip",
    title: "What's on the chip?",
    summary: "Layered stack: glass, streptavidin, biotinylated AMPs (LL-37 and Magainin I), PEG backfill. Plus the controls.",
    Body: ChipBody,
  },
  {
    id: "tube",
    label: "The tube",
    title: "What does the testing tube look like?",
    summary: "The Rhodium RhFET-01 tube — three chambers, two valves, 20 mL total. About the size of a sturdy marker pen. Everything has to fit inside.",
    Body: TubeBody,
  },
  {
    id: "crew",
    label: "Crew time",
    title: "How much crew time does it take?",
    summary: "Two valve turns, fifteen seconds of shaking each. About thirty total seconds of astronaut interaction across two days.",
    Body: CrewBody,
  },
  {
    id: "return",
    label: "Coming back",
    title: "How does it come back to Earth?",
    summary: "Formalin fixation on orbit locks every bound cell in place. The chips come home chemically frozen in the state they reached up there.",
    Body: ReturnBody,
  },
  {
    id: "counting",
    label: "Counting",
    title: "How do you count what was caught?",
    summary: "A sandwich ELISA on the bench converts captured cells into cells-per-square-centimeter via a standard curve.",
    Body: CountingBody,
  },
  {
    id: "risk",
    label: "If things break",
    title: "What if something goes wrong?",
    summary: "There's no second sample on orbit. A lot of design choices are hedges against a single point of failure.",
    Body: RiskBody,
  },
  {
    id: "bacteria-move",
    label: "How they move",
    title: "How do bacteria move toward a surface?",
    summary: "Now the physics question. Four transport mechanisms, two of which only exist because of gravity.",
    Body: HowTheyMoveBody,
  },
  {
    id: "watch",
    label: "Watch it",
    title: "Watch what would happen",
    summary: "Interactive 3D chamber showing 1g vs microgravity side by side. Toggle the mechanisms, drag the gravity slider, see the capture pile up.",
    Body: WatchBody,
  },
  {
    id: "outcomes",
    label: "Outcomes",
    title: "What we hoped to learn",
    summary: "We didn't get to fly it, but both possible outcomes were useful. Here's what each would have told us — and what we still wouldn't have known.",
    Body: OutcomesBody,
  },
];
