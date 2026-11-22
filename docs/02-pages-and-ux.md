# 02 · Pages, UX flows and states

Four pages plus shared chrome. Visual reference for the first three: `reference/Bourse_Daily_Design_Reference.html` (open it, it is the pixel target).

## 0. Shared chrome (every page)

1. **Ticker tape** (34px, ink). 12 items: NIFTY 50, SENSEX, BANK NIFTY, NIFTY IT, five stocks, USD/INR, GOLD, CRUDE. Symbol (Inter bold, tracked) + value (mono) + change (coloured, with ▲▼). Seamless loop, pauses on hover/focus. A visually hidden "Pause ticker" button is the first tab stop after the skip link (WCAG 2.2.2).
2. **Masthead** (92px): wordmark left, nav centre, tools right (search 250px, Sign in). Double rule beneath.
3. **Nav:** Markets · Watchlist · Portfolio · Learn. The active page has a 3px yellow underline. The underline is *one element that slides* to the hovered link and returns to the active link on leave.
4. **Skip link:** "Skip to content", visible on focus only.
5. **Footer:** thin rule, left: page name; right: "Sample data and fictional companies, for demonstration only."

### Search (global)
* Typing filters name **and** symbol, case-insensitive, max 5 results, each row = bold symbol + company name + muted sector.
* ↑/↓ moves highlight (yellow), Enter opens that stock, Esc closes, click outside closes.
* No match: a single muted row, "No stock found for 'xyz'. Try MRDN or Kaveri."
* ARIA: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; list is `role="listbox"`.
* Pressing `/` anywhere focuses the search (hint shown as a small keycap in the field on desktop).

### Sign in
Out of scope for the sample. The button opens the same modal pattern with a name field; on submit the button label becomes "Hi, Aarav". State stored in localStorage (try/catch).

## 1. Home · "Market Today" (`index.html`)

Reading order (this is also the load stagger order):
1. Kicker "Closing report · Fri 20 Nov 2026" + **LIVE ●** indicator and pause/play toggle.
2. Headline (masked line reveal): *Markets Close Higher as Banks Lead the Rally*.
3. One-paragraph summary, max 62ch.
4. Index strip: Nifty 50 / Sensex / Bank Nifty. Each = label, big value, ▲ change (abs and %). Count-up on first view.
5. Intraday chart with tabs 1D/1W/1M/1Y, callouts, prev-close dashed line, last-price flag.
6. Three tables: Top Gainers, Top Losers, Most Active (5 rows each).

**UX decisions**
* The chart is the hero because the page's job is "how did the market do today?" in one glance: headline gives the story, the chart gives the shape, the tables give the names.
* Callouts are written like a sub-editor's margin notes ("11:30 · policy remarks"), in italic serif. They explain *why*, which is what makes this feel like journalism rather than a dashboard.
* Tables rows link to `stock.html?symbol=XXXX`. The entire row is the click target (min 41px tall, passes the 44px touch guidance on mobile where rows grow to 56px).

**States:** loading (skeleton: ink-outlined empty boxes with a slow 1.2s opacity pulse 0.5→1, no shimmer gradient), empty tables (never happens with sample data, but show "No data" in muted italic), market closed (kicker says "Closing report", LIVE dot is grey and static; market open says "Live · 11:42 IST").

## 2. Stock detail (`stock.html?symbol=MRDN`)

Reading order: breadcrumb → company + big price → action buttons → chart + fact box → news.

* Breadcrumb: Markets / Sector / **Company** (company in ink, the rest muted, links underline on hover).
* Header row: kicker "MRDN · NSE · Steel", H1 company, price block right-aligned (46px mono + ▲ change + "Close, 20 Nov").
* Actions: **Add to Watchlist** (yellow), **Buy** (green), **Sell** (outline).
* Chart: candlesticks + volume, tabs 1D/1W/1M/3M/1Y/5Y (default 3M). Crosshair shows O/H/L/C and volume in the tooltip. The last-price flag stays pinned to the right axis.
* Fact box "Key numbers": Open, Day high, Day low, Market cap, P/E, Volume, then the 52-week range bar (fill = current position, red marker, low/high labels).
* "In the news": 3 columns, each = kicker (age · category) + serif headline. Separated by vertical hairlines.
* Unknown symbol: serif headline "We couldn't find that stock." + search field + 4 suggestions. Read `URLSearchParams` and render this state when the symbol is missing or unknown; never show a blank page.

**Data for every company:** generate deterministically from the symbol using `BD.seedOf(symbol)` → same chart every visit. Fields: name, sector, price, change, open/high/low, cap, P/E, volume, 52w low/high, 3 news items.

**Buy/Sell flow:** modal (quantity, price, estimated cost) → Confirm → modal closes → toast "Bought 10 MRDN at ₹1,248.60" → holdings updated in localStorage. Quantity must be ≥1 integer; show inline error under the field (red text with a small "!" in a square, reading "Enter a whole number, 1 or more"). Sell more than owned: disable Confirm and say "You own 60 shares".

## 3. Watchlist and Portfolio (`watchlist.html`)

Left column **My Watchlist** (8 stocks): star toggle, company, price, change, chg %, 30-day sparkline. Right column **My Portfolio**: total value (count-up), today's change, overall P/L, donut + legend, holdings table.

* The first row in the reference is "selected" (full yellow, black star) to show the selected state: clicking a row selects it and updates nothing else; it only highlights.
* Un-starring: pop, wait 350ms, fade-slide the row, collapse its height, update "Your list · N stocks" with a count-down animation. Offer **Undo** in a toast for 5 seconds (re-inserts the row at its old position with the reverse animation).
* **Add stock**: opens the search dropdown anchored to the button; selecting adds the row at the top with a highlighter flash (yellow fades to transparent over 1.2s).
* Empty watchlist: serif line "Nothing on your list yet." + yellow Add stock button + a dashed-outline placeholder row.
* Holdings: Stock, Qty, Invested ₹, P&L ₹ (green/red with sign and arrow). Sorted by value descending. Click row → stock page.
* Donut hover shows the sector value in the centre.

## 4. Learn (`learn.html`)

Newspaper "explainers" page.
* Kicker "The Beginner's Desk", H1 "Markets, explained without the jargon."
* 6 guide cards in a 3×2 grid (2×3 tablet, 1×6 mobile): *What is a share · What is the Nifty · How to read a candlestick · What is P/E · Market orders vs limit orders · What is a mutual fund SIP*.
* Card = `--box`, 1.5px ink border, hard shadow. Content: number in a black square (01…06), serif title, 2-line summary, "6 min read" in mono, small hand-drawn style SVG diagram (a candle anatomy for the candlestick card, etc.), arrow link "Read →".
* Hover: card lifts (−2px,−2px), shadow grows to 7px. Press = same as buttons.
* Candlestick card contains a mini **interactive** candle: hovering labels Open/High/Low/Close with leader lines drawn in via stroke-dashoffset. This is the page's "delight" moment.
* Each guide opens as a simple in-page article (anchor + `:target` styling is acceptable) with a reading-progress bar: a 3px yellow bar at the top of the viewport, `scaleX` bound to scroll (transform only).

## 5. Page-level UX rules

1. **Never move content under the user's cursor.** Live ticks change text only, never row order or column width (mono tabular digits guarantee this).
2. **Every number has context:** sign, arrow, time reference ("Close, 20 Nov").
3. **One yellow thing at a time:** selection, hover, focus and stars use yellow; no decorative yellow.
4. **Keyboard parity:** anything you can do with a mouse (row click, star, chart tooltip, tabs, modal) works with the keyboard.
5. **No dead ends:** every empty/error state has a next action.
6. **Honest simulation:** a persistent footer line and a small "SIMULATED" tag next to LIVE make it clear prices are fake.
7. **Performance budget:** HTML+CSS+JS under 120 KB uncompressed for the whole site, no images (all graphics are SVG), fonts are the only network request.
