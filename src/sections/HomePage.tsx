import { SECTIONS } from "./sections";

export function HomePage() {
  return (
    <>
      <header className="site-header">
        <p className="eyebrow">SSEP Mission 21 · AT³ Micro & Nano Program, Cal Poly Pomona · Honorable Mention</p>
        <h1>Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in Microgravity</h1>
        <p className="subtitle">
          We're a student team from the AT³ Micro and Nanotechnology Program at Cal
          Poly Pomona, with advisors from the Bronco Space Lab (also at Cal Poly
          Pomona) and faculty from Bridgeport University. We put this experiment
          together for SSEP Mission 21 — the program that flies student-designed
          experiments to the ISS. Ours got honorable mention, which means it didn't
          get selected to fly. So everything here is theoretical: what we wanted to
          test, why, and the parts we couldn't answer without actually doing it. The
          question we kept coming back to is whether the{" "}
          <em>physics of how bacteria reach a sensor surface</em> — not the chemistry
          of how they bind to it — is what decides whether AMP-based biosensors can
          be trusted in orbit.
        </p>
      </header>

      <div className="home-intro">
        <p>
          The site is broken into short pages — pick a question to start with. The
          natural order is roughly top-left to bottom-right, but each page stands on
          its own, so jump around as you like.
        </p>
      </div>

      <div className="section-card-grid">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="section-card">
            <h3>{s.title}</h3>
            <p>{s.summary}</p>
          </a>
        ))}
      </div>
    </>
  );
}
