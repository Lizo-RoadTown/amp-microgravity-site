interface Props {
  currentId: string | null;
  onToggleSidebar: () => void;
}

export function TopBar({ currentId, onToggleSidebar }: Props) {
  const inDocs = currentId !== null;
  return (
    <header className="top-bar">
      <div className="top-bar__inner">
        {inDocs && (
          <button
            type="button"
            className="top-bar__menu"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <span aria-hidden="true">☰</span>
          </button>
        )}
        <a href="#" className="top-bar__brand">
          AMP Capture in Microgravity
          {inDocs && (
            <>
              <span className="top-bar__brand-sep">·</span>
              <span className="top-bar__brand-context">docs</span>
            </>
          )}
        </a>
        <nav className="top-bar__links" aria-label="Top navigation">
          {!inDocs && (
            <a href="#microgravity" className="top-bar__link">
              read
            </a>
          )}
          {inDocs && (
            <a href="#" className="top-bar__link">
              home
            </a>
          )}
          <a
            href="https://github.com/Lizo-RoadTown/amp-microgravity-site"
            target="_blank"
            rel="noopener noreferrer"
            className="top-bar__link"
          >
            github <span aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
