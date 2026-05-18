import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "microgravity", label: "Why µg?" },
  { id: "biosensors", label: "Detection" },
  { id: "bacteria-move", label: "How they move" },
  { id: "watch", label: "Watch it" },
  { id: "design", label: "Why this design" },
  { id: "strain", label: "Strain" },
  { id: "chip", label: "The chip" },
  { id: "return", label: "Coming back" },
  { id: "elisa", label: "Counting" },
  { id: "tube", label: "Tube" },
  { id: "crew", label: "Crew time" },
  { id: "risk", label: "If things break" },
  { id: "outcomes", label: "Outcomes" },
];

export function SectionNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <nav className="section-nav" aria-label="Section navigation">
      <ul>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={s.id === activeId ? "section-nav__link section-nav__link--active" : "section-nav__link"}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
