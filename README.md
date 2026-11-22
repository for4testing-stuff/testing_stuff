# Bourse·Daily: UI/UX and animation spec package

Open `code/animation-lab.html` in Chrome/Edge/Safari first: every animation running on one page.

| Path | What it is |
|---|---|
| 00-MASTER-PROMPT.md | Prompt to give the AI that builds the site |
| docs/01-design-system.md | Colours (with computed contrast), type, spacing, components |
| docs/02-pages-and-ux.md | 4 pages, flows, empty/error states |
| docs/03-animation-spec.md | All 17 animations: timing table, how each works, reduced motion, load timeline |
| docs/04-microinteractions-and-strings.md | Text/string animations, hover/press/feedback details, taste checks |
| docs/05-responsive-accessibility-performance.md | Breakpoints, mobile layouts, WCAG checklist, perf budget |
| docs/06-build-order-and-qa.md | Step-by-step build order and a tick-box QA list |
| code/ | Working library: animations.css, animations.js, charts.js + the lab page |
| reference/ | Original design HTML (3 screens) |

## What is tested vs spec-only
Tested in headless Chrome, no JS errors: ticker, reveals, headline mask, character stagger, scramble, typewriter, count-up, line draw, candle grow, crosshair/tooltip, tab slider and morph, donut sweep/hover, range bar, row highlighter, live prices with pause, buttons, star and row collapse, search dropdown, modal with focus trap, toast with Undo, digit roll, underline draw, reading progress bar.
Spec-only (described, not coded): mobile bottom-sheet modal, empty-state marching border, and the full 4-page site itself (the other AI builds it from the master prompt).

## Notes
- The lab loads Google Fonts; offline it falls back to Georgia/monospace.
- Red/green text on the yellow highlight fails WCAG AA (about 3.6:1), so text on yellow must be ink.
