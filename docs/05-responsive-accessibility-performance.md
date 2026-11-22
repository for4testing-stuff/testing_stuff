# 05 · Responsive, accessibility, performance

## 1. Breakpoints

| Name | Width | Side padding | Notes |
|---|---|---|---|
| Desktop | ≥ 1200 | 56px | Reference layout, pixel-match this first |
| Laptop | 1024–1199 | 40px | Same layout; Home left column 440px; table gaps 28px |
| Tablet | 768–1023 | 32px | Home chart drops under the headline (1 column); tables 1 column each at full width; Stock chart above the fact box |
| Mobile | ≤ 767 | 16px | See below |

Design for 1440, 1024, 768, 390. Test also at 320 and at 1920 (content max-width 1328px, centred, so lines never get too long).

## 2. Mobile layout rules (390px)

* **Masthead:** wordmark left (28px), menu button right (44×44 hit area). Menu panel slides down 8px + fades (250ms); contains nav links (each 52px tall), search, Sign in. Esc/outside tap closes; focus trapped inside while open.
* **Ticker:** 30px tall, 11px text; same behaviour.
* **Home:** kicker → headline (34px, lines array for 390: "Markets close / higher as banks / lead the rally") → summary → index strip as 3 stacked rows (label left, value + change right) → chart (height 240) → tables.
* **Tables become stacked rows:** each row is a 2-line card:
  * line 1: company (bold) ........ price (mono)
  * line 2: ticker (muted) · sparkline · ▲ change%
  * min height 56px, dotted divider. No horizontal scrolling tables.
* **Chart on mobile:** fewer axis labels (4 x, 4 y), annotation text 12px, callouts shortened ("Policy remarks"). Tooltip is anchored at the top of the chart (not under the finger) so the finger never hides it. Drag to scrub.
* **Stock page:** title 34px, price block under the title (left aligned), buttons in a row: Add to Watchlist becomes a 44×44 star icon button with label in `aria-label`; Buy and Sell each take half the width.
* **Fact box** moves below the chart; the news row becomes a vertical list with hairlines.
* **Watchlist:** columns collapse to: star · name/ticker · price/▲% (right aligned) · sparkline hidden. Portfolio card moves above the watchlist (people open this page to see their money first).
* **Donut** 148px, legend below it.
* **Modal** becomes a bottom sheet: `translateY(100%) → 0` (300ms), full width, hard top shadow `0 −5px 0 ink`, handle bar 40×4px ink.
* **Touch targets** ≥ 44×44px. Row tap highlight uses the yellow fill instantly (no sweep on touch; use `@media (hover:hover)` to enable hover-only effects).

## 3. Interaction capability queries

```css
@media (hover: hover) and (pointer: fine) { /* hover sweeps, lifts, tooltips on hover */ }
@media (hover: none) { /* tap states only; tooltips via press-and-hold on charts */ }
```
Never rely on hover for information. Anything shown on hover must also appear on focus and tap.

## 4. Accessibility checklist (WCAG 2.2 AA target)

**Structure**
- [ ] One `<h1>` per page, headings in order.
- [ ] Landmarks: `<header>`, `<nav aria-label="Main">`, `<main id="main">`, `<footer>`. Skip link as first focusable element.
- [ ] Tables use `<table>`, `<th scope="col">`, and `<caption class="sr-only">` ("Top gainers on NSE today").
- [ ] Language `lang="en-IN"`.

**Keyboard**
- [ ] Every interactive thing reachable by Tab in visual order; no positive tabindex.
- [ ] Tabs: arrow keys (roving tabindex) ✅ coded.
- [ ] Chart: focusable, ←/→/Home/End scrubs ✅ coded.
- [ ] Modal: trap, Esc, return focus ✅ coded.
- [ ] Search: combobox pattern, ↑/↓/Enter/Esc.
- [ ] Table rows with links: either the company name is a real `<a>` (best) or row has `tabindex=0` + Enter handler. Prefer the real link and stretch it over the row (`a::after{position:absolute;inset:0}`) so it is a normal link for assistive tech.
- [ ] Focus is **visible** (2px ink outline + yellow halo, 3:1 against every background).

**Colour and text**
- [ ] Contrast per the table in 01. Text on yellow is always ink.
- [ ] Never colour alone: ▲▼ and +/− on every change.
- [ ] Text can zoom to 200% with no loss; no horizontal scroll at 320px (reflow).
- [ ] Don't use `user-scalable=no`.

**Motion**
- [ ] `prefers-reduced-motion` handled in CSS and JS ✅.
- [ ] Ticker can be paused (button + hover + focus) — WCAG 2.2.2.
- [ ] Nothing flashes more than 3 times per second (live flashes are 600ms and 1–4 cells per 2–3s: fine).
- [ ] Auto-updating content (live prices) has a pause control.

**Screen readers**
- [ ] Charts: `role="img"` with an `aria-label` summarising the data ("Nifty 50 intraday, opened 24,216, closed 24,318, high 24,342 at 14:40") plus a visually-hidden data table alternative.
- [ ] Sparklines: `role="img"`, label "Rising trend".
- [ ] Live price cells: `aria-live="off"`. A single polite live region announces "Live prices paused/resumed".
- [ ] Decorative SVG: `aria-hidden="true"`. Icon buttons: `aria-label`.
- [ ] Count-up numbers: the final value is in the DOM from the start (set `aria-label` to the final value so intermediate numbers aren't read).
- [ ] Split-character text: `aria-label` on the parent ✅ coded.
- [ ] Toasts: `role="status"`. Errors: `role="alert"`.

## 5. Performance budget

| Metric | Target |
|---|---|
| Total JS+CSS+HTML per page | < 120 KB uncompressed (≈ 35 KB gzip) |
| Requests | HTML, 1 CSS, 3–4 JS, Google Fonts (2 requests) |
| LCP | < 1.8s on a mid-range phone, 4G |
| CLS | 0 (reserve chart heights; fonts `display=swap` with size-adjusted fallbacks) |
| INP | < 150ms |
| Frame rate | 60fps during all animations (check with DevTools Performance) |

**Rules**
* All graphics are inline SVG; **no images**.
* Animate only transform/opacity/stroke-dashoffset. No `will-change` except the ticker (remove `will-change` once an animation finishes if you add it elsewhere).
* Batch DOM writes in `requestAnimationFrame`; read layout (offsetWidth) *before* writing.
* The live loop updates only the changed text nodes (no `innerHTML` on whole tables).
* Use one `IntersectionObserver` for all reveals.
* Charts re-render only on tab switch or resize (debounced 150ms, ResizeObserver).
* Pause everything when `document.hidden`.
* Fonts: only the needed weights; `<link rel=preconnect>` for both Google hosts.
* Don't ship a framework. Don't ship a chart library.

## 6. Browser support
Latest 2 versions of Chrome, Edge, Safari, Firefox; iOS Safari 16+. Progressive enhancement: View Transitions (Chromium/Safari only) fall back to the fade script; `transform-box: fill-box` is supported by all of these.

## 7. `file://` compatibility
The site must open by double-clicking `index.html`:
* use classic `<script src>` tags in dependency order (data → charts → animations → app), **not** ES modules (blocked on file://);
* relative paths only;
* `localStorage` can throw on file:// in some browsers: wrap in try/catch and fall back to memory.
