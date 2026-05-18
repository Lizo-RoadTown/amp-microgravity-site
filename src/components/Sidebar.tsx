import { useEffect, useState } from "react";
import { SECTIONS, SECTION_GROUPS } from "../sections/sections";

interface Props {
  currentId: string | null;
}

export function Sidebar({ currentId }: Props) {
  const [open, setOpen] = useState(false);

  // Close drawer when navigating
  useEffect(() => {
    setOpen(false);
  }, [currentId]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="site-header-bar">
        <button
          type="button"
          className="site-header-bar__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">☰</span>
        </button>
        <a href="#" className="site-header-bar__brand">
          AMP Capture in Microgravity
        </a>
        <span className="site-header-bar__program">AT³ SSEP — Honorable Mention</span>
      </div>

      <aside
        className={open ? "sidebar sidebar--open" : "sidebar"}
        aria-label="Section navigation"
      >
        <a
          href="#"
          className={
            currentId === null
              ? "sidebar__home sidebar__home--active"
              : "sidebar__home"
          }
        >
          Home
        </a>
        {SECTION_GROUPS.map((group) => (
          <div key={group.label} className="sidebar__group">
            <h2 className="sidebar__group-label">{group.label}</h2>
            <ul className="sidebar__list">
              {group.sectionIds.map((id) => {
                const section = SECTIONS.find((s) => s.id === id);
                if (!section) return null;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={
                        id === currentId
                          ? "sidebar__link sidebar__link--active"
                          : "sidebar__link"
                      }
                    >
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
