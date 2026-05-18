import { SECTIONS, SECTION_GROUPS } from "./sections";

const FIRST_SECTION_ID = SECTION_GROUPS[0]?.sectionIds[0] ?? null;
const firstSection = FIRST_SECTION_ID
  ? SECTIONS.find((s) => s.id === FIRST_SECTION_ID)
  : null;

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

      <section className="start-here">
        <p className="start-here__label">Start here</p>
        {firstSection && (
          <a href={`#${firstSection.id}`} className="start-here__cta">
            <span className="start-here__direction">Begin reading →</span>
            <span className="start-here__title">{firstSection.title}</span>
            <span className="start-here__summary">{firstSection.summary}</span>
          </a>
        )}
        <p className="start-here__alt">
          Or use the sidebar to jump around — pages are organized by topic and each one
          stands on its own.
        </p>
      </section>
    </>
  );
}
