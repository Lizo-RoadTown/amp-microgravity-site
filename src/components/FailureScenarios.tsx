import { useState } from "react";

type Outcome = "mitigated" | "partial" | "lost";

interface Scenario {
  id: string;
  failure: string;
  whatHappens: string;
  hedge: string;
  outcome: Outcome;
  outcomeText: string;
  icon: "valve" | "freeze" | "shake" | "leak" | "damage";
}

const SCENARIOS: Scenario[] = [
  {
    id: "valve-a-stuck",
    failure: "Valve A sticks shut",
    whatHappens:
      "Crew opens Valve A on Day U-5, but it doesn't actually release. The bacteria never rehydrate, never reach the chips, and we get a zero signal across every chip.",
    hedge:
      "Our six chips include controls (streptavidin-only and AMP-coated) that all share the same buffer. If Valve A fails, ALL chips read zero — that's diagnostic. We'd know it was a hardware failure, not a microgravity result.",
    outcome: "mitigated",
    outcomeText:
      "Diagnostic: we can tell the experiment didn't run, so we don't mistake it for a real signal.",
    icon: "valve",
  },
  {
    id: "valve-b-stuck",
    failure: "Valve B sticks shut",
    whatHappens:
      "Crew opens Valve B on Day U-2, but the formalin doesn't release. Cells stay alive in Chamber 2 during return — could keep growing, could detach, could move around.",
    hedge:
      "The BS3 crosslinker in Chamber 2's buffer covalently bonds AMPs to bound bacterial proteins during the capture window itself. So cells that bound during the on-orbit exposure are already partially locked, even without formalin.",
    outcome: "partial",
    outcomeText:
      "Partial: BS3 preserves some signal, but counts will be noisy. We'd flag this run and trust the controls less.",
    icon: "valve",
  },
  {
    id: "freeze-dry-dead",
    failure: "Freeze-drying kills the bacteria",
    whatHappens:
      "The freeze-drying process is hard on cells. If the prep isn't right, every cell in Chamber 1 is dead before launch. Valve A opens to a useless slurry.",
    hedge:
      "Pre-flight viability test. We rehydrate a sample of the same freeze-dried batch in the lab and confirm cell count + motility before the experiment ever gets integrated for launch. SSEP standard protocol.",
    outcome: "mitigated",
    outcomeText:
      "Caught on the ground: we never fly a non-viable batch.",
    icon: "freeze",
  },
  {
    id: "reentry-stress",
    failure: "Reentry shakes the chips loose",
    whatHappens:
      "Reentry forces could vibrate the chips inside Chamber 2. If chips move, captured cells could be sloughed off by fluid motion before we get to the bench.",
    hedge:
      "By Day U-2, formalin has already cross-linked every bound cell to its chip surface — the bond is covalent. Even if chips slosh around during reentry, the cells stay put.",
    outcome: "mitigated",
    outcomeText:
      "Locked in: the chemistry is done before the bumpy ride home.",
    icon: "shake",
  },
  {
    id: "early-leak",
    failure: "Formalin leaks into Chamber 2 too early",
    whatHappens:
      "If the seal on Valve B fails during launch vibration or thermal expansion, formalin could contaminate Chamber 2 before crew opens Valve A. Every cell that enters the chamber gets fixed immediately — capture never happens.",
    hedge:
      "Valve B's seal is rated for the full vibration + thermal profile of cargo flights. Pre-flight integration includes leak testing. Beyond that, this one is hard to detect after the fact — all chips would read low, and we couldn't distinguish from a real low-capture result.",
    outcome: "partial",
    outcomeText:
      "Survives but is ambiguous: low signal would be indistinguishable from a real microgravity effect. We'd want a follow-up flight.",
    icon: "leak",
  },
  {
    id: "tube-lost",
    failure: "Tube physically lost during recovery",
    whatHappens:
      "The capsule is recovered, but in handling — at sea, at the staging area, in transport — our tube is damaged or misplaced. We have no chips to image.",
    hedge:
      "Honestly, this is just bad luck. No hedge. SSEP's recovery chain is well-established but it's not zero-risk. Our only protection is that we'd have a second flight opportunity in a future SSEP mission.",
    outcome: "lost",
    outcomeText:
      "Lost: no chips, no data. Re-fly required.",
    icon: "damage",
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
  // damage
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M 6 3 L 14 3 L 11 11 L 17 11 L 8 21 L 11 13 L 5 13 Z" fill="currentColor" />
    </svg>
  );
}

const OUTCOME_META: Record<Outcome, { label: string; symbol: string; cls: string }> = {
  mitigated: { label: "Mitigated", symbol: "✓", cls: "fail-out--mitigated" },
  partial: { label: "Partial impact", symbol: "~", cls: "fail-out--partial" },
  lost: { label: "Experiment lost", symbol: "✗", cls: "fail-out--lost" },
};

export function FailureScenarios() {
  const [selectedId, setSelectedId] = useState<string>(SCENARIOS[0].id);
  const selected = SCENARIOS.find((s) => s.id === selectedId) ?? SCENARIOS[0];

  return (
    <div className="fail-scenes">
      <div className="fail-scenes__grid" role="tablist">
        {SCENARIOS.map((s) => {
          const isActive = s.id === selectedId;
          const meta = OUTCOME_META[s.outcome];
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`fail-card ${isActive ? "fail-card--active" : ""} ${meta.cls}`}
              onClick={() => setSelectedId(s.id)}
            >
              <span className="fail-card__icon" aria-hidden="true">
                <Icon kind={s.icon} />
              </span>
              <span className="fail-card__failure">{s.failure}</span>
              <span className="fail-card__outcome-tag">
                <span aria-hidden="true">{meta.symbol}</span> {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="fail-detail" key={selected.id}>
        <div className="fail-detail__head">
          <h4 className="fail-detail__failure">{selected.failure}</h4>
          <span className={`fail-detail__outcome ${OUTCOME_META[selected.outcome].cls}`}>
            <span aria-hidden="true">{OUTCOME_META[selected.outcome].symbol}</span>{" "}
            {OUTCOME_META[selected.outcome].label}
          </span>
        </div>

        <div className="fail-detail__row">
          <div className="fail-detail__col">
            <h5 className="fail-detail__label">What would go wrong</h5>
            <p className="fail-detail__body">{selected.whatHappens}</p>
          </div>
          <div className="fail-detail__col">
            <h5 className="fail-detail__label">What we did about it</h5>
            <p className="fail-detail__body">{selected.hedge}</p>
          </div>
        </div>

        <p className={`fail-detail__verdict ${OUTCOME_META[selected.outcome].cls}`}>
          {selected.outcomeText}
        </p>
      </div>
    </div>
  );
}
