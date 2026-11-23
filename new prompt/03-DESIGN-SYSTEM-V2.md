# 03 · Design system v2

Concept: a printed financial newspaper with a trading-floor ticker. Flat ink, hard edges, rules, tabular numbers. Anything that would look at home on a glossy fintech landing page is wrong.

## 1. Tokens (define on `:root`; never hard-code values in components)

### Colour
| Token | Value | Use |
|---|---|---|
| `--paper` | #F2EFE6 | page background |
| `--box` | #FBF9F2 | cards, inputs, modals, charts |
| `--soft` | #E4E0D2 | tracks, empty bars, skeleton base, zebra rows |
| `--ink` | #14181A | text, borders, hard shadows, ticker bg, primary button |
| `--ink-2` | #3A3F42 | secondary text where mute is too light (≥ 7:1 on paper) |
| `--mute` | #6B6A60 | labels, axis text (4.74:1 on paper) |
| `--rule` | #9B9886 | dotted rules, grid lines |
| `--gain` | #0F7B4F | up values, Buy |
| `--loss` | #C8372D | down values, LIVE dot, kicker |
| `--hi` | #F5D547 | selection, hover sweep, focus ring, stars, active-nav underline |
| `--tick-up` / `--tick-dn` | #5FD29B / #FF8A7E | only on ticker (black bg) |
| `--info` | #1F4E79 | links in body copy, info icons (8.9:1 on paper) |
| `--warn` | #8A5A00 | warnings text (5.6:1 on box) with a hatch icon |
Chart categorical set (7, colour-blind safe on `--box`; ALWAYS paired with a pattern, see §6): `--c1 #14181A`, `--c2 #0F7B4F`, `--c3 #C8372D`, `--c4 #1F4E79`, `--c5 #8A5A00`, `--c6 #6B6A60`, `--c7 #7A3E8E`.
Contrast rule: text on `--hi` is always `--ink`. Run `scripts/contrast.html` (tiny page) to verify every text/background pair used.

### Spacing, size, shape
- Spacing scale: `--s-1 4px, --s-2 8px, --s-3 12px, --s-4 16px, --s-5 24px, --s-6 32px, --s-7 48px, --s-8 64px, --s-9 96px`.
- Radius: 0 everywhere (square). Exception: LIVE dot and toggle thumb (circle).
- Borders: `--bw-1 1px` (rules), `--bw-2 2px` (boxes, inputs), `--bw-3 3px` (focus ring, header bottom rule).
- Shadows (hard only): `--sh-1 2px 2px 0 var(--ink)`, `--sh-2 3px 3px 0`, `--sh-3 5px 5px 0`, `--sh-4 8px 8px 0` (modals). Pressed state moves element by the shadow offset and sets shadow to 0.
- Z-index scale: `--z-base 0, --z-sticky 100, --z-dropdown 200, --z-overlay 300, --z-modal 400, --z-toast 500, --z-skip 600`.
- Breakpoints: 320, 480, 768, 1024, 1280, 1440, 1920. Content max width 1440, gutters 24 (16 below 768).
- Grid: 12 columns desktop (gap 24), 8 tablet (gap 16), 4 mobile (gap 12).
- Density: `data-density="comfortable|compact"` on `<html>`; compact reduces row height 44→32 and paddings by one step.

### Motion tokens
`--dur-1 80ms`, `--dur-2 120ms`, `--dur-3 180ms`, `--dur-4 240ms`, `--dur-5 360ms`, `--dur-6 600ms`, `--dur-7 900ms`, `--dur-8 1400ms`.
`--ease-out cubic-bezier(.2,.8,.2,1)`, `--ease-in cubic-bezier(.5,0,.8,.2)`, `--ease-io cubic-bezier(.65,0,.35,1)`, `--ease-snap cubic-bezier(.3,1.3,.5,1)` (use sparingly).
Under reduced motion all `--dur-*` become 0.01ms except opacity fades (kept at 120ms).

## 2. Typography
| Role | Font | Notes |
|---|---|---|
| Display / headlines / wordmark | Playfair Display 700/900, italic 700 for annotations | |
| Numbers, symbols, times | IBM Plex Mono 400/500/600 | `font-variant-numeric: tabular-nums; font-feature-settings: "zero" 0` |
| UI, labels, body | Inter 400/500/600/700 | |

Scale (desktop → mobile): Wordmark 38→28; H1 50→32; H2 32→24; H3 22→19; Body 15→15; Small 13→13; Caption/label 11 uppercase +0.12em→11; Number-large 40→28; Number-table 14→14. Line heights: display 1.05–1.2, body 1.55, numbers 1.2. Minimum text size 11 px for uppercase labels only; never below 13 px for sentences. Measure for reading text: 62–72 characters.
Text utilities: `.t-kicker`, `.t-label`, `.t-num`, `.t-num-lg`, `.t-lede`, `.t-byline`, `.t-caption`.

## 3. Iconography
Inline SVG sprite `icons.svg` injected by `app.js`; 24×24 grid, 1.75 px stroke, square caps, `currentColor`, no fill except where stated. Required icons (name): search, menu, close, star, star-fill, plus, minus, chevron-up/down/left/right, arrow-up (▲ glyph variant), arrow-down, sort-asc, sort-desc, filter, bell, bell-off, info, warning, check, clock, calendar, chart-line, chart-candle, chart-bar, pie, download, upload, share, print, trash, edit, drag, link, external, settings, help, keyboard, globe, book, trophy, spark (AI), mic-off/volume, pause, play, refresh, undo, redo, eye, eye-off, lock, wifi-off, home, briefcase, calculator, newspaper, flame (momentum), shield (risk). Each has `aria-hidden="true"` unless it is the only content of a control (then the control has `aria-label`).

## 4. Components and states (build each; show in `components-lab.html`)
Every component lists: anatomy, sizes, states (default, hover, focus-visible, active, disabled, loading, error, selected where relevant), and behaviour.

| Component | Variants / sizes | Key specs |
|---|---|---|
| Button | primary (ink bg, paper text), secondary (box bg, ink border), buy (gain bg), sell (loss bg), ghost (text + underline on hover), icon-only (44×44), loading (stepped dot animation, width locked) | height 40 (44 mobile), border 2px, shadow `--sh-2`; hover: shadow `--sh-3` + translate(-1px,-1px); active: translate(2px,2px) + shadow 0; focus: 3px yellow ring + 1px ink gap; disabled: `--soft` bg, mute text, no shadow, `aria-disabled` |
| Link | inline (info colour + underline), nav, card link | hover draws underline left→right; visited colour not changed |
| Input / textarea / select | default, with prefix/suffix (₹, %, qty), search | box bg, 2px ink border; focus: yellow outline + border stays ink; error: loss border + message with icon + `aria-describedby`; helper text 13px mute |
| Number stepper | − [value] + | 44px buttons; long-press repeat 120ms after 400ms; clamps with shake feedback |
| Checkbox / radio / switch | 24px visual, 44px hit | switch thumb is a square (exception: circle allowed), state also shown by ON/OFF text |
| Segmented control | 2–5 options | sliding ink thumb; `role="radiogroup"`; arrow keys |
| Tabs | underline tabs, boxed tabs | `role=tablist`; roving tabindex; Home/End; selected has yellow underline 3px |
| Chip (filter) | toggle, removable | pressed state ink bg; remove button 24px |
| Badge / tag | gain, loss, neutral, AI, LIVE, NEW, SAMPLE | 11px uppercase, 1px border |
| Card | stat card, story card, company card, index card | box bg, 2px border, `--sh-2`; clickable card is one link covering the card with `::after` |
| Table | dense, comfortable, sortable, sticky header, sticky first column, zebra optional | header 11px uppercase mute; numbers right-aligned mono; row hover yellow sweep (see animation A27); selected row yellow bg + ink text |
| Data list `<dl>` | 2-col stat grid | label above value; tooltip button per label |
| Modal / dialog | md (480), lg (720), fullscreen on mobile | `role=dialog aria-modal`; shadow `--sh-4`; scrim is solid ink at 55% opacity (flat, no blur) |
| Bottom sheet | mobile only | handle bar 40×4; drag-to-dismiss with fallback close button |
| Toast | info, success, error, undo | bottom-left desktop, bottom-center mobile; max 3 stacked; progress bar draining; `role=status` (error `role=alert`) |
| Tooltip / popover | hover+focus+tap | 1-line max 140 chars; dismiss with Escape; never contains links (use popover for that) |
| Dropdown / combobox / menu | search results, sort menu, overflow menu | ARIA 1.2 combobox pattern; typeahead |
| Accordion | single / multiple | `button[aria-expanded]`; height animates via grid-rows trick |
| Skeleton | line, block, table-row, chart | `--soft` base, stepped opacity pulse 1→.6 in 4 steps over 1400ms (no gradient shimmer) |
| Empty state | with illustration, title, text, CTA | CSS/SVG line illustration, dashed marching border |
| Progress | bar, ring (SVG), steps | determinate only; text value always visible |
| Pagination / "Load more" | numbered, load-more | announces "Showing X–Y of Z" |
| Breadcrumb | 3 levels | `nav aria-label=Breadcrumb` |
| Stamp | "EXECUTED (SAMPLE)", "ALERT HIT" | rotated −4°, double border, ink, stamps in with scale 1.4→1 |
| Kbd hint | key caps | mono 12px, 2px border, hard shadow 1px |
| Ticker | marquee + static fallback list | pause on hover/focus; pause button; duplicated half `aria-hidden` |
| Sparkline | 80×24 SVG | no axis, last point dot, arrow glyph next to it |

## 5. Layout patterns
Masthead (date, wordmark, actions) → primary nav (sticky compact) → page header (kicker, H1, lede, actions) → content grid → footer. Section headers use a double rule (2px ink + 1px ink, 3px gap) like a newspaper. Column rules (1px dotted `--rule`) between columns at ≥ 1024. Pull-quote and drop-cap styles available for Learn.

## 6. Charts (no gradients, no colour-only meaning)
- Pattern fills (SVG `<pattern>`): `hatch-45`, `hatch-135`, `dots`, `cross`, `vlines`, `solid`. Each categorical colour is paired with one pattern.
- Area charts use hatch fill at 18% opacity, not a gradient.
- Axes: 11px mono mute; gridlines dotted `--rule`; zero baseline solid ink.
- Tooltips: box bg, 2px ink border, hard shadow, show date, value, signed change with arrow.
- Every chart exposes: `role="img"` + `aria-label` summary; a "View data table" toggle that renders an accessible `<table>`; keyboard: focus chart, ←/→ move crosshair, Home/End, Esc leaves.
- Required charts: line, area-hatch, candlestick, volume bars, sparkline, donut, horizontal bar (sector), stacked bar (shareholding), range bar (52-week), heatmap treemap (sector), histogram (returns), gauge (risk meter, 5 steps).

## 7. Print stylesheet ("Print edition")
`@media print`: remove ticker, nav, buttons; paper white; ink black; show URLs after links; page-break rules for tables; header with date and "Sample data" line. A "Print this page" button on stock, portfolio and learn.

## 8. Forced-colors / high-contrast
Support `@media (forced-colors: active)`: keep borders as `CanvasText`, focus as `Highlight`. Offer an in-app "High contrast (light)" mode that raises `--mute` to `--ink-2` and thickens borders to 3px. This is NOT dark mode.
