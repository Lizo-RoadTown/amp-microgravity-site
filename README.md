# AMP Capture in Microgravity — Site

Companion website for the SSEP Mission 21 proposal *Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in Microgravity* (AT3, Cal Poly Pomona, Bronco Space Lab). Honorable mention; experiment is theoretical and was not selected to fly.

The site communicates the scientific reasoning behind the proposed experiment: the problem of biofilm contamination on the ISS, the transport-physics mechanism the experiment is designed to probe, and the design choices in the measurement.

## Structure

- Problem — biofilms on the ISS, AMP biosensors, and a plain-language breakdown of the four bacterial transport mechanisms (two of which vanish in microgravity)
- See it run — interactive 3D chamber comparing 1g vs µg transport, with toggleable mechanisms and a gravity slider
- Why the experiment is designed this way — chip stack, strain choice, valve-gated hardware, sandwich ELISA readout
- What it has to fit through — the tube at scale, the crew interaction timeline, and the no-do-overs nature of spaceflight
- Outcomes — what either result would mean for spacecraft biosensor design

## Stack

- Vite + React + TypeScript
- three.js via React Three Fiber (+ drei) for the 3D chamber scene
- SVG for the chip-stack and ELISA-protocol diagrams
- Deployed as a static site on Render

## Source

Source proposal: `AMP_Capture_Final_Submission.pdf` (in repo root).
