# 07 · Data model and architecture

## 1. Target file structure
```
index.html stock.html watchlist.html portfolio.html screener.html tools.html
learn.html settings.html about.html 404.html qa.html tests.html
css/
  00-tokens.css      (variables only)
  01-base.css        (reset, typography, utilities)
  02-layout.css      (grid, header, footer, page header)
  03-components.css  (all components + states)
  04-pages.css       (page-specific)
  05-print.css  06-forced-colors.css
code/
  animations.css  animations.js  animation-lab.html  components-lab.html
js/
  core/   storage.js  store.js  bus.js  format.js  i18n.js  motion.js  router.js  a11y.js  sim.js
  data/   companies.js  series.js  news.js  glossary.js  lessons.js  calendar.js
  ui/     shell.js  ticker.js  search.js  palette.js  modal.js  toast.js  tabs.js  table.js  tooltip.js  sheet.js
  charts/ line.js  candle.js  donut.js  bars.js  heatmap.js  sparkline.js  gauge.js  chartkit.js
  features/ watchlist.js  trading.js  portfolio.js  screener.js  alerts.js  tools.js  insights.js  analyst.js
  pages/  home.js  stock.js  watchlist.js  portfolio.js  screener.js  tools.js  learn.js  settings.js
assets/icons.svg
scripts/contrast.html
```
Rules: classic scripts; each file is an IIFE that attaches to one namespace `window.Bourse` (e.g. `Bourse.format`, `Bourse.store`). Load order is documented in a comment block in `shell.js`. No file over 400 lines. No inline `<script>` bodies and no inline `style=""` (except runtime-computed transforms/dimensions set via CSS variables or `el.style.setProperty`).

## 2. Entities (plain objects; all money in ₹ with 2 decimals, market cap in ₹ crore as number)
```js
Company { symbol, name, sector, price, prevClose, mCapCr, pe /*null if loss*/, eps, divYield, beta,
          high52, low52, volume, avgVolume, about, listedOn }
Candle  { t /*epoch ms*/, o, h, l, c, v }
Series  { symbol, range, candles[] }                     // seeded PRNG per symbol (deterministic)
List    { id, name, symbols[], createdAt, order }
Holding { symbol, qty, avgPrice, lots:[{qty, price, t}] } // FIFO lots
Order   { id, symbol, side:'BUY'|'SELL', type:'MARKET'|'LIMIT'|'STOP', qty, limitPrice?, stopPrice?,
          status:'OPEN'|'EXECUTED'|'CANCELLED'|'REJECTED', createdAt, executedAt?, fees, reason? }
Txn     { id, t, type:'BUY'|'SELL'|'FUNDS'|'DIVIDEND'|'FEE', symbol?, qty?, price?, amount, balanceAfter }
Alert   { id, symbol, kind:'ABOVE'|'BELOW'|'PCT_UP'|'PCT_DOWN', value, armed, firedAt? }
Note    { symbol, text, updatedAt }
Screen  { id, name, filters, columns, sort }
Settings{ density, textScale, highContrast, reduceMotion, lang, tickSpeedMs, pauseOnLoad,
          sound, browserNotify, aiKeyInSession:false, includePortfolioInAI:false }
Progress{ lessonsDone[], quizScores{}, streak:{count,lastDay}, bookmarks[] }
```

## 3. Storage
Keys: `bourse.v2.lists`, `.holdings`, `.orders`, `.txns`, `.alerts`, `.notes`, `.screens`, `.settings`, `.progress`, `.cash`, `.recent`, `.schemaVersion`.
Wrapper `Bourse.storage.get/set/remove` always try/catch; on failure uses an in-memory Map and sets a flag so the UI shows "Changes won't be saved in this browser mode". Quota error → toast with Export button. Migrations: `v1` keys `bourse_watchlist` → single List "My watchlist"; `bourse_holdings` → Holding[] with one lot each. Corrupt JSON → back up raw string under `.corrupt.<key>`, reset that key, toast. Validate shape on read (guard functions); never trust stored data.

## 4. State and events
`Bourse.store` = tiny observable store: `get(path)`, `set(path, value)`, `subscribe(path, fn)`, `batch(fn)`. `Bourse.bus` = pub/sub: events `tick`, `price:SYMBOL`, `alert:fired`, `order:executed`, `list:changed`, `settings:changed`, `lang:changed`, `online`, `offline`. UI subscribes; no polling.
Live simulator (`sim.js`): every `tickSpeedMs` (default 3000) update each stock with a seeded random walk (σ from beta, clamped within ±20% of prevClose), publish a single `tick` with a changed-symbols map, batch DOM updates in one rAF. Pausable; auto-pauses when `document.hidden`. Deterministic mode (`?seed=123`) for tests.

## 5. Routing and URL state
No SPA router; real pages. `router.js` only: parse `location.search` and `hash` into an object, `Router.set({range:'1M', tab:'returns'})` updates the URL with `history.replaceState`, and restores state on `popstate`. Screener and Stock tabs/ranges must be shareable.

## 6. Formatting (`format.js`, unit-tested)
- `inr(n, d=2)`: Indian grouping; handles negatives (fixes the `-,123.45` bug), 0, NaN/null → `—`, rounding via integer paise to avoid float drift.
- `inrCompact(n)`: ₹ 12.4 K, ₹ 3.2 L (lakh), ₹ 1.45 Cr, ₹ 2.1 L Cr.
- `signed(n)`: `+1,234.50` / `−1,234.50` (true minus U+2212).
- `pct(n, d=2)`, `arrow(n)` (▲ ▼ ▬ for zero), `change(n, pct)` returns accessible markup with `aria-label="up 12.50 rupees, 1.03 percent"`.
- `pe(v)`: `NM` for null/negative. `dateIST(d)`, `timeIST(d)`, `relTime(d)`.
Tests required: -123.45, -12.5, -1234.5, 0, 99999.999, 1234567.89, 12345678901, NaN, null, undefined.

## 7. Charts toolkit
`chartkit.js` provides scales (linear, time, band), axes, pattern defs, crosshair, tooltip, keyboard handler, data-table renderer, resize observer (debounced), and devicePixelRatio handling for canvas export. Charts draw to SVG (accessibility) except candles > 1000 points, which may use canvas with an off-screen accessible table.

## 8. Coding standards
CSS: cascade layers (`@layer tokens, base, layout, components, pages, utilities;`), BEM-ish names (`.card`, `.card__title`, `.card--stat`), logical properties where useful, no `!important` (except reduced-motion/print), no IDs for styling. JS: `'use strict'`, no globals beyond `Bourse`, small pure functions, JSDoc on public functions, no `innerHTML` with unescaped data (use a tiny `h()` helper and `textContent`), event delegation for tables, `AbortController` for cleanup, `passive` scroll listeners, `IntersectionObserver` for reveals.
Security: escape all user text (notes, list names) on render; limit lengths; sanitise imports; never `eval`/`new Function`; CSP meta tag where possible (`default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:`).
Git: conventional commits (`fix:`, `feat:`, `refactor:`, `docs:`, `test:`).

## 9. Test page (`tests.html`)
A 60-line harness: `test(name, fn)`, `eq(a,b)`, renders PASS/FAIL list with counts. Cover: format, FIFO P&L, fee calc, SIP/CAGR formulas, screener filter logic, alert triggers, storage migration, URL state parse/serialise, i18n fallback, indicator maths (SMA, EMA, RSI at known inputs).
