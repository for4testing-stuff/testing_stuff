# MASTER PROMPT: Upgrade Bourse·Daily (UI/UX + bug fixes + AI)

How to use: attach the whole `testing_stuff` repo folder (plus the other files in this zip) to your AI coding tool (Claude Code, Cursor, etc.). Paste everything below the line.

---

You are a senior front-end engineer and product designer. You are upgrading an existing, working static website called BOURSE·DAILY (a fictional Indian share-market site styled like a financial newspaper). Do NOT rebuild it from scratch and do NOT change its brand. Improve it.

## CONTEXT
- Plain HTML, CSS and vanilla JS with classic `<script>` tags. No frameworks, no modules, no build step, no chart libraries. It must still open by double-clicking `index.html` (file://).
- Pages: index.html, stock.html, watchlist.html, learn.html, qa.html. Code: css/styles.css, code/animations.css, code/animations.js, js/data.js, js/charts.js.
- The design rules in `docs/01-design-system.md` and the "HARD RULES" in `00-MASTER-PROMPT.md` still apply: no gradients, glassmorphism, blur shadows, dark mode, emoji icons or stock photos; hard offset shadows only; yellow (#F5D547) only for selection/hover/focus/stars; text on yellow is always ink; every price change shows an arrow AND a sign; Indian number grouping everywhere.
- Sample data is fictional. Keep the "sample data" footer note.

## READ FIRST (in this order)
1. `02-AUDIT-bugs-found.md` : verified bugs and gaps. Fix every item.
2. `03-UI-UX-UPGRADE-SPEC.md` : the exact UI/UX improvements to make.
3. `04-AI-FEATURES.md` : the AI features to add (client-side, no backend required).
4. `05-QA-CHECKLIST.md` : what you must verify before saying you are done.

## GOALS
1. Fix all bugs in the audit (functional, accessibility, data, consistency).
2. Make the UI/UX clearer, faster to scan and easier to use, on desktop AND phone, without breaking the newspaper look.
3. Add the AI features from `04-AI-FEATURES.md` in a way that works offline by default and optionally uses a real LLM if the user supplies their own key.

## HOW TO WORK
Work in phases. After each phase, stop, summarise what changed (files + one line each), and wait for my "continue".

- Phase 1, Bugs and foundations: fix every audit item; move the duplicated inline `<script>` blocks and inline `style=""` attributes into `js/app.js` and CSS classes; add the shared header/footer so one change updates all pages.
- Phase 2, UI/UX: implement `03-UI-UX-UPGRADE-SPEC.md` (navigation, search, tables, stock page, watchlist/portfolio, trade modal, states, mobile).
- Phase 3, AI: implement `04-AI-FEATURES.md`.
- Phase 4, Accessibility, performance and QA: run through `05-QA-CHECKLIST.md`; report PASS/FAIL per line with evidence. Do not mark anything PASS that you did not actually test.

## RULES OF ENGAGEMENT
- Reuse `code/animations.js` / `animations.css`; extend, don't rewrite.
- Change one concern at a time; keep diffs small and reviewable.
- Never invent real market data or give real investment advice. Everything stays fictional and every AI output carries a "sample data, not financial advice" label.
- `qa.html` currently claims every check is PASS. Treat that page as untrusted. Re-test, then rewrite it so it only states results you actually verified.
- If a requirement here conflicts with the design system, keep the design system and tell me.
- If something is ambiguous, pick the simplest option, note the assumption in one line, and continue.

## DEFINITION OF DONE
- Zero console errors on all five pages at 1440, 1024, 768, 390 and 320 px; no horizontal scroll at 320 px.
- Everything works with keyboard only; visible focus ring on every interactive element.
- `prefers-reduced-motion` shows final states and stops auto-moving content.
- Lighthouse (desktop and mobile) Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 90 (if you cannot run Lighthouse, say so and use manual checks instead).
- All numbers use Indian grouping, including negatives (e.g. -123.45, -1,23,456.00).
- Every AI feature works with no network and no API key.
