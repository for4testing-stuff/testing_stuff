# 08 · AI features (offline first, optional cloud)

Rules for ALL AI output: label "Sample data · AI-generated · Not financial advice". Never use: buy, sell (as advice), guaranteed, "will rise", "will fall", "sure", "risk-free". Use neutral wording ("trades in the upper part of its 52-week range"). Deterministic: same data → same text. Each sentence has an "ⓘ How was this decided?" disclosure showing the rule and inputs.

## Tier 1 (mandatory, offline): rule-based insight engine
`js/features/insights.js` → `Bourse.insights.stock(symbol)`, `.market()`, `.portfolio()`, `.watchlist(listId)`. Each returns `[{id, text, rule, inputs, tone:'neutral'|'caution'|'positive'}]` (max 5, ranked by `salience`).

| Insight id | Rule | Example text template |
|---|---|---|
| momentum | price vs SMA5, SMA20; slope of last 10 closes | "{name} is trading {above/below} its 20-day average, {x}% {over/under}." |
| range-position | percentile in [low52, high52]; bands <10, 10–35, 35–65, 65–90, >90 | "Priced in the {band} of its 52-week range." |
| valuation | P/E vs sector median (±15% neutral) ; null P/E → loss-making | "P/E of {pe} is {above/below/near} the {sector} median of {m}." / "Currently loss-making, so P/E is not meaningful." |
| volatility | σ of 30 daily returns → calm <1.2%, moderate 1.2–2.2%, choppy >2.2% | "Daily moves have been {calm/moderate/choppy} (about {σ}% a day)." |
| volume | latest volume vs avg (×) | "Volume is {n}× its average." |
| gap | |open − prevClose| > 2% | "Opened {x}% {above/below} yesterday's close." |
| breadth (market) | advancers/decliners ratio | "{a} of {n} stocks are up; breadth is {strong/mixed/weak}." |
| leader (market) | best sector by avg % change | "{sector} leads, up {x}% on average." |
| concentration (portfolio) | any sector > 40%, or top holding > 25% | "{sector} is {x}% of your portfolio, above the usual 40% comfort level." |
| diversification (portfolio) | 100 − HHI-based penalty | "Diversification score {s}/100." |
| drawdown (portfolio) | peak-to-trough in equity curve | "Largest dip so far was {x}%." |
| watchlist-movers | best/worst in list | "{symbol} is the strongest in this list today." |
Tone words map: positive = plain text with ▲; caution = ▬ with hatch icon; neutral = no icon. Never colour only.

UI surfaces: Stock "Analyst's note" box (3 insights); Home "Market in one minute" (3 + Listen button via SpeechSynthesis `en-IN` or `hi-IN`, Stop button, hidden if unsupported); Portfolio "Health check"; Watchlist "Today in this list"; Screener "About these results" (count, median P/E, top sector).

## Tier 1b: "Ask the Analyst" (offline NLU)
Panel: floating button bottom-right (desktop), bottom sheet (mobile), also command palette entry "Ask…". Input with 300-char limit, Enter sends, Esc closes, history ↑/↓, "Clear conversation". Answers render with typewriter (G05) + Skip, plus mini table and links. Announce answers in `aria-live="polite"`.
Intent parser (no ML): tokenise → lower-case → map synonyms (cheap=low P/E, expensive=high P/E, near high=52W position>90, loss-making=pe null, gainers, losers, biggest, top, compare, vs, explain, what is, define) → detect entities (symbols, company names via fuzzy match ≤ 2 edits, sectors, numbers with ₹/Cr/%) → choose intent:
1. `LIST_FILTER` ("stocks near 52-week high in technology") → run screener logic, show top 5 + "Open in Screener" link with URL state.
2. `COMPARE` ("compare MRDN and CYBR") → 2-column table (price, change, P/E, 52W pos, volatility) + 2-sentence neutral summary.
3. `STOCK_SUMMARY` ("tell me about Zephyr") → insights + stats.
4. `DEFINE` ("what is P/E") → glossary entry + related terms chips.
5. `PORTFOLIO_Q` ("my biggest holding") → answers from local portfolio only.
6. `CALC` ("SIP of 5000 for 10 years at 12%") → run calculator, show result + link to tool.
7. `NAVIGATE` ("open watchlist") → link button.
8. `UNKNOWN` → "I can answer questions like:" + 6 clickable example chips.
Safety: if the user asks for advice ("should I buy X?") reply with the standard neutral response: "I can't recommend trades. Here is how {X} looks on the numbers:" + insights.

## Tier 2 (optional): cloud AI with the user's own key
Settings → AI: key input (type=password), "Use for this session only" (stored in `sessionStorage`, never `localStorage`), "Forget key", warning "Keys in a browser are visible to anyone using this device. For personal demos only." Request builder sends only: question, symbol list, and minimal numeric fields; portfolio included only if "Include my portfolio" is ON (default OFF, with a preview of exactly what will be sent). Timeout 10 s, one retry, errors mapped to plain messages (no network, invalid key, rate limit, server error). Automatic fallback to Tier 1b with a badge "Offline analyst". Cloud answers carry badge "Cloud AI" and the same disclaimer. System prompt (fixed): "You are a neutral educational explainer for a fictional Indian market dataset. Explain; never recommend trades. No predictions. Under 120 words. State that data is fictional." Provide the request code behind a single function `Bourse.analyst.cloud(question, context)` so a server proxy can replace it later. Document that production requires a server-side proxy.

## AI UX details
- Thinking state: H05 dots + `aria-label`; cancel button.
- Source chips under every answer ("Used: price, P/E, 52-week range") so users see what data was used.
- Feedback buttons "Helpful / Not helpful" (local counter only).
- Conversation persists for the session only; "Export as text" button.
- All strings go through `t()` so Hindi answers work for templated insights.

## AI acceptance tests
1. Network off, no key: all Tier 1 and 1b features work.
2. Same inputs twice → identical text.
3. Banned-word scan over every template in EN and HI → zero hits.
4. "Should I buy ZPHR?" → neutral refusal + facts; ZPHR described as loss-making, never "cheap".
5. 40 sample questions (included as `tests/ask-questions.json`) route to the expected intent ≥ 90%.
6. Keyboard-only and screen-reader pass for the panel.
7. Key never appears in localStorage, URL, logs or exports.
