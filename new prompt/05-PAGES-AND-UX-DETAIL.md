# 05 · Pages and UX detail

Applies to every page: shared header/footer, skip link, one `<h1>`, landmarks, `aria-current` nav, breadcrumb where depth > 1, footer sample-data note, "Last updated hh:mm:ss IST" that ticks with live prices, empty/loading/error/offline states, keyboard shortcuts overlay (`?`), command palette (`Ctrl/⌘+K`), print edition.

Site map: Home `index.html` · Stock `stock.html?symbol=` · Watchlist `watchlist.html` · Portfolio `portfolio.html` · Screener `screener.html` · Tools `tools.html` · Learn `learn.html` (+ `learn.html?lesson=`) · Settings `settings.html` · About/Accessibility `about.html` · 404 `404.html` · QA `qa.html` (honest report).

Primary nav (desktop): Markets · Screener · Watchlist · Portfolio · Tools · Learn. Secondary (right): search, command-palette hint, pause live, settings, language (EN/हिन्दी).

## Global header behaviour
- Row 1 (masthead): date + edition (left), wordmark (center), actions (right). Row 2: nav. Compact sticky mode after 120 px scroll (animation A07).
- ≤ 768 px: row 1 = Menu button, wordmark, search icon button; the menu opens a full-height panel (F07) with nav, quick links (Watchlist count, Portfolio value), language, settings.
- Market status chip (OPEN/CLOSED, IST, next change) lives under the nav on desktop, in the menu on mobile. Sample market hours: 09:15–15:30 IST, Mon–Fri, skipping the sample holiday list.
- Ticker below masthead: pause button always visible at its right end (44 px target).

## 1. Home (`index.html`)
Purpose: in one screen answer "how is the market, what moved, what should I look at".
Layout 1440 (12 cols): Row A: Lead story (cols 1–8) + "Market in one minute" AI box (cols 9–12). Row B: three index cards (4 cols each): value, signed change + arrow, sparkline, day range bar. Row C: Breadth strip (advance/decline meter + sector heat mini-treemap). Row D: Movers tabs (Gainers / Losers / Most active), 5 rows, cols 1–5; "52-week high/low" list, cols 6–8; "Calendar: next 7 days" (results, dividends, holidays) cols 9–12. Row E: Main table (all companies) full width. Row F: Learn teaser (3 cards). 
Main table columns: ★ · Symbol + Name · Sector · Price · Change · 1D spark · Mkt cap · P/E · 52W position · Actions. Column picker (settings icon) with defaults saved. Sorting on all numeric columns; default sort by market cap desc. Filters: sector chips (multi), "Watchlist only", "Held only", search-in-table, P/E "profitable only". Pagination: 10/20/all; "Showing 1–10 of 20" live region.
Layout 1024: Row A stacks (lead 8 cols, AI box 4 cols below index cards); movers 2 cols. Layout 768: single column, tables become cards (≥ 3 key fields per card). Layout 390: index cards become a horizontal snap carousel (dots + prev/next buttons), movers as vertical list, table as cards with swipe actions replaced by explicit buttons.
States: loading (skeletons for cards, table rows), error ("Couldn't load sample data. Retry."), empty filter result ("No companies match. Clear filters" button), offline banner.

## 2. Stock detail (`stock.html?symbol=MRDN`)
Header: breadcrumb (Markets / Sector / Symbol), kicker (sector), H1 company name, symbol chip, live price (large mono), signed change + arrow + %, LIVE dot, market status. Actions: Watchlist toggle (shows lists dropdown if > 1 list), Buy, Sell (disabled when no holding, with tooltip), Set alert, Compare, Share, Print.
Body (desktop 12 cols): Chart card (cols 1–8): toolbar = range tabs (1D 1W 1M 3M 6M 1Y 5Y MAX), chart type (line/area/candle), indicators menu (SMA 20/50, EMA 20, Bollinger, RSI, Volume), compare overlay chips, fullscreen, data-table toggle, download PNG (canvas export). Right rail (cols 9–12): Key stats `<dl>` (Open, High, Low, Prev close, 52W high/low, Mkt cap, P/E, EPS, Div yield, Beta, Volume, Avg volume), 52-week range bar, "Analyst's note" (AI, 3 sentences), "Risk meter" gauge. Below: tabs: Overview (about + peers) · Financials (revenue, profit, margins, ROE, D/E; quarterly bars; annual table) · Returns (1D, 1W, 1M, 3M, 6M, 1Y, 3Y, 5Y vs sector average, bar chart) · Shareholding (promoters, FII, DII, public stacked bar over 4 quarters) · Corporate actions (dividends, splits, bonus; timeline) · News (fictional headlines with sentiment badge) · Depth (sample order book, 5 bids/5 asks) · Notes (private, saved locally).
Mobile: sticky bottom bar (Buy · Sell · ★ · Alert); chart full width at 16:10; stats 1 col; tabs become a horizontally scrollable tablist with fade indicators (solid edge marks, no gradients).
Unknown symbol: "Company not found" state with search field and 3 popular companies.
Keyboard: `b` buy, `s` sell, `w` watchlist toggle, `a` alert, `c` compare, `[` `]` change range, `←/→` crosshair when chart focused.

## 3. Watchlist (`watchlist.html`)
Multiple lists (max 8) as tabs with "+ New list"; rename (inline edit), delete (confirm with count), reorder lists. Each list: table with Symbol, Price, Change, 1D spark, 52W position, Alert status, Note icon, Actions. Bulk select (checkbox column) → Move to list, Remove, Compare (2–3), Export. Per-row: Move up/down buttons (D08), remove with Undo toast, add note (popover), set alert. Add by search inline ("Add a company…" combobox). Share list: copies a URL with the list encoded in the hash (`#list=MRDN,CYBR`), and opening such a link offers "Import this list". Import/export JSON & CSV. Empty: illustration + "Star a company to follow it" + Browse button + "Add popular starters" (adds 5 sample companies).
Summary band: items count, gainers/losers count, best/worst performer today (count-up numbers).

## 4. Portfolio (`portfolio.html`)
Sub-nav tabs: Overview · Holdings · Orders · Transactions · Analytics · Goals.
Overview: summary band (Cash, Invested, Current value, Day P&L, Total P&L, XIRR-style "annualised return", all signed with arrows), allocation donut (by sector) + toggle (by company), top gainers/losers in portfolio, equity curve (value over time from transactions + seeded prices), risk meter.
Holdings: Symbol, Qty, Avg price, LTP, Invested, Current, Day P&L, Total P&L %, Weight bar, Actions (Buy more, Sell, Alert). Sortable; compact density option; CSV export.
Orders: open and executed orders with status chips; cancel pending (confirm); "Order placed" stamps (H03).
Transactions: ledger with filters (date, type, symbol), running balance, CSV export.
Analytics: sector concentration, volatility vs market, best/worst days, diversification score (0–100) with rule explanation, "What-if" slider (market ±10% → portfolio impact, educational), dividends received.
Goals: user defines a target (₹ amount, date); progress ring, required monthly SIP calculation, status ("On track / Behind") with text, not colour only.
Account: starting cash ₹10,00,000 (sample), Add funds (sample), Reset account (type RESET to confirm).
Empty: "No holdings yet" + Place a sample order.

## 5. Screener (`screener.html`)
Left filter rail (collapses to a bottom sheet on mobile): Sector (multi), Market cap range (dual slider + numeric inputs, ₹ Cr), P/E range, Price range, % change (day), 52-week position (near high / near low / middle), Dividend yield min, Profitable only toggle, In watchlist / Held toggles. Presets row: "Value picks", "Momentum", "Near 52-week high", "Near 52-week low", "Large caps", "Loss-making", "Dividend payers". Result table with column picker, sort, count, active filter chips (removable), "Save screen" (name, stored locally), "Share screen" (URL state), export CSV. Empty: "No matches. Relax a filter" with suggestion chips ("Remove P/E filter"). URL state is the single source of truth for filters.

## 6. Tools (`tools.html`)
Tabs: SIP · Lumpsum · CAGR · Brokerage · Position size · Dividend yield · Break-even · Tax (educational) · Currency (sample rates). Each has: labelled inputs with ₹/%/years suffixes, instant results (debounced 120 ms), result card with count-up, chart (growth line with invested vs value, hatch for invested), "Copy result", "Reset", formula disclosure ("How this is calculated"), validation messages. Persist last inputs per tool. Print-friendly.

## 7. Learn (`learn.html`)
Course list (Beginner → Advanced) with progress rings; lesson view with sticky TOC (desktop), reading time, progress bar (A08), glossary terms (G04), inline mini-quiz at end (3–5 MCQs, instant feedback with explanation, score stamp), "Mark complete", bookmarks, streak counter (days in a row, local), "Term of the day", glossary page with A–Z index and search, flashcards mode (flip with Space, ←/→), printable certificate (print stylesheet). "Ask the Analyst" button opens AI panel with the lesson as context (offline answers from the glossary).

## 8. Settings (`settings.html`)
Sections: Appearance (density, text size 100/115/130%, High contrast light, Reduce motion), Language (English / हिन्दी), Live data (tick speed 1s/3s/5s, pause on load, volatility sample level), Notifications (alert sound off by default, browser notifications opt-in), Data (export all JSON, import JSON, reset everything with typed confirmation), AI (Tier 2 key, include portfolio toggle off), Accessibility links, Keyboard shortcuts table. Every setting applies instantly and persists; "Reset to defaults" per section.

## 9. About/Accessibility (`about.html`)
What this is (fictional, educational), data disclaimer, accessibility statement (standards, known limitations, contact via local feedback form), keyboard shortcut reference, credits (fonts), changelog.

## 10. 404 (`404.html`)
Newspaper "ERRATUM" styled message, search field, 4 popular links, back button.

## Cross-page flows (must be tested end to end)
1. Discover → Star → Watchlist → Set alert → alert fires during live sim → banner + toast + bell.
2. Search → Stock → Buy (market order) → Stamp → Portfolio updated → Sell part → Realised P&L recorded.
3. Screener preset → refine → Save screen → Share link → open link in new tab → same results.
4. Learn lesson → Quiz → Complete → Streak updates → Certificate print.
5. Settings: language switch updates all visible strings without reload; density/text size persist.
6. Offline: disable network → site still loads (fonts fall back), banner shown, AI Tier 1 works.

## Microinteraction inventory (add to every relevant component)
Copy-to-clipboard confirmation ("Copied" for 1.5 s inside the button); long-press repeat on steppers; paste sanitising on number fields (strip ₹ , spaces); Enter submits forms; Escape cancels edits; double-click to rename list; drag-and-drop optional with keyboard alternative; remember scroll position on back navigation; focus the first error on invalid submit; "Undo" for every destructive action for 10 s; optimistic UI for star/watchlist; disable-with-reason tooltips instead of hiding actions.
