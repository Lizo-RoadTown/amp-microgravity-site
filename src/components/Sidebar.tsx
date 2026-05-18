import { useEffect } from "react";
import { SECTIONS, SECTION_GROUPS } from "../sections/sections";

interface Props {
  currentId: string | null;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ currentId, open, onClose }: Props) {
  // Close drawer when navigating
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
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
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
