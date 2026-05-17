# AMP Capture in Microgravity — Site

Companion website for the SSEP Mission 21 proposal *Comparative Capture of E. coli by Antimicrobial-Peptide Biosensors in Microgravity* (Cal Poly Pomona, Bronco Space Lab). Honorable mention; experiment is theoretical and was not selected to fly.

The site communicates the scientific reasoning behind the proposed experiment: the problem of biofilm contamination on the ISS, the transport-physics mechanism the experiment is designed to probe, and the design choices in the measurement.

## Structure

- Problem — why microgravity changes the calculus for AMP biosensors
- Mechanism — interactive 3D chamber comparing 1g vs µg transport of bacteria toward an AMP-coated surface
- Scientific narrative — chip design, strain choice, ELISA readout, control logic
- Outcomes — what either result would mean for spacecraft biosensor design

## Stack

- Vite + React + TypeScript
- three.js via React Three Fiber (+ drei) for the 3D chamber scene
- SVG for the chip-stack and ELISA-protocol diagrams
- Deployed as a static site on Render

## Source

Source proposal: `AMP_Capture_Final_Submission.pdf` (in repo root).
