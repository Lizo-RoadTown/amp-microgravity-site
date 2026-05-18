import { SECTIONS } from "./sections";

export function HomePage() {
  return (
    <>
      <section className="hero" aria-label="Project introduction">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__inner">
          <p className="hero__program">
            An{" "}
            <a href="https://www.careersintech.us" target="_blank" rel="noopener noreferrer">
              AT³
            </a>{" "}
            Student Space Experiment Program project
            <span className="hero__sep">·</span>
            <span className="hero__tag">SSEP Mission 21 — Honorable Mention</span>
          </p>

          <h1 className="hero__title">
            Comparative Capture of <em>E. coli</em> by
            <br />
            Antimicrobial-Peptide Biosensors
            <br />
            in Microgravity
          </h1>

          <p className="hero__tagline">
            A theoretical experiment about whether AMP-based bacteria sensors still work
            in orbit — or whether losing gravity quietly breaks them. Designed by a
            student team, submitted to SSEP, didn't fly. Everything on this site is what
            we wanted to test and why.
          </p>

          <p className="hero__credits">
            Supported by{" "}
            <a href="https://pasadena.edu/" target="_blank" rel="noopener noreferrer">
              Pasadena City College
            </a>
            . Advised by Michael Pham at the{" "}
            <a
              href="https://www.cpp.edu/engineering/labs/bronco-space-lab.shtml"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bronco Space Lab
            </a>
            ,{" "}
            <a href="https://cpp.edu" target="_blank" rel="noopener noreferrer">
              Cal Poly Pomona
            </a>
            , and{" "}
            <a href="https://biocubic.com/" target="_blank" rel="noopener noreferrer">
              Chris Buser
            </a>{" "}
            of BioCubic.
          </p>
        </div>
      </section>

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
