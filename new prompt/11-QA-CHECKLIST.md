# 11 · QA checklist (report PASS / FAIL / NOT TESTED with one line of evidence each)

Rules: only report what you actually ran. Record tool + version + viewport + date. Don't copy the old `qa.html`. Anything NOT TESTED goes in a "Not tested" list at the end with the reason.

## A. Bugs from the audit
- [ ] `format.inr` cases: -123.45 → `-123.45`; -12.5; -1234.5 → `-1,234.50`; -1234567.89 → `-12,34,567.89`; 0; 99999.999 → `1,00,000.00`; NaN/null → `—`
- [ ] P/E null/negative → `NM` on home, stock, screener, portfolio, AI
- [ ] Masthead date = today; edition number derived
- [ ] Trade modal focus trap, Esc, focus return, scrim click policy
- [ ] Ticker duplicate half is `aria-hidden`; pause works with mouse, keyboard, `p`
- [ ] Storage failure simulated (throwing localStorage): site works, banner shown
- [ ] Invalid/missing `?symbol=` → friendly state, no console error
- [ ] `#portfolio` deep link works
- [ ] No `body{overflow-x:hidden}` left; no overflow at 320
- [ ] Zero inline `style=""` and zero inline script bodies (grep)

## B. Visual and brand
- [ ] No gradients (grep `gradient`), no blur shadows (grep `blur`, `box-shadow` with blur radius), no dark mode, no emoji icons (grep emoji range)
- [ ] Yellow used only for allowed purposes; text on yellow is ink (test hover/selected states)
- [ ] Every price change shows arrow + sign
- [ ] All components exist in `components-lab.html` in every state
- [ ] Pixel check vs reference at 1440 for Home, Stock, Watchlist

## C. Animation (use animation-lab v2)
- [ ] All 60 animations replay and finish without errors
- [ ] Only transform/opacity/clip-path/dashoffset/grid-rows animated (grep + DevTools Layers)
- [ ] Reduced motion (OS setting AND in-app toggle) → every animation shows final state
- [ ] Pause button stops ticker, live prices, marching border, LIVE pulse
- [ ] Tab hidden → timers pause (verify via console counter)
- [ ] No more than 6 concurrent animations (spot-check with Performance panel)
- [ ] No animation blocks input (click during load works)
- [ ] Taste checks in catalog §J all hold

## D. Features (tick each P0/P1 from `06`; list P2/P3 status)
- [ ] A1–A6, A12, B1–B2, B5, B8–B9, B11, B15, B17, B20
- [ ] C1, C3, C4, C6
- [ ] D1–D3
- [ ] E1–E9 (hand-check one buy, one partial sell, FIFO P&L with 3 lots)
- [ ] F1–F2
- [ ] G1–G3, H1–H2, I1–I4
- [ ] J1–J5, J7, J11–J15
- [ ] P2/P3 table: Done / Deferred (reason)

## E. Accessibility
- [ ] Skip link; single H1; landmarks; unique titles; `lang` switches with language
- [ ] Tab through every page: order logical, focus ring always visible and not hidden under sticky header
- [ ] Combobox, tabs, segmented control, menu, dialog, sheet follow ARIA patterns (keyboard script)
- [ ] Tables: caption, scope, aria-sort; star buttons labelled/pressed
- [ ] Charts: label + data-table toggle + keyboard crosshair
- [ ] Contrast report from `scripts/contrast.html` all PASS
- [ ] Zoom 200% and 400%; text-spacing override; text size 130%
- [ ] Forced-colors and high-contrast-light modes usable
- [ ] Screen reader smoke test (or NOT TESTED)
- [ ] Axe or Lighthouse a11y ≥ 95 on every page

## F. Responsive
- [ ] Widths 320, 360, 390, 412, 768, 820, 1024, 1280, 1440, 1920 and landscape phone: no clipping, no horizontal scroll
- [ ] Table→card conversion, filter bottom sheet, sticky action bar, mobile menu
- [ ] Tap targets ≥ 44 px (script check) and 8 px gaps
- [ ] Safe-area insets respected (iOS emulation)

## G. Data, storage and logic
- [ ] `tests.html` all green (format, FIFO, fees, SIP/CAGR, screener, alerts, migration, URL state, i18n, SMA/EMA/RSI)
- [ ] v1→v2 storage migration with seeded old keys
- [ ] Corrupt JSON recovery
- [ ] Export → reset → import round-trip equals original
- [ ] Alerts fire once, re-arm works, survive reload
- [ ] Limit/stop orders trigger on simulated ticks (deterministic seed)
- [ ] Share links (list, screen) reproduce state in a fresh tab

## H. AI
- [ ] Offline (DevTools Offline): insights + Ask the Analyst work
- [ ] Determinism: same input twice → identical text
- [ ] Banned-word scan (EN + HI) → zero hits
- [ ] Advice request → neutral refusal + facts
- [ ] 40-question routing ≥ 90% correct
- [ ] Cloud AI: key only in `sessionStorage`; Forget works; failures fall back; portfolio not sent unless toggled (inspect network)
- [ ] Panel keyboard + screen-reader pass

## I. Performance
- [ ] Lighthouse desktop and mobile on all pages (scores recorded)
- [ ] JS/CSS/font budgets met (report sizes)
- [ ] LCP, CLS, INP from real measurement (state device profile)
- [ ] 10 s live-tick profile: no long tasks > 50 ms, no memory growth > 5 MB
- [ ] No layout shift when ticker, chart, fonts load

## J. Console, links, SEO
- [ ] Zero console errors/warnings on every page and flow
- [ ] Crawl all internal links; no 404s (except intentional 404 test)
- [ ] Meta tags, favicon, manifest, sitemap present

## K. Honesty
- [ ] `qa.html` regenerated from this run: date, tool, viewport, PASS/FAIL/NOT TESTED, evidence
- [ ] README lists features, shortcuts, known limitations
- [ ] CHANGELOG updated per phase
