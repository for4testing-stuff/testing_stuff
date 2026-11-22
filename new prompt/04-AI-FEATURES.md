# 04 · AI features (works offline; optional real LLM)

The site is static, so the AI layer is built in two tiers. Tier 1 is mandatory and needs no network and no key. Tier 2 is optional.

Safety rules for ALL AI output:
- Data is fictional. Every AI panel shows: "Sample data. AI-generated. Not financial advice."
- Never say "buy", "sell" or "guaranteed". Use neutral language ("trades near the upper end of its 52-week range").
- Never send the user's holdings or watchlist to any server unless they have explicitly pasted a key and clicked "Use cloud AI".

## Tier 1: "Smart Insights" (rule-based, offline, mandatory)

Create `js/insights.js` exposing `BourseInsights.forStock(symbol)`, `.forMarket()`, `.forPortfolio()`. Each returns an array of short plain-English sentences generated from the data in `js/data.js` using deterministic rules:

| Insight | Rule |
|---|---|
| Momentum | Compare price with 5-day and 20-day average from the seeded series. |
| 52-week position | Percentile of price inside [low52, high52]; wording changes at 10% / 90%. |
| Valuation | P/E vs the median P/E of the same sector; negative P/E → "currently loss-making". |
| Volatility | Standard deviation of daily returns; "calm / moderate / choppy". |
| Concentration (portfolio) | Warn if any sector > 40% of portfolio value. |
| Day summary (market) | Count of gainers vs losers, top sector by average change. |

UI:
1. **Stock page**: an "Analyst's note" box (serif italic, ink border, hard shadow) with 3 insight sentences.
2. **Home**: a "Market in one minute" box with 3 sentences, and a "Listen" button using the browser's SpeechSynthesis (hidden if unsupported; language `en-IN`).
3. **Portfolio**: a "Portfolio health" box with the concentration and volatility notes.
4. Each sentence has an info button revealing the rule used (transparency).

## Tier 1b: "Ask the Analyst" (offline question answering)

A small panel (bottom-right button on desktop, bottom sheet on mobile) where the user types questions such as:
- "Which stocks are near their 52-week high?"
- "Show loss-making companies"
- "Compare MRDN and CYBR"
- "Biggest gainer in Technology"

Implement an intent parser (keyword and symbol matching, no ML) that maps the question to one of: list-by-filter, compare-two, single-stock summary, glossary term. Answer with a short sentence + a mini table + links to the stock pages. If the question is not understood, reply with 4 example questions as clickable chips. Fully keyboard accessible; answers announced via `aria-live="polite"`.

## Tier 2 (optional): "Use cloud AI"

1. In a Settings popover, the user may paste their own API key. Store it only in `sessionStorage` (never localStorage), show a warning that it stays in the browser, and provide "Forget key".
2. Send only the question and the minimal stock fields needed (symbol, price, change, P/E, 52-week range). Never send watchlist or holdings unless the user ticks "Include my portfolio" (default off).
3. System prompt for the model: "You are a neutral educational market explainer for a fictional dataset. Explain, do not recommend. No buy/sell advice. Keep answers under 120 words. State that data is fictional."
4. Handle: no network, bad key, rate limit, timeout (10 s) with plain-language error messages and automatic fallback to Tier 1b.
5. Show a visible "Cloud AI" badge on answers that came from the model, and "Offline analyst" on the others.
6. Add a note in the docs that browser-side keys are for personal demos only, and that a production version needs a small server proxy.

## Acceptance tests for the AI layer
- With the network disabled and no key, all Tier 1 features work.
- Each insight sentence is reproducible: same data → same sentence.
- No AI text contains the words buy, sell, guarantee, or "will rise/fall".
- The Ask panel works with keyboard only and with a screen reader (answers are announced).
- Negative P/E (ZPHR) is described correctly as loss-making, never as "cheap".
