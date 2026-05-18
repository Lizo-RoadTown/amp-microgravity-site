import { SECTIONS, SECTION_GROUPS } from "./sections";
import { HeroVisual } from "../components/HeroVisual";

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
          <div className="hero__content">
          <h1 className="hero__title">
            AT³'s honorable mention in the Student Space Experiment Program.
          </h1>

          <p className="hero__intro">
            We're a student team from the{" "}
            <a
              href="https://www.careersintech.us"
              target="_blank"
              rel="noopener noreferrer"
            >
              AT³ Micro and Nanotechnology Program
            </a>
            , and were invited to participate in the{" "}
            <a
              href="https://ncesse.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NCESSE
            </a>{" "}
            Student Space Experiment Program. Our team submitted a proposal about
            antimicrobial-peptide biosensors (basically, surfaces that catch bacteria)
            that asked if they still worked the same way in orbit, or whether losing
            gravity made them less effective. So we designed an experiment to find
            out. This site walks through the whole thing — what it is, how it works,
            and what we wanted to learn.
          </p>

          </div>

          <div className="hero__visual-wrap" aria-hidden="false">
            <HeroVisual />
          </div>
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
      </section>
    </>
  );
}
