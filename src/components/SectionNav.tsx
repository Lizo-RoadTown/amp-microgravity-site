import { SECTIONS } from "../sections/sections";

interface Props {
  currentId: string | null;
}

export function SectionNav({ currentId }: Props) {
  return (
    <div className="site-header-bar">
      <div className="site-strip">
        <a href="#" className="site-strip__brand">
          AMP Capture in Microgravity
        </a>
        <span className="site-strip__program">AT³ SSEP — Honorable Mention</span>
      </div>
      <nav className="section-nav" aria-label="Section navigation">
        <ul>
          <li>
            <a
              href="#"
              className={
                currentId === null
                  ? "section-nav__link section-nav__link--active"
                  : "section-nav__link"
              }
            >
              Home
            </a>
          </li>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={
                  s.id === currentId
                    ? "section-nav__link section-nav__link--active"
                    : "section-nav__link"
                }
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
