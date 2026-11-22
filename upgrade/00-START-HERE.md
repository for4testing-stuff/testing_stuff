# Bourse·Daily: ULTRA-DETAILED upgrade pack (v2)

What this is: a complete brief for an AI coding tool to take your current site from "working demo" to a polished, accessible, feature-rich product, without losing the newspaper look.

## How to use (3 steps)
1. Open your AI tool inside the `testing_stuff` repo.
2. Copy all files from this zip into the repo, in a folder named `upgrade/`.
3. Open `01-MASTER-PROMPT.md`, copy everything below the line, paste it. The AI works in 10 phases and stops after each one; reply "continue" to move on.

Tip: if your tool has a context limit, attach files phase by phase: Phase 1 needs 01, 02, 07; Phase 2 needs 03; Phase 3 needs 05, 10; Phase 4 needs 04; Phases 5–6 need 06; Phase 7 needs 08; Phases 8–9 need 09, 11.

## Files
| File | Contents | Size |
|---|---|---|
| 01-MASTER-PROMPT.md | The prompt: rules, 10 phases, report format, definition of done | short |
| 02-AUDIT-bugs-found.md | Verified bugs and gaps in the current code | medium |
| 03-DESIGN-SYSTEM-V2.md | Tokens, type, 28 components with states, 60 icons, charts, print | large |
| 04-ANIMATION-CATALOG.md | 60 animations: trigger, timing, easing, reduced-motion fallback, load timeline | large |
| 05-PAGES-AND-UX-DETAIL.md | 10 pages, layouts at every breakpoint, flows, states, microinteractions | large |
| 06-FEATURES-CATALOG.md | 85 features with priority, effort, acceptance criteria | large |
| 07-DATA-MODEL-AND-ARCHITECTURE.md | File structure, entities, storage, events, formatting, standards | large |
| 08-AI-FEATURES.md | Insight engine, Ask the Analyst, optional cloud AI, tests | medium |
| 09-ACCESSIBILITY-RESPONSIVE-PERFORMANCE.md | WCAG 2.2 AA, breakpoints, budgets, browser support | large |
| 10-MICROCOPY-AND-STRINGS.md | Every UI string in English and Hindi, voice rules | medium |
| 11-QA-CHECKLIST.md | The honest test list the AI must run | medium |

## Key findings from your current code (details in 02)
- `formatINR` prints `-,123.45` for negatives between -100 and -999 (reproduced).
- No ARIA, skip link or focus ring anywhere; emoji 🔍 breaks your own "no emoji icons" rule.
- Masthead date hardcoded to March 25, 2026; ZPHR's negative P/E printed raw.
- `qa.html` claims everything passes, but accessibility clearly doesn't.
- About 236 inline `style=""` attributes and five separate inline scripts; `js/app.js` never existed.

## Brand rules kept (unchanged)
No gradients, glass, blur shadows, dark mode, emoji icons, stock photos. Hard offset shadows. Yellow only for selection/hover/focus/stars. Text on yellow is ink. Arrow + sign on every price change.

## Honest limits
This pack is a brief, not finished code. The AI will still need to write and test everything, and the QA list forces it to say "NOT TESTED" where it didn't verify. Cloud AI is optional and uses the user's own key (personal demos only).
