# Bourse·Daily upgrade pack

Goal: give an AI coding tool everything it needs to improve your site's UI/UX, fix its bugs and add AI features, without breaking your newspaper design.

## How to use
1. Open your AI tool (Claude Code, Cursor, etc.) in the `testing_stuff` repo folder.
2. Copy these five files into the repo (a folder like `upgrade/` is fine).
3. Open `01-MASTER-PROMPT.md`, copy everything below its horizontal line and paste it into the AI.
4. The AI works in 4 phases and stops after each one. Review, then say "continue".

## Files
| File | What it is |
|---|---|
| 01-MASTER-PROMPT.md | The prompt to paste |
| 02-AUDIT-bugs-found.md | Bugs and gaps found in your current code (with where) |
| 03-UI-UX-UPGRADE-SPEC.md | Exact UI/UX changes, page by page |
| 04-AI-FEATURES.md | AI features: offline insights, "Ask the Analyst", optional cloud AI |
| 05-QA-CHECKLIST.md | Checks the AI must run and report honestly |

## Most important findings
- `formatINR` prints `-,123.45` for negatives between -100 and -999 (reproduced).
- No ARIA attributes, no skip link and no focus ring on any page.
- The masthead date is hardcoded to March 25, 2026.
- `qa.html` says everything passes, but the accessibility items clearly don't.
