# 06 · Build order and QA checklist

## Build order (what to do, in sequence)
1. **Tokens + base CSS:** copy the `:root` variables and reset from `code/animations.css` and the reference HTML.
2. **Shared chrome:** ticker, masthead, nav, footer, skip link. Add `BD.ticker`, `BD.navBar`.
3. **data.js:** ~20 fictional companies (name, symbol, sector, price, change, 52w, news) generated deterministically from `BD.seedOf(symbol)`.
4. **Home** static, then pixel-compare against the reference at 1440 (overlay screenshots at 50% opacity).
5. **Stock page** from `?symbol=`, with the unknown-symbol state.
6. **Watchlist + Portfolio**, localStorage in try/catch with memory fallback.
7. **Learn** page.
8. **Responsive pass:** 1024, 768, 390, 320.
9. **Animations 1 to 8** (docs/03), then string effects.
10. **Animations 9 to 17**, search combobox, modal, toasts with Undo.
11. **Accessibility pass**, then **reduced-motion pass**, then **performance pass**.

## QA checklist (tick every line)
**Visual**
- [ ] Home, Stock, Watchlist match the reference at 1440 within 2px.
- [ ] No gradients, blur shadows, rounded corners or emoji anywhere.
- [ ] Yellow used only for selection, hover sweep, focus, stars, nav underline.
- [ ] Text on yellow is ink everywhere.
**Behaviour**
- [ ] Ticker loops without a jump; pauses on hover, focus and button.
- [ ] Count-ups, draw-ins and reveals run once only.
- [ ] Tab switch morph can be interrupted by a second click.
- [ ] Live ticks touch 1 to 4 cells, flash 600ms, pause button works, nothing ticks in a hidden tab.
- [ ] Un-star shows Undo toast for 5s and Undo restores the row in place.
- [ ] Buy/Sell updates holdings, total and donut; invalid quantity shows an inline message.
- [ ] Search: arrows, Enter, Esc, no-match message, `/` focuses it.
**Responsive**
- [ ] No horizontal scroll at 320, 390, 768, 1024, 1440, 1920.
- [ ] Tables become stacked rows on mobile; touch targets at least 44px.
**Accessibility**
- [ ] Keyboard-only run through every page and the modal.
- [ ] Screen reader reads headings, chart labels, no tick spam.
- [ ] 200% zoom OK. Contrast per docs/01.
**Motion**
- [ ] Reduced motion: final states instantly, ticker scrollable, no flashes.
- [ ] 6x CPU slowdown still usable; 60fps in Performance panel.
**Quality**
- [ ] No console errors; works from file://; under 120 KB per page.
