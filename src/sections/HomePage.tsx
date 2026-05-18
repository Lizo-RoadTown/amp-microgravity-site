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
          <h1 className="hero__title">
            AT³'s honorable mention in the Student Space Experiment Program.
          </h1>

          <p className="hero__subheader">
            By{" "}
            <a
              href="https://ncesse.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NCESSE
            </a>
            , the National Center for Earth and Space Science Education. Advised by{" "}
            <a
              href="https://www.linkedin.com/in/michael-pham-04743a161/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Michael Pham
            </a>{" "}
            (
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
            ),{" "}
            <a
              href="https://www.linkedin.com/in/chris-buser-phd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dr. Chris Buser
            </a>{" "}
            (
            <a href="https://biocubic.com/" target="_blank" rel="noopener noreferrer">
              BioCubic
            </a>
            ), and{" "}
            <a
              href="https://www.linkedin.com/in/jared-ashcroft-44801a87/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dr. Jared Ashcroft
            </a>
            .
          </p>

          <p className="hero__intro">
            We're a student team from the{" "}
            <a
              href="https://www.careersintech.us"
              target="_blank"
              rel="noopener noreferrer"
            >
              AT³ Micro and Nanotechnology Program
            </a>{" "}
            at Cal Poly Pomona, with support from{" "}
            <a
              href="https://pasadena.edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pasadena City College
            </a>
            . We pitched an experiment for SSEP Mission 21 — honorable mention means
            it didn't get selected to fly, but the idea is the part we still wanted to
            share. Briefly: we wanted to know whether antimicrobial-peptide biosensors
            (basically, surfaces that catch bacteria) still work the same way in
            orbit, or whether losing gravity quietly breaks them. We designed an
            experiment to check. This site is the walkthrough.
          </p>

          <p className="hero__meta">
            Proposal:{" "}
            <em>
              Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in
              Microgravity
            </em>
          </p>
        </div>
      </section>

      <section className="start-here">
        <p className="start-here__label">Start reading</p>
        {firstSection && (
          <a href={`#${firstSection.id}`} className="start-here__cta">
            <span className="start-here__direction">Begin →</span>
            <span className="start-here__title">{firstSection.title}</span>
            <span className="start-here__summary">{firstSection.summary}</span>
          </a>
        )}
        <p className="start-here__alt">
          Or open the sidebar (the ☰ menu on the next page) to jump around — each
          page stands on its own.
        </p>
      </section>
    </>
  );
}
