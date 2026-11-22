# Phase 0 Baseline Audit Report (BOURSE·DAILY v2)

- **Date / Time**: March 25, 2026
- **Viewports Tested**: 1440px, 1024px, 768px, 390px, 320px
- **Browser Tooling**: Chromium headless / manual inspection

## Visual & Layout Inspection
1. **1440px**: Home, stock, watchlist, and learn pages match reference layout with crisp ink & paper contrast, solid borders, and hard offset shadows.
2. **1024px / 768px**: Grids collapse cleanly into single columns. Navigation items wrap correctly.
3. **390px / 320px**: No horizontal scroll observed. Ticker bar adapts properly.

## Audit Issues Identified (to be resolved in Phase 1)
1. **Negative number formatting**: `formatINR` needed explicit negative sign handling for currency and changes.
2. **Masthead Date**: Dynamic date calculation verified.
3. **Inline Styles**: Some inline styles remain on element nodes; targeted for CSS classes in Phase 1 architecture refactoring.
4. **Console Errors**: Zero console errors observed on all pages (`index.html`, `stock.html`, `watchlist.html`, `learn.html`, `qa.html`).

## Conclusion
Baseline established successfully. Ready to proceed to Phase 1 (Foundations and bug fixes).
