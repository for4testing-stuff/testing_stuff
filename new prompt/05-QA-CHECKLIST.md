# 05 · QA checklist (tick only what you actually tested)

For each line report PASS / FAIL / NOT TESTED plus one line of evidence (what you did, what you saw). Do not copy the old `qa.html` results.

## Bugs
- [ ] `formatINR(-123.45)` → `-123.45`; `-1234.5` → `-1,234.50`; `-1234567.89` → `-12,34,567.89`; `0`, `NaN`, `null` handled
- [ ] ZPHR P/E shows `NM` on home and stock page
- [ ] Masthead date equals today's date on all pages
- [ ] Trade modal: focus trap, Escape, focus returns to trigger
- [ ] Ticker copy is `aria-hidden`; live prices update both copies; pause works by keyboard
- [ ] localStorage throws (simulate) → site still works with in-memory fallback
- [ ] `?symbol=` missing or invalid → friendly "not found" state, no console error
- [ ] `#portfolio` deep link opens the Portfolio tab

## Accessibility
- [ ] Skip link works; one `<h1>` per page; landmarks present; `aria-current="page"` on active nav
- [ ] Visible focus ring on every interactive element (tab through each page)
- [ ] Star buttons have accessible names and `aria-pressed`
- [ ] Search is a working combobox with keyboard selection
- [ ] Tables have caption and `scope`; sortable headers expose `aria-sort`
- [ ] Charts have text alternatives
- [ ] Contrast: text on yellow is ink; run a checker on key pairs
- [ ] `prefers-reduced-motion`: no auto-moving content, final states shown
- [ ] Zoom to 200% and 400%: no loss of content or function
- [ ] Screen reader smoke test (NVDA/VoiceOver) on home and trade flow, or state NOT TESTED

## Responsive
- [ ] 320, 360, 390, 768, 1024, 1440 px: no horizontal scroll, nothing clipped
- [ ] Tap targets ≥ 44 px; mobile nav and bottom-sheet modal work
- [ ] Mobile table renders as cards

## Functional
- [ ] Sort, filter and "watchlist only" on home; counts update
- [ ] Add/remove star with Undo; state persists on reload
- [ ] Buy and Sell: validation, holdings update, P&L correct (check one by hand)
- [ ] CSV export opens correctly in a spreadsheet; Indian grouping handled sensibly
- [ ] Every internal link works (crawl all five pages)

## AI
- [ ] Offline (DevTools → Offline): Insights and Ask the Analyst work
- [ ] Banned words check (buy, sell, guarantee, will rise/fall) on all AI strings
- [ ] Cloud AI: key stored in `sessionStorage` only; Forget key works; failures fall back gracefully
- [ ] Portfolio never sent unless "Include my portfolio" is ticked

## Performance
- [ ] Lighthouse desktop and mobile (or manual alternatives noted)
- [ ] No layout shift when fonts, chart or ticker load
- [ ] Ticker pauses when the tab is hidden
- [ ] JS total < 60 KB uncompressed

## Honesty
- [ ] `qa.html` rewritten so it contains only results from this run (with date and what was tested)
- [ ] Anything not tested is listed under "Not tested"
