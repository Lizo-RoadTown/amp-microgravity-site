import type { SectionDef } from "./sections";
import { SECTIONS } from "./sections";

interface Props {
  section: SectionDef;
}

export function SectionPage({ section }: Props) {
  const idx = SECTIONS.indexOf(section);
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
  const { Body } = section;

  return (
    <>
      <section className="section section--page">
        <p className="section-page__crumb">
          <a href="#">← All sections</a>
        </p>
        <h2>{section.title}</h2>
        <Body />
      </section>

      <nav className="section-pagination" aria-label="Section pagination">
        <div className="section-pagination__slot section-pagination__slot--prev">
          {prev && (
            <a href={`#${prev.id}`} className="section-pagination__link">
              <span className="section-pagination__direction">← Previous</span>
              <span className="section-pagination__title">{prev.title}</span>
            </a>
          )}
        </div>
        <div className="section-pagination__slot section-pagination__slot--next">
          {next && (
            <a href={`#${next.id}`} className="section-pagination__link section-pagination__link--right">
              <span className="section-pagination__direction">Next →</span>
              <span className="section-pagination__title">{next.title}</span>
            </a>
          )}
        </div>
      </nav>
    </>
  );
}
