import { useEffect, useState } from "react";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { SECTIONS } from "./sections/sections";
import { HomePage } from "./sections/HomePage";
import { SectionPage } from "./sections/SectionPage";
import "./App.css";

function getRouteFromHash(): string | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return SECTIONS.some((s) => s.id === hash) ? hash : null;
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>
        The student team: PI{" "}
        <a
          href="https://www.linkedin.com/in/elizosborn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Elizabeth Osborn
        </a>
        , with{" "}
        <a
          href="https://www.linkedin.com/in/frank-puga-raya-895568283/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Frank Puga-Raya
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/steven-picazo-994042225/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Steven Picazo
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/jesus-coca-706191258/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jesus Coca
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/alejandro-lopez-lepe/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alejandro Lopez
        </a>
        ,{" "}
        <a
          href="https://www.linkedin.com/in/damian-palacios-rosas-44767b257/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Damian Palacios-Rosas
        </a>
        , and{" "}
        <a
          href="https://www.linkedin.com/in/maya-evelia-ramirez/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Maya Ramirez
        </a>
        .
      </p>
      <p>
        Advised by{" "}
        <a
          href="https://www.linkedin.com/in/michael-pham-04743a161/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Michael Pham
        </a>{" "}
        (Bronco Space Lab, Cal Poly Pomona),{" "}
        <a
          href="https://www.linkedin.com/in/chris-buser-phd/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dr. Chris Buser
        </a>{" "}
        (BioCubic), and{" "}
        <a
          href="https://www.linkedin.com/in/jared-ashcroft-44801a87/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dr. Jared Ashcroft
        </a>{" "}
        (Director of AT³, Pasadena City College).
      </p>
      <p>
        Proposal:{" "}
        <em>
          Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in
          Microgravity
        </em>
        .
      </p>
    </footer>
  );
}

function App() {
  const [currentId, setCurrentId] = useState<string | null>(() => getRouteFromHash());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentId(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const current = currentId ? SECTIONS.find((s) => s.id === currentId) ?? null : null;
  const isHome = current === null;

  return (
    <>
      <TopBar currentId={currentId} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      {isHome ? (
        <main className="home-shell">
          <HomePage />
          <Footer />
        </main>
      ) : (
        <div className="docs-layout">
          <Sidebar
            currentId={currentId}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="docs-main">
            <div className="page-shell">
              {current && <SectionPage section={current} />}
            </div>
            <Footer />
          </main>
        </div>
      )}
    </>
  );
}

export default App;
