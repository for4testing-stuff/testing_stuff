# 09 · Accessibility, responsive and performance

## 1. Accessibility (target WCAG 2.2 AA)
### Structure
- `lang` set and updated on language switch; `<title>` unique per page ("MRDN · Meridian Agro · BOURSE·DAILY"); one `<h1>`; heading levels never skip; landmarks: `header`, `nav[aria-label]`, `main#main`, `aside[aria-label]`, `footer`; skip link first in DOM.
- Tables: `<caption>` (can be visually hidden), `scope`, `aria-sort` on sortable headers (header is a `<button>`), row headers for symbol cells, `aria-rowcount`/`aria-rowindex` if virtualised (avoid virtualising < 200 rows).
- Lists use `<ul>/<ol>`; stats use `<dl>`; icons `aria-hidden` unless sole content.
### Keyboard
Everything reachable with Tab/Shift+Tab in visual order; no positive tabindex; roving tabindex in tabs, segmented controls, menus, chart crosshair; arrow keys in listbox/combobox/menu; Esc closes overlays and returns focus to the trigger; Enter/Space activate buttons; no keyboard traps except dialogs (trapped by design, with Esc).
Global shortcuts (disabled while typing in inputs; can be turned off in Settings per WCAG 2.1.4): `/` search, `Ctrl/⌘+K` palette, `?` shortcuts, `g h` home, `g w` watchlist, `g p` portfolio, `g s` screener, `b`/`s` buy/sell on stock page, `p` pause live, `[`/`]` chart range.
### Focus
`:focus-visible` ring: 3 px yellow + 1 px ink gap (outline-offset) on every control; never `outline:none` without replacement; focus not obscured by sticky header (`scroll-padding-top` = header height + 8; WCAG 2.4.11); dialogs focus the first field or the title; after delete focus moves to the next row or the list heading.
### Names, roles, states
Star: `aria-pressed`, label "Add MRDN to watchlist"/"Remove MRDN from watchlist". Combobox pattern (role=combobox, aria-expanded, aria-controls, aria-activedescendant, listbox/option, `aria-live` count). Tabs: tablist/tab/tabpanel with `aria-selected`, `aria-controls`. Dialog: `role=dialog aria-modal=true aria-labelledby aria-describedby`. Switch: `role=switch aria-checked`. Toast: `role=status` (errors `role=alert`). Loading regions: `aria-busy=true`. Charts: `role=img` + summary label + data table toggle. Pause button: `aria-pressed`. Price cells: updating text is NOT announced; a single polite region announces alerts and orders only.
### Colour and contrast
Normal text ≥ 4.5:1, large ≥ 3:1, UI components and focus ≥ 3:1. Text on yellow is ink. Colour is never the only signal (arrows, signs, patterns, text labels). Verify with `scripts/contrast.html` (computes ratios for the declared pairs and fails the test page if any < threshold).
### Motion and time
`prefers-reduced-motion` + in-app toggle; ticker and live prices can be paused (WCAG 2.2.2); no flashing > 3/s; toasts last ≥ 6 s, pause on hover/focus, never auto-dismiss errors; session never times out.
### Forms
Visible labels (no placeholder-only), `autocomplete` where relevant, `inputmode="decimal"` for numbers, errors in text next to the field and in a summary on submit, error text linked via `aria-describedby`, focus first invalid field, target size ≥ 24×24 minimum (use 44×44), no drag-only interactions (WCAG 2.5.7: provide buttons).
### Zoom and text
Works at 200% and 400% zoom (reflow at 320 CSS px), text spacing overrides don't clip, text size setting 100/115/130%, no fixed-height text containers, relative units (rem) for type and spacing.
### Screen reader pass (manual script)
NVDA+Firefox or VoiceOver+Safari: home page headings list, nav landmarks, search combobox, sort a table (announces sort), star toggle, open and close trade modal, place an order (announce stamp message), switch tab on stock page, use Ask the Analyst. Record results in `qa.html`; if not run, mark NOT TESTED.

## 2. Responsive
Breakpoints 320 · 480 · 768 · 1024 · 1280 · 1440 · 1920. Test widths: 320, 360, 390, 412, 768, 820, 1024, 1280, 1440, 1920, plus landscape phone (844×390) and tablet portrait/landscape.
Patterns: container queries (with media-query fallback) for cards; tables → cards below 768; filter rail → bottom sheet below 1024; sticky bottom action bar on stock page below 768 with `env(safe-area-inset-bottom)`; horizontal scroll only for tab lists and carousels (with visible controls); images/SVG fluid with `aspect-ratio`; long numbers never wrap (`white-space: nowrap`, abbreviations on narrow cards); no horizontal page scroll at any width; remove `body{overflow-x:hidden}` after fixing offenders.
Touch: tap targets 44 px, 8 px gaps, no hover-only features, `touch-action` set on charts (pan-y) with explicit chart-scrub mode toggle on mobile; `:active` states; pull-to-refresh not hijacked; viewport meta without `user-scalable=no`.
Print: see design system §7.

## 3. Performance budgets
| Metric | Budget |
|---|---|
| JS total (uncompressed, all files loaded on a page) | ≤ 90 KB home, ≤ 120 KB stock |
| CSS total | ≤ 45 KB |
| Fonts | ≤ 3 families, ≤ 6 files, `display=swap`, preload the 2 most used |
| LCP (mid-range phone, 4G) | ≤ 2.0 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| Long tasks during load | none > 100 ms |
| DOM nodes on home | ≤ 1500 |
Tactics: defer all scripts (classic `defer`), split page-specific JS, reserve space for charts/ticker/tables (aspect-ratio, min-height), batch DOM writes in rAF, delegate events, debounce search (80 ms) and resize (150 ms), `content-visibility:auto` on below-the-fold sections, pause timers when hidden, cache computed series, avoid layout thrash (read then write), animate transform/opacity only, SVG paths simplified (max 300 points visible; decimate larger series), no JS-driven scroll listeners without `passive`.
Measurement: Lighthouse (desktop+mobile), DevTools Performance (record load + 10 s of live ticking), Web Vitals via `PerformanceObserver` printed on `qa.html` for the current session.

## 4. Browser support
Evergreen Chrome, Edge, Firefox, Safari (last 2 versions) + Android Chrome and iOS Safari. Provide fallbacks or graceful degradation for: `:focus-visible`, container queries, `inset`, `aspect-ratio`, `clip-path`, SpeechSynthesis (feature-detect), `IntersectionObserver` (fallback: show content), `ResizeObserver`, `structuredClone` (use JSON clone), `Intl.NumberFormat('en-IN')` (own formatter is primary for control).

## 5. SEO and meta (static site basics)
Meta description per page, canonical, Open Graph + Twitter tags (text only), `robots` meta, language alternates for hi, favicon (SVG drawn "B·D" mark), `theme-color` `#F2EFE6`, `manifest.webmanifest`, structured data (Organization-less; use `WebSite` only), `sitemap.xml` and `robots.txt` stubs.
