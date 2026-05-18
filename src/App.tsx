import { useEffect, useState } from "react";
import { SectionNav } from "./components/SectionNav";
import { SECTIONS } from "./sections/sections";
import { HomePage } from "./sections/HomePage";
import { SectionPage } from "./sections/SectionPage";
import "./App.css";

function getRouteFromHash(): string | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return SECTIONS.some((s) => s.id === hash) ? hash : null;
}

function App() {
  const [currentId, setCurrentId] = useState<string | null>(() => getRouteFromHash());

  useEffect(() => {
    const onHashChange = () => {
      setCurrentId(getRouteFromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const current = currentId ? SECTIONS.find((s) => s.id === currentId) ?? null : null;

  return (
    <main>
      <SectionNav currentId={currentId} />
      {current ? <SectionPage section={current} /> : <HomePage />}

      <footer className="site-footer">
        <p>
          Built by a student team from the AT³ Micro and Nanotechnology Program at
          Cal Poly Pomona — PI Elizabeth Osborn, with Frank Puga-Raya, Steven Picazo,
          Jesus Coca, Alejandro Lopez, Damian Palacios-Rosas, and Maya Ramirez —
          advised by Michael Pham (Bronco Space Lab, Cal Poly Pomona) and Dr. Chris
          Buser (BioCubic / Bridgeport University faculty).
        </p>
        <p>
          Source proposal: <em>Comparative Capture of E. coli by Antimicrobial-Peptide
          Biosensors in Microgravity.</em> Submitted to SSEP Mission 21 (NCESSE),
          honorable mention — not selected to fly.
        </p>
      </footer>
    </main>
  );
}

export default App;
