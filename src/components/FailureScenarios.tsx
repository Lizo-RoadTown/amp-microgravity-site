type Outcome = "mitigated" | "partial" | "lost";
type Mitigation = "hardware" | "preflight" | "inherent" | "ground";

interface Scenario {
  id: string;
  failure: string;
  whatHappens: string;
  hedge: string;
  outcome: Outcome;
  outcomeText: string;
  mitigation: Mitigation;
  icon: "valve" | "freeze" | "shake" | "leak" | "damage" | "titer" | "crosslink" | "clock" | "blind";
}

const SCENARIOS: Scenario[] = [
  {
    id: "valve-a-stuck",
    failure: "Valve A sticks shut",
    whatHappens:
      "Crew opens Valve A on Day U-5, but it doesn't release. Bacteria never rehydrate, every chip reads zero.",
    hedge:
      "Six chips include streptavidin-only and AMP controls all sharing one buffer. If Valve A fails, ALL chips read zero — diagnostic of a hardware failure, not a microgravity result.",
    outcome: "mitigated",
    outcomeText: "Diagnostic — we can tell the experiment didn't run.",
    mitigation: "hardware",
    icon: "valve",
  },
  {
    id: "valve-b-stuck",
    failure: "Valve B sticks shut",
    whatHappens:
      "Valve B doesn't release on U-2. Cells stay alive in Chamber 2 during return — they keep growing, could detach.",
    hedge:
      "BS3 crosslinker in Chamber 2's buffer covalently bonds AMPs to bound cells during the capture window. Cells captured on-orbit are already partially locked even without formalin.",
    outcome: "partial",
    outcomeText: "Partial — BS3 preserves some signal; counts noisier.",
    mitigation: "hardware",
    icon: "valve",
  },
  {
    id: "freeze-dry-dead",
    failure: "Freeze-drying kills the bacteria",
    whatHappens:
      "Freeze-drying is hard on cells. Bad prep → every cell dead before launch → Valve A opens to a useless slurry.",
    hedge:
      "We rehydrate a sample of the same freeze-dried batch on the ground and confirm cell count + motility before the experiment is integrated for launch.",
    outcome: "mitigated",
    outcomeText: "Caught on the ground — we don't fly a non-viable batch.",
    mitigation: "preflight",
    icon: "freeze",
  },
  {
    id: "reentry-stress",
    failure: "Reentry shakes the chips loose",
    whatHappens:
      "Reentry vibrations could move chips inside Chamber 2 and slough off captured cells before recovery.",
    hedge:
      "By U-2 the formalin has already covalently locked every bound cell. Even if chips slosh around during reentry, the cells stay put.",
    outcome: "mitigated",
    outcomeText: "Locked in — chemistry is done before the bumpy ride home.",
    mitigation: "hardware",
    icon: "shake",
  },
  {
    id: "early-leak",
    failure: "Formalin leaks into Chamber 2 too early",
    whatHappens:
      "If Valve B's seal fails during launch vibration, formalin contaminates Chamber 2 before Valve A opens — capture never happens.",
    hedge:
      "Valve B is rated for the full vibration + thermal profile of cargo flights; pre-flight integration includes leak testing. Hard to detect after-the-fact, though — low signal here is indistinguishable from a real low-capture result.",
    outcome: "partial",
    outcomeText: "Ambiguous — we'd want a follow-up flight.",
    mitigation: "hardware",
    icon: "leak",
  },
  {
    id: "tube-lost",
    failure: "Tube lost during recovery",
    whatHappens:
      "Capsule recovered but the tube is damaged or misplaced in handling — at sea, at staging, in transport.",
    hedge:
      "No hedge — just bad luck. SSEP's recovery chain is well-established but not zero-risk. Only protection is a second flight opportunity.",
    outcome: "lost",
    outcomeText: "Lost — no chips, no data. Re-fly required.",
    mitigation: "hardware",
    icon: "damage",
  },
  // Pre-flight-mitigated risks (assay layer) ------------------------------
  {
    id: "antibody-titer",
    failure: "Primary or secondary antibody titer is wrong",
    whatHappens:
      "Too concentrated → every well saturates the reader and high counts look the same as medium counts. Too dilute → real cells fall below detection.",
    hedge:
      "Pre-flight: we'd run a dilution series against chips dosed with known cell concentrations, pick the titer that keeps OD inside the linear range, and build the standard curve from it.",
    outcome: "mitigated",
    outcomeText: "Caught pre-flight — titer locked before launch.",
    mitigation: "preflight",
    icon: "titer",
  },
  {
    id: "bs3-concentration",
    failure: "BS3 crosslinker concentration is off",
    whatHappens:
      "Too high and BS3 blocks the AMP binding sites — cells can't grab on. Too low and partially-bound cells slip off during washes.",
    hedge:
      "Pre-flight: BS3 concentration sweep (1–5 mM) on bench-side AMP chips with known E. coli loads. Pick the value with the highest stuck-fraction.",
    outcome: "mitigated",
    outcomeText: "Caught pre-flight — concentration locked before integration.",
    mitigation: "preflight",
    icon: "crosslink",
  },
  // Inherent design risks --------------------------------------------------
  {
    id: "single-timepoint",
    failure: "One time point only — no kinetics",
    whatHappens:
      "We get a single snapshot of capture (the count at Valve B open + ~3 days). We can't tell 'fast then plateau' from 'slow but steady' at the same total count.",
    hedge:
      "Accepted for v1. Would need a multi-chamber re-fly with staggered fixation times — out of scope for a student tube.",
    outcome: "partial",
    outcomeText: "Accepted — re-fly with multi-chamber for kinetics.",
    mitigation: "inherent",
    icon: "clock",
  },
  {
    id: "no-inflight-readout",
    failure: "No in-flight readout",
    whatHappens:
      "We don't know capture succeeded until splashdown. If anything goes wrong on orbit, we don't learn about it for weeks.",
    hedge:
      "Accepted. On-orbit imaging would need flight-qualified hardware and crew time beyond student-budget scope.",
    outcome: "partial",
    outcomeText: "Accepted — needs on-orbit hardware to fix.",
    mitigation: "inherent",
    icon: "blind",
  },
];

function Icon({ kind }: { kind: Scenario["icon"] }) {
  if (kind === "valve") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <rect x="4" y="9" width="16" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        <line x1="12" y1="3" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" />
        <line x1="9" y1="3" x2="15" y2="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "freeze") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" />
        <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "shake") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M 5 12 Q 8 6 11 12 T 17 12 T 23 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 1 12 Q 3 8 5 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "leak") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M 12 3 Q 8 9 8 14 a 4 4 0 0 0 8 0 Q 16 9 12 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "titer") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <rect x="9" y="3" width="6" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="13" width="6" height="4" fill="currentColor" />
        <line x1="9" y1="9" x2="6" y2="9" stroke="currentColor" strokeWidth="1.2" />
        <line x1="9" y1="13" x2="6" y2="13" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 6 19 Q 12 21 18 19" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "crosslink") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <circle cx="7" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10.5" y1="12" x2="13.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="7" y1="8.5" x2="7" y2="5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="17" y1="8.5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "clock") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="12" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "blind") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M 3 12 Q 12 4 21 12 Q 12 20 3 12 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  // damage
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M 6 3 L 14 3 L 11 11 L 17 11 L 8 21 L 11 13 L 5 13 Z" fill="currentColor" />
    </svg>
  );
}

const SECTION_META: Array<{
  mitigation: Mitigation;
  title: string;
  blurb: string;
  cls: string;
}> = [
  {
    mitigation: "hardware",
    title: "Hardware risks",
    blurb:
      "Physical failures during flight — stuck valves, leaks, vibration, lost tube. Hedged with redundant controls and design margin; some leave a diagnostic signature, others don't.",
    cls: "fail-section--hardware",
  },
  {
    mitigation: "preflight",
    title: "Pre-flight testing catches these",
    blurb:
      "Things where the right value isn't known until we test on the ground. Pre-flight validation locks them in before launch.",
    cls: "fail-section--preflight",
  },
  {
    mitigation: "inherent",
    title: "Inherent design — accept or redesign for a re-fly",
    blurb:
      "Limitations baked into the v1 experiment that we knowingly accept. Fixing them needs different hardware on a future flight.",
    cls: "fail-section--inherent",
  },
];

const OUTCOME_META: Record<Outcome, { label: string; symbol: string; cls: string }> = {
  mitigated: { label: "Mitigated", symbol: "✓", cls: "fail-out--mitigated" },
  partial: { label: "Partial impact", symbol: "~", cls: "fail-out--partial" },
  lost: { label: "Experiment lost", symbol: "✗", cls: "fail-out--lost" },
};

export function FailureScenarios() {
  return (
    <div className="fail-scenes">
      {SECTION_META.map((section) => {
        const scenarios = SCENARIOS.filter(
          (s) => s.mitigation === section.mitigation,
        );
        if (scenarios.length === 0) return null;
        return (
          <section
            key={section.mitigation}
            className={`fail-section ${section.cls}`}
          >
            <header className="fail-section__head">
              <h3 className="fail-section__title">{section.title}</h3>
              <p className="fail-section__blurb">{section.blurb}</p>
            </header>
            <div className="fail-section__cards">
              {scenarios.map((s) => {
                const meta = OUTCOME_META[s.outcome];
                return (
                  <details key={s.id} className={`fail-card ${meta.cls}`}>
                    <summary className="fail-card__summary">
                      <span className="fail-card__icon" aria-hidden="true">
                        <Icon kind={s.icon} />
                      </span>
                      <span className="fail-card__failure">{s.failure}</span>
                      <span className="fail-card__outcome-tag">
                        <span aria-hidden="true">{meta.symbol}</span> {meta.label}
                      </span>
                    </summary>
                    <div className="fail-card__body">
                      <p className="fail-card__what">{s.whatHappens}</p>
                      <div className="fail-card__hedge">
                        <span className="fail-card__hedge-label">
                          What we did about it
                        </span>
                        <p>{s.hedge}</p>
                      </div>
                      <p className={`fail-card__verdict ${meta.cls}`}>
                        <span aria-hidden="true">{meta.symbol}</span>{" "}
                        {s.outcomeText}
                      </p>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
