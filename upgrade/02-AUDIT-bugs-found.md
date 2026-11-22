# 02 · Audit: bugs and gaps found in the repo

Audited from commit `871268e` of `for4testing-stuff/testing_stuff`. Items marked VERIFIED were reproduced or confirmed by search. Items marked CHECK were not fully traced; the AI must confirm before fixing.

## A. Functional bugs

| # | Where | Problem | Status |
|---|---|---|---|
| A1 | `js/data.js` `formatINR` | Negative numbers between -100 and -999.99 print as `-,123.45` (the minus sign gets treated as a digit group). `-12.5` and `-1234.5` are fine. Fix by formatting the absolute value and prepending the sign. | VERIFIED (ran in Node) |
| A2 | `index.html`, `stock.html` | `ZPHR` has `pe: -14.2` and the raw value is printed. A negative P/E should display as `NM` (not meaningful) or `—` with a tooltip "Company is loss-making". | VERIFIED in data and templates |
| A3 | All pages (`#current-date`) | The masthead date is hardcoded as "WEDNESDAY, MARCH 25, 2026 — VOL. XXIV NO. 82" and never updated by JS. It should show today's date (en-IN) and a volume/issue number derived from it. | VERIFIED (only one match, in HTML) |
| A4 | Trade modal (`code/animations.js` `openTradeModal`) | I found focus-on-open but no `role="dialog"`, `aria-modal`, Escape-to-close or Tab focus trap in that function. The spec (`docs/05`) requires a focus trap. Confirm and implement, and return focus to the trigger on close. | CHECK |
| A5 | Ticker | Content is duplicated for the infinite scroll, so every `data-price-symbol` / `data-change-symbol` appears twice. Make sure live-price updates target all copies and the duplicate copy is `aria-hidden="true"`. | CHECK |
| A6 | `qa.html` | The page says every check is PASS, including accessibility, but the pages contain zero `aria-*` attributes. The report is not trustworthy. | VERIFIED |

## B. Accessibility gaps (all VERIFIED by grep unless noted)

| # | Problem |
|---|---|
| B1 | Zero `aria-*` attributes on all five pages. |
| B2 | No skip-to-content link. |
| B3 | The only `:focus` style in `css/styles.css` is on `.search-input`. No `:focus-visible` ring for links, buttons, star buttons, tabs or table rows. |
| B4 | The search icon is the emoji 🔍 (5 pages). It breaks the project's own "no emoji icons" rule and has no accessible name. Replace with an inline SVG, `aria-hidden="true"`, and label the input. |
| B5 | Star buttons only contain `★`/`☆`. Add `aria-label="Add MRDN to watchlist"`, `aria-pressed`, and a ≥ 44×44 px hit area. |
| B6 | Data tables have no `<caption>`, no `scope="col"`, no sortable-column semantics (`aria-sort`). |
| B7 | Charts (`js/charts.js`) are SVG/canvas with no text alternative. Add `role="img"` + `aria-label` summary, and a visually-hidden data table or summary sentence. |
| B8 | Search dropdown has arrow-key handling but no `role="combobox"`, `aria-expanded`, `aria-controls`, `role="listbox"/"option"`, or `aria-activedescendant`. |
| B9 | Toasts and live price changes need `aria-live="polite"` (toast) and a pause control that is reachable first by keyboard (WCAG 2.2.2). The pause button exists; confirm it is keyboard reachable and labelled. |
| B10 | `<h1>` is the logo on every page, so the page title is an `<h2>`. Make the logo a `<div>`/`<a>` and give each page one real `<h1>`. |
| B11 | Landmarks: confirm `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<footer>` exist on every page; mark the current nav link with `aria-current="page"`. |

## C. Code quality / maintainability

| # | Problem |
|---|---|
| C1 | Inline `style=""` attributes: index 67, stock 55, watchlist 55, learn 38, qa 21. Move to named CSS classes (utility + component). |
| C2 | Each page has its own inline `<script>` (index 44 lines, stock 82, watchlist 124, learn 14, qa 13). The master prompt asked for a shared `js/app.js` and it does not exist. Create it and keep page-specific code in small `js/pages/*.js` files. |
| C3 | The `<head>` (fonts, CSS links) is copy-pasted in 5 files; `js/head-template.html` exists but is not used by anything. Either remove it or generate pages from one source (no build step, so a tiny `app.js` that injects header/footer is acceptable; keep a `<noscript>` fallback). |
| C4 | `body { overflow-x: hidden }` hides layout overflow instead of fixing it. Find the elements that overflow at 320 px and fix them, then remove the global hide. |
| C5 | Two stylesheets are hand-linked on every page. Keep them, but add a short comment header describing what lives where. |
| C6 | `localStorage` is used in `js/data.js` (get/set watchlist and holdings). Verify every call is wrapped in try/catch with an in-memory fallback (file:// and private mode can throw). |
| C7 | Fonts: `Lora` is loaded but the design system lists only Playfair, IBM Plex Mono and Inter. Confirm Lora is actually needed (the CSS uses it as a fallback) and drop unused weights to save bytes. |

## D. Content / UX inconsistencies (VERIFIED by reading)

| # | Problem |
|---|---|
| D1 | The Trade button on the home table always passes `data-trade-action="BUY"` and the label is just "Trade". Make it "Buy" with a secondary "Sell" only when the user holds the stock. |
| D2 | Market-cap values are strings (`'48,230 Cr'`), so they cannot be sorted or filtered numerically. Store numbers (in crore) and format at display time. |
| D3 | The home table has no sorting, filtering or sector chips, and nothing shows which rows are in the watchlist beyond the star. |
| D4 | Nav "Portfolio" links to `watchlist.html#portfolio`. Confirm the hash scrolls and the correct tab becomes active and focused. |
