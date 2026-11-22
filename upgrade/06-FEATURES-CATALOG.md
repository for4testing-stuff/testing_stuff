# 06 · Features catalog (85 features)

Priority: P0 = must (core/bugs), P1 = should (core value), P2 = could (nice), P3 = stretch. Effort: S (< 2 h), M (half day), L (day+). Each row has an acceptance criterion (AC) the AI must test. All features respect brand rules and work with file://.

## A. Market overview
| # | Feature | P | E | AC |
|---|---|---|---|---|
| A1 | Index cards (3 fictional indices) with sparkline and day range | P0 | M | values update on tick; signed change + arrow |
| A2 | Market status chip with next open/close (IST, sample holidays) | P1 | S | correct at 09:14, 09:15, 15:30, Sat |
| A3 | Gainers / Losers / Most active tabs | P0 | S | top 5 correct vs data; ties broken by symbol |
| A4 | Breadth meter (advancers vs decliners vs unchanged) | P1 | S | counts sum to total |
| A5 | Sector heatmap (treemap by market cap, tile = % change, pattern + arrow not just colour) | P1 | L | tile click filters table by sector |
| A6 | 52-week high/low list | P1 | S | uses data high52/low52 within 2% |
| A7 | Market calendar (results, dividends, holidays, RBI policy) | P2 | M | next 7 days list; "Add to my calendar" downloads .ics |
| A8 | IPO tracker (fictional upcoming/open/listed with status chips and subscription bar) | P3 | M | statuses correct by date |
| A9 | Commodities and currencies strip (fictional) | P3 | S | pausable with ticker |
| A10 | FII/DII flows bar chart (fictional) | P3 | M | accessible data table toggle |
| A11 | News feed (fictional headlines, sentiment badge, source, time) with filters | P2 | M | filter by sector/sentiment; read-later |
| A12 | "Market in one minute" AI summary + audio (SpeechSynthesis) | P1 | M | works offline; Stop button |

## B. Stock detail
| # | Feature | P | E | AC |
|---|---|---|---|---|
| B1 | Line, area-hatch, candlestick chart switch | P0 | L | all render from the same data |
| B2 | Range tabs 1D–MAX with morph | P0 | M | keyboard operable |
| B3 | Indicators: SMA20/50, EMA20, Bollinger, RSI, volume | P2 | L | values match a hand calculation for 1 point |
| B4 | Compare overlay up to 3 symbols (rebased to 100) | P1 | L | legend with patterns; remove chips |
| B5 | Crosshair + tooltip + keyboard exploration | P0 | M | arrows move; announces value |
| B6 | Chart data-table toggle | P1 | S | table matches chart |
| B7 | Chart PNG download | P3 | M | file opens; includes title & date |
| B8 | Key stats with plain-English tooltips | P0 | S | all tooltips < 140 chars |
| B9 | 52-week range bar with text equivalent | P0 | S | percentage correct |
| B10 | Financials tab (quarterly bars, annual table, ratios) | P2 | L | numbers formatted ₹ Cr, Indian grouping |
| B11 | Returns table vs sector average | P1 | M | bar chart + table |
| B12 | Shareholding stacked bars (4 quarters) | P2 | M | sums to 100% |
| B13 | Corporate actions timeline | P2 | M | sorted by date |
| B14 | Order book depth (5×5) | P3 | M | refreshes with tick |
| B15 | Peers cards (same sector) with quick compare | P1 | S | excludes itself |
| B16 | Private notes per stock | P2 | S | persists; max 500 chars; counter |
| B17 | Price alerts (above/below/% move) | P1 | M | fires once; re-arm option |
| B18 | Risk meter (volatility-based, 5 steps) | P2 | S | text label + gauge |
| B19 | Share link / copy summary / print | P2 | S | summary contains no PII |
| B20 | Recently viewed (last 8) | P1 | S | in command palette and search |

## C. Search, navigation, power use
| # | Feature | P | E | AC |
|---|---|---|---|---|
| C1 | Combobox search with typeahead, highlighting, groups | P0 | M | ARIA combobox verified |
| C2 | Recent and popular searches | P2 | S | clear history button |
| C3 | Command palette (Ctrl/⌘+K): go to page, open stock, run action (buy, add alert, toggle settings) | P1 | L | fuzzy match; Esc; arrows |
| C4 | Keyboard shortcuts + `?` overlay | P1 | M | no conflict with inputs |
| C5 | Breadcrumbs | P2 | S | correct on every page |
| C6 | URL state for filters, tabs, range | P1 | M | back/forward restore |
| C7 | Remember scroll position and last tab | P2 | S | per page |
| C8 | Onboarding tour (4 steps, skippable, once) | P2 | M | focus trap; restartable in Settings |
| C9 | Contextual help "?" popovers | P2 | S | all keyboard reachable |
| C10 | Feedback form (local only, exports JSON) | P3 | S | no network call |

## D. Watchlists
| # | Feature | P | E | AC |
|---|---|---|---|---|
| D1 | Star toggle with Undo, optimistic | P0 | S | persists |
| D2 | Multiple lists (max 8), rename, delete, reorder | P1 | M | migration from old single list |
| D3 | Move up/down reorder + optional drag | P1 | M | keyboard path exists |
| D4 | Bulk actions | P2 | M | select all, indeterminate state |
| D5 | Per-stock note and alert indicators | P2 | S | icons with labels |
| D6 | Share/import list by URL | P2 | M | invalid input handled |
| D7 | JSON/CSV import & export | P2 | M | round-trips |
| D8 | "Add popular starters" | P3 | S | adds 5, no duplicates |

## E. Trading simulator
| # | Feature | P | E | AC |
|---|---|---|---|---|
| E1 | Trade modal: buy/sell, qty stepper, live total, brokerage line | P0 | M | maths verified by hand |
| E2 | Order types: Market, Limit, Stop-loss | P1 | L | pending orders trigger on ticks |
| E3 | Validation: cash, holdings, lot ≥ 1, price band ±20% | P0 | M | inline messages |
| E4 | Order confirmation review step + stamp | P1 | S | Esc cancels |
| E5 | Open orders list with cancel | P1 | M | confirm dialog |
| E6 | Cash ledger & add funds (sample) | P1 | S | balance never negative |
| E7 | Transactions history + CSV | P1 | M | running balance correct |
| E8 | Realised vs unrealised P&L (FIFO) | P1 | L | tested with 3-lot example |
| E9 | Reset account (typed confirm) | P1 | S | clears only trading data |
| E10 | Fees model (brokerage 0.03%, STT, GST sample) shown in breakdown | P2 | M | totals match |

## F. Portfolio analytics
| # | Feature | P | E | AC |
|---|---|---|---|---|
| F1 | Summary band with signed values | P0 | M | sum equals table totals |
| F2 | Allocation donut by sector/company | P1 | M | legend with values |
| F3 | Equity curve | P2 | L | starts at first transaction |
| F4 | Concentration and diversification score | P2 | M | rule disclosure |
| F5 | Annualised return (simple XIRR) | P2 | L | known-case test |
| F6 | What-if market shock slider | P3 | M | educational label |
| F7 | Goals with required monthly SIP | P2 | M | formula shown |
| F8 | Dividends received log | P3 | M | from corporate actions |
| F9 | Rebalance helper (educational targets) | P3 | M | never says buy/sell, uses "over/under-weight" |

## G. Screener
| # | Feature | P | E | AC |
|---|---|---|---|---|
| G1 | Filter rail with all filters | P1 | L | AND logic; count live |
| G2 | Presets (7) | P1 | S | each returns plausible set |
| G3 | Column picker + sort | P1 | M | persists |
| G4 | Save/load/delete screens | P2 | M | local |
| G5 | URL share | P2 | S | reproduces results |
| G6 | CSV export | P2 | S | respects columns |

## H. Tools
| # | Feature | P | E | AC |
|---|---|---|---|---|
| H1 | SIP calculator | P1 | M | matches standard FV formula |
| H2 | Lumpsum + CAGR | P1 | S | formulas shown |
| H3 | Brokerage calculator | P2 | S | breakdown lines |
| H4 | Position-size (risk %) | P2 | S | validates inputs |
| H5 | Dividend yield, break-even | P3 | S | |
| H6 | Tax (STCG/LTCG, educational) | P3 | M | disclaimer present |
| H7 | Currency converter (sample rates) | P3 | S | swap button |
| H8 | Copy/print results | P2 | S | |

## I. Learn
| # | Feature | P | E | AC |
|---|---|---|---|---|
| I1 | Course list + progress rings | P1 | M | persists |
| I2 | Lesson TOC + reading time + progress bar | P1 | S | |
| I3 | Glossary with search + inline terms | P1 | M | 60+ terms |
| I4 | Mini-quizzes with explanations | P1 | M | score stored |
| I5 | Flashcards (keyboard) | P2 | M | |
| I6 | Streak, Term of the day | P3 | S | |
| I7 | Certificate (print) | P3 | S | |
| I8 | Chart-pattern gallery (SVG drawn) | P3 | M | alt text each |

## J. Platform and quality
| # | Feature | P | E | AC |
|---|---|---|---|---|
| J1 | Shared header/footer/app shell | P0 | M | one change, all pages |
| J2 | Storage wrapper with versioned migrations and quota handling | P0 | M | corrupt JSON recovered |
| J3 | Global event bus + state store | P0 | M | no cross-page globals |
| J4 | Live price simulator with pause/speed | P0 | M | seeded, deterministic option |
| J5 | Settings page | P1 | M | all settings persist |
| J6 | Language EN/हिन्दी (dictionary) | P2 | L | all strings via `t()` |
| J7 | Density, text size, high-contrast light | P1 | M | no layout break |
| J8 | Print edition stylesheet | P2 | M | stock/portfolio/learn print cleanly |
| J9 | PWA manifest + service worker (only when served over http(s)) | P3 | M | skipped gracefully on file:// |
| J10 | Offline banner + saved-data mode | P2 | S | |
| J11 | Error boundary (global handler shows friendly bar, logs locally) | P1 | S | |
| J12 | `tests.html` unit tests for maths | P0 | M | all green |
| J13 | Honest `qa.html` | P0 | M | generated from real results |
| J14 | 404 + About/Accessibility pages | P1 | S | |
| J15 | Changelog + README | P1 | S | |
