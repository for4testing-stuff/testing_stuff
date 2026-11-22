# 03 · UI/UX upgrade spec

Principle: keep the printed-newspaper identity (paper, ink, hard shadows, serif headlines, mono numbers). Improve clarity, speed and comfort. Every change below must pass the HARD RULES (no gradients/glass/blur/emoji/dark mode).

## 1. Global
1. **Shared header and footer** injected by `js/app.js` (with `<noscript>` fallback), so nav, search and date are identical on every page.
2. **Skip link** ("Skip to main content") as the first focusable element; visible on focus, yellow background, ink text.
3. **Focus ring**: 3 px yellow outline + 1 px ink offset on every focusable element via `:focus-visible`. Never remove outlines without a replacement.
4. **Design tokens**: add the missing documented tokens (`--box`, `--soft`, `--hi`) if they are absent, and a spacing scale (4, 8, 12, 16, 24, 32, 48) as CSS variables. Replace magic numbers.
5. **Type scale** from `docs/01`; body copy at least 15 px on mobile; numbers always `font-variant-numeric: tabular-nums`.
6. **Masthead date** is real (today, en-IN) and the edition number is derived from it.
7. **Page transitions**: 150 ms fade only; skipped under reduced motion.
8. **Footer**: sample-data disclaimer, last-updated time, links to the five pages.

## 2. Navigation and search
1. Sticky compact header after scrolling 120 px (logo shrinks, nav stays). No layout shift.
2. Active page shown with yellow underline AND `aria-current="page"`.
3. Mobile (< 768 px): nav becomes a labelled "Menu" button opening a full-width panel; trap focus while open; Escape closes.
4. **Search** becomes a proper combobox: type-ahead on symbol, name and sector; highlight the matched text (bold, not colour); show up to 6 results grouped as "Companies" and "Sectors"; Enter opens the first result; Escape clears; "No match for 'xyz'. Try a symbol like MRDN." empty state; keyboard shortcut `/` focuses search (announce it in the placeholder).
5. Replace the 🔍 emoji with an inline SVG icon.

## 3. Home (index.html)
1. **Top strip**: three index cards (Sensex-like, Nifty-like, Bank-like; fictional) with value, signed change, arrow, tiny sparkline. Tabular numbers.
2. **Market status chip**: "Market open / closed" computed from IST time, with the next open time.
3. **Movers**: tabs for Gainers, Losers, Most active; 5 rows each; each row is one big tap target.
4. **Main table**:
   - Click column headers to sort (asc/desc), with `aria-sort`, arrow indicator and a keyboard-operable header button.
   - Sector filter chips (multi-select) and a "Watchlist only" toggle.
   - Sticky header row; sticky first column on mobile.
   - Negative P/E shows `NM`.
   - Row actions: star, "Buy" button; row itself is a link to the stock page.
   - Result count: "Showing 12 of 20 companies" in an `aria-live="polite"` region.
5. **Mobile table**: below 768 px render each row as a card (symbol + name, price, change, small chips) instead of horizontal scroll.
6. Lead story box: shorter headline (max 2 lines on mobile), "Read in Learn" link.

## 4. Stock page (stock.html)
1. Header block: symbol, name, price, signed change, and a "Add to watchlist" button that shows its state ("In watchlist ★ Remove").
2. Chart: range tabs (1D 1W 1M 3M 1Y) with `role="tablist"` and arrow-key navigation; crosshair tooltip also works with keyboard (left/right arrows when chart focused); readable axis labels; "Reset zoom" if zoom exists.
3. Key stats as a definition list (`<dl>`), two columns on desktop, one on mobile; each stat has a one-line plain-English tooltip (P/E, Market cap, 52-week range).
4. 52-week range bar with marker and text equivalent ("₹ 1,245.50 is 37% from the 52-week low").
5. "Similar companies" (same sector) as 3 compact cards.
6. Sticky mobile bottom bar with Buy / Sell / Star so the main action is always reachable.
7. Unknown or missing `?symbol=` shows a friendly "Company not found" state with search and a link home. Never a blank page or console error.

## 5. Watchlist and Portfolio (watchlist.html)
1. Two tabs, "Watchlist" and "Portfolio", deep-linkable with `#watchlist` / `#portfolio`; the tab matching the hash is active and focused on load.
2. Watchlist: drag-free reorder via "Move up / Move down" buttons (keyboard friendly), remove with Undo toast (10 s).
3. Portfolio summary band: Invested, Current value, Day change, Total P&L (signed, arrow, percentage). Donut by sector with a legend that includes values (not colour only).
4. Holdings table: quantity, average price, current price, P&L; sortable; export as CSV button.
5. **Empty states** (illustrated with CSS/SVG only, no photos): "Your watchlist is empty. Star a company to follow it." with a button to browse; "No holdings yet. Place a sample order." with a button.
6. Confirmation before "Clear all", with the count of items affected.

## 6. Trade modal
1. `role="dialog"`, `aria-modal="true"`, labelled by its title; focus trap; Escape closes; returns focus to the trigger.
2. Buy / Sell segmented control (`role="radiogroup"`); quantity stepper with +/- buttons, min 1, max by rule (sell ≤ holding); live order value, brokerage line (fictional 0.03%, shown), and total.
3. Inline validation messages next to the field (not alerts), linked with `aria-describedby`.
4. Success state: "Order placed (sample)" + holdings updated + toast with Undo.
5. Mobile: bottom-sheet presentation (slides up, full width, 16 px padding, handle bar). Skipped animation under reduced motion.

## 7. Learn (learn.html)
1. Sticky table of contents on desktop; collapsible on mobile.
2. Reading progress bar (already exists; make sure it respects reduced motion).
3. Glossary terms underlined with dotted rule; focus or hover shows a one-line definition (works on tap too).
4. "Ask the Analyst" entry point (see `04-AI-FEATURES.md`).

## 8. States (every page)
- Loading: skeleton rows in flat paper tones (no shimmer gradient: use a stepped opacity pulse).
- Error: plain message + Retry button.
- Offline: "You're offline. Showing saved sample data."
- Empty: always has a next action.

## 9. Mobile and touch
- Minimum tap target 44×44 px; 8 px minimum gap between targets.
- No hover-only information; every tooltip has a tap or focus equivalent.
- Test widths: 320, 360, 390, 768, 1024, 1440. No horizontal scroll at any of them.
- Respect safe areas (`env(safe-area-inset-*)`) for the sticky bottom bar.

## 10. Performance
- Fonts: preload the two most-used files, `font-display: swap`, drop unused weights/families.
- Avoid layout shift: reserve space for chart, ticker and tables (set heights or aspect-ratio).
- Animate only `transform` and `opacity`. Pause the ticker when the tab is hidden (`visibilitychange`) and under reduced motion.
- Debounce search to 80 ms; update live prices in one requestAnimationFrame batch.
- Total JS under 60 KB uncompressed excluding fonts.
