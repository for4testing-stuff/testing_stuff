# 01 · Design System

**Concept:** a financial newspaper with a trading-floor ticker. Every decision should feel *printed*: flat ink, hard edges, rules, tabular numbers. If a choice would look at home on a fintech landing page (gradients, glass, glow, soft shadows), it is wrong for this product.

## 1. Colour

| Token | Hex | Use | Never use for |
|---|---|---|---|
| `--paper` | `#F2EFE6` | Page background | Cards (use `--box`) |
| `--box` | `#FBF9F2` | Cards, charts, inputs, modal (one step lighter than paper) | Page background |
| `--ink` | `#14181A` | Text, outlines, hard shadows, ticker background, primary button | Large tinted areas |
| `--gain` | `#0F7B4F` | Rising prices, Buy button | Decoration |
| `--loss` | `#C8372D` | Falling prices, "LIVE" dot, kicker text, logo dot, 52-week marker | Decoration |
| `--hi` | `#F5D547` | **Only** selected row, watchlist star, active-nav underline, focus ring, row hover sweep, "Add to Watchlist" | Backgrounds of sections, charts lines |
| `--mute` | `#6B6A60` | Secondary labels, axis text, column headers | Body text |
| `--soft` | `#E4E0D2` | Empty track of range bar, lightest donut segment | Text |
| dotted rule | `#9b9886` | Row separators, grid lines | |
| ticker up/down | `#5FD29B` / `#FF8A7E` | Only on the black ticker strip (lighter tints for contrast on ink) | Anywhere else |

### Verified contrast (WCAG 2.x, computed)

| Pair | Ratio | Verdict |
|---|---|---|
| ink on paper | 15.5 | AAA |
| mute on paper | 4.74 | AA body |
| gain on paper | 4.60 | AA body |
| loss on paper | 4.52 | AA body (just) |
| gain on box | 5.03 | AA |
| loss on box | 4.93 | AA |
| mute on box | 5.17 | AA |
| white on gain (Buy) | 5.29 | AA |
| white on loss | 5.20 | AA |
| ink on hi | 12.3 | AAA |
| ticker up on ink | 9.5 | AAA |
| ticker down on ink | 7.8 | AAA |
| **loss on hi** | **3.59** | **Fails AA** |
| **gain on hi** | **3.65** | **Fails AA** |
| **mute on hi** | **3.76** | **Fails AA** |

**Rule that comes out of this table:** whenever a row or button turns yellow (selected row, hover sweep), *all* text inside switches to `--ink`. The up/down meaning is still carried by the ▲ ▼ glyphs and +/− signs. This is already coded in `animations.css` (`tr.row-link:hover .up, .dn { color: var(--ink) }`).

Colour is **never the only signal**: every change has an arrow glyph and a sign.

## 2. Typography

| Role | Font | Fallback | Notes |
|---|---|---|---|
| Headlines, section titles, wordmark, chart annotations | **Playfair Display** 700 (annotations: italic 500/700) | Lora, Georgia, serif | High contrast serif = newspaper |
| ALL numbers, tickers, symbols, times | **IBM Plex Mono** 400/600/700 | DejaVu Sans Mono | `font-variant-numeric: tabular-nums` so digits align |
| Labels, nav, buttons, body | **Inter** 400/500/600/700 | system-ui | |

Load with `display=swap` and preconnect. Only these three families, only the weights listed.

### Type scale (desktop 1440)

| Element | Size / line | Weight | Extra |
|---|---|---|---|
| Wordmark | 38 / 1 | 700 | letter-spacing .04em; the "·" is `--loss` |
| Home headline | 50 / 1.04 | 700 | letter-spacing −.01em |
| Stock title | 48 / 1.05 | 700 | |
| Big price | 46 / 1 | 700 mono | letter-spacing −.02em |
| Portfolio total | 40 / 1 | 700 mono | |
| Section title | 19 | 700 serif | |
| Body | 15 / 1.55 | 400 | max-width 470px (about 62 characters) |
| Table cell | 13 | 400/600 | |
| Kicker | 11 | 700 | uppercase, letter-spacing .16em, `--loss` |
| Column header | 10 | 600 | uppercase, letter-spacing .12em, `--mute` |
| Ticker | 12 mono | | |

Mobile: headline 34, big price 34, portfolio total 32, everything else the same (body never below 14).

## 3. Layout and spacing

* 12-column feel with a **56px** side margin at 1440; **32px** at 768; **16px** at 390.
* Spacing scale (px): 4 · 8 · 12 · 16 · 22 · 26 · 40 · 48. Pick from the scale; do not invent values.
* Table row height **41px** (38 for compact holdings). Row = name over ticker on the left, numbers right-aligned.
* Home: 2 columns (520px text | chart) then 3 equal columns with a 40px gap.
* Stock: chart column + fixed 340px fact box.
* Watchlist: flexible table + fixed 470px portfolio column.

## 4. Print details (what makes it look hand-made)

* **Masthead rule:** a 1px line, then a second 1px line 5px below (a double rule).
* **Section header:** `3px double` ink top border, 8px padding, serif title left, tiny uppercase caption right.
* **Outlines:** 1.5px ink on every box, input, button, chart.
* **Hard shadows:** offsets only, zero blur. Buttons `3px 3px 0`, cards `5px 5px 0`, modal `6px 6px 0`, tooltip `3px 3px 0`.
* **Dotted rows:** `1px dotted #9b9886` between table rows; dashed `2 4` chart grid.
* **Paper grain:** 160×160 canvas noise tile at ~16% pixel density and ~8% opacity, `pointer-events:none`, fixed overlay. It must be nearly invisible: you feel it, you don't see it. It is static, so it stays on under `prefers-reduced-motion`; never animate it.
* **Selected row:** full-row `--hi` fill, black star.
* **No** gradients, blur, glow, rounded pills, emoji, stock photos, 3D bulls/coins, rockets.
* Corner radius: **0** on everything, except the LIVE dot (circle).

## 5. Components

### Buttons (38px tall, 20px side padding, Inter 600 13px, 1.5px ink border)
| Variant | Fill | Text | Shadow colour |
|---|---|---|---|
| Primary `.k` | ink | paper | **yellow** (the one place the highlighter appears in a shadow) |
| Highlight `.y` | hi | ink | ink |
| Buy `.g` | gain | white | ink |
| Sell `.o` | transparent | ink | ink |
| Danger `.r` | loss | white | ink |

States: hover = lift (−1px,−1px) shadow 4px. Active = (+3px,+3px) shadow 0. Focus-visible = 2px ink outline, 2px offset, plus a 5px yellow ring (keeps the ink outline readable on every background). Disabled = 45% opacity, no shadow, `cursor:not-allowed`.

### Tabs
Square segmented control, 1.5px borders overlapping by −1.5px, the active state is a *single sliding ink block* behind the labels (not a class swap). Arrow keys move selection (roving tabindex).

### Inputs
Underline style inside a `--box` field. The 1.5px ink underline is overlaid by a 3px `--hi` underline that draws left to right on focus. Numbers in mono.

### Tables
Header row: tiny uppercase muted, 1px ink bottom rule. Company cell: bold name over mono ticker. Numeric columns right-aligned. Whole row is a link on hover (cursor pointer, highlighter sweep). Sparkline in last column, 84×24 (watchlist 100×26).

### Tooltips (chart)
`--box` background, 1.5px ink border, hard 3px shadow, mono 12px, three lines: time/date (bold), value, change with ▲/▼. Flips to the left of the pointer near the right edge.

### Fact box (Key numbers)
`--box`, 1.5px border, 5px hard shadow. Labels in Inter muted, values in mono right-aligned. Ends with the 52-week range bar.

### Modal
`--box`, 1.5px border, 6px hard shadow, 420px max. Kicker "ORDER TICKET · SAMPLE", serif title, mono quantity field, estimate line with a dashed rule above, Cancel (outline) + Confirm (Buy green or Sell red).

### Toast (confirmation after a trade)
Slides up from the bottom-left, ink background, paper text, 3px yellow left border, 3 seconds, `role="status"`.

## 6. Iconography

SVG only, 1.6px stroke, round joins, ink. Required set: search, star (outline + filled), check, menu (3 lines), close, arrow up/down (use ▲▼ glyphs, not icons, in tables), chevron. No icon fonts, no emoji.

## 7. Data presentation rules

* Indian grouping everywhere: `4,82,300` and `₹1,248.60`. Use `toLocaleString('en-IN')`.
* Always show sign and arrow: `▲ 1.81%` / `▼ 2.64%`; absolute change uses `+`/`−` (true minus U+2212).
* Prices 2 decimals, volumes 1 decimal with "lakh", market cap in crore.
* Index values never abbreviate.
* Dates: "Fri 20 Nov 2026", times in IST, 24-hour.
* Every page footer: "Sample data and fictional companies, for demonstration only."
