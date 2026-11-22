# 04 · Micro-interactions and string animation

The small things that make the site feel finished. Each entry: **trigger → motion → why → code**. Items marked ✅ are running in `code/animation-lab.html`; items marked 📝 are specified here for the builder to implement.

## A. String (text) animations

### S1 · Character stagger ✅ (`BD.splitChars`)
* **Where:** small display words only: the kicker on Learn, a section number, the "Hi, Aarav" after sign-in. Never on paragraphs.
* **Motion:** each character `translateY(.5em) + opacity 0 → rest`, 400ms, **28ms** per character. A 20-character string finishes in ≈ 1s.
* **A11y:** put the full text in `aria-label` on the parent and `aria-hidden` on each character span, otherwise screen readers read letters one by one.
* **Gotcha:** use `display:inline-block` for the spans or `transform` won't apply; replace spaces with `&nbsp;` or the words collapse.
* **Rule:** max ~24 characters. Longer strings get the masked line reveal (#16) instead.

### S2 · Scramble-to-symbol ✅ (`BD.scramble`)
* **Where:** the ticker symbol when a stock page loads (e.g. the kicker "MRDN · NSE"), and when search selects a result.
* **Motion:** all letters start as random A–Z/0–9 glyphs; they **lock left to right**, one every ~55ms (+300ms head start). Unlocked letters keep changing every frame.
* **Why:** feels like a departure board / market data terminal and signals "this just loaded", at no cost to layout because it is monospace (same glyph width, no jitter).
* **Use only mono text**, otherwise letter widths change and the line jumps.
* Final frame always writes the exact target string.

### S3 · Typewriter with hard caret ✅ (`BD.typewriter`)
* **Where:** the search field placeholder suggestion ("Search stocks, e.g. MRDN" cycles to "…e.g. Kaveri Power"), and the news kicker.
* **Motion:** 35–65ms per character (random jitter = human), caret `steps(1)` blink every 500ms. Caret is a 2px ink bar, not an underscore.
* **Stop conditions:** stops on focus/typing; never loops more than 2 times; skipped for reduced motion.

### S4 · Masked line reveal ✅ (`BD.maskLines`)
Specified in #16. Lines come from an array per breakpoint so wrapping is controlled.

### S5 · Count-up numbers ✅ (`BD.countUp`)
Specified in #4. Tabular digits + Indian grouping while counting.

### S6 · Price "roll" for big numbers 📝
* **Where:** the 46px stock price on live ticks (optional upgrade over the plain flash).
* **Motion:** each digit that changed is its own `inline-block` column that slides out up 100% while the new digit slides in from below (200ms, 20ms per digit right to left, so the last digit moves first like an odometer).
* **Rules:** only changed digits move; the currency symbol and commas never move; keep a hidden full-text `aria-label` updated only when paused (avoid screen reader spam).

### S7 · Headline underline draw 📝
* **Where:** hovering an in-text link or a news headline.
* **Motion:** a 2px ink underline draws left→right (`scaleX` 0→1, 250ms, origin left); leaving it exits right (origin right). Yellow highlighter fill (`--hi`) is used for links *inside body text*.

### S8 · Strike-through on removal 📝
* When a watchlist row is removed, before it fades a 1.5px ink strike line draws across the company name (200ms). Undo wipes it back out. Newspaper-edit vibe.

### S9 · Kicker ticking time 📝
* "Live · 11:42 IST" updates each minute: the minute digits roll (S6). Costs almost nothing and reinforces "this is live".

## B. Hover, focus and press

| # | Element | Motion | Detail |
|---|---|---|---|
| M1 ✅ | Nav link | Single yellow underline **slides** to the hovered link, returns on leave (250ms) | `BD.navBar`; one bar, not per-link underlines |
| M2 ✅ | Button | Lift on hover, press flat | #10 |
| M3 ✅ | Table row | Highlighter sweep | #9 |
| M4 ✅ | Sparkline | Stroke 1.7→2.6px on row hover | #7 |
| M5 ✅ | Input | 3px yellow underline draws from left on focus | `.field::after` |
| M6 ✅ | Search suggestions | List items drop in 4px with 25ms stagger | Max total delay 125ms |
| M7 📝 | Breadcrumb link | Underline draw (S7) | |
| M8 📝 | Learn card | Lift −2px,−2px, shadow 5→7px | Same press behaviour as buttons |
| M9 📝 | News headline | Underline draw + kicker turns ink | |
| M10 ✅ | Focus ring | Instant (no transition): 2px ink outline + 5px yellow halo | Never animate focus; it must appear the instant the user tabs |
| M11 📝 | Cursor | `pointer` on rows/cards; `crosshair` on charts | |
| M12 📝 | Disabled Confirm | No hover lift; `cursor:not-allowed`; tooltip "You own 60 shares" | |

## C. Feedback and state change

| # | Event | Motion |
|---|---|---|
| F1 ✅ | Price tick | 600ms green/red flash + arrow flip if sign changes |
| F2 ✅ | Add to watchlist | Star spin-pop + "Added" + drawn tick |
| F3 ✅ | Remove from watchlist | Fade, collapse, count-down |
| F4 📝 | Trade confirmed | Toast slides up 12px and fades in (250ms), stays 3s, fades out; the holdings row that changed gets a 1.2s yellow flash that fades to transparent |
| F5 📝 | Invalid quantity | Field underline turns red instantly + message fades in 150ms. **No shake.** |
| F6 📝 | Copy / share link | Button label swaps "Copy link" → "Copied" with the drawn tick, reverts after 1.8s |
| F7 📝 | Market open/close change | Kicker text cross-fades 250ms; LIVE dot switches colour |
| F8 📝 | Empty state | The dashed placeholder row's border *marches* very slowly (dash offset animation 8s linear infinite) to suggest "waiting"; off in reduced motion |

## D. Ambient (always on, keep subtle)

* **LIVE dot:** opacity 1→.25→1, 2s. (Slow = calm. Faster than 1.5s feels like an alarm.)
* **End-dot pulse:** 3 pulses after the chart finishes drawing, then stops.
* **Ticker:** 60px/s, pauses on hover.
* **Reading progress bar (Learn articles):** 3px yellow `scaleX` bound to scroll, transform only.

Nothing else moves on its own. If the user is reading a table, the only moving things are tiny number flashes and the ticker at the very top.

## E. Chart micro-details

* **Grid lines** are static dotted lines; they never animate.
* **Y-axis labels** cross-fade when the range changes (200ms).
* **Last-price flag** follows the live price with a 300ms `transform` slide; its text updates instantly.
* **Prev-close dashed line** draws in 200ms after the main line finishes.
* **Callouts** have a small red dot at the data point (scale-pop 250ms) then the leader line draws (stroke-dashoffset 250ms) then the text fades (250ms): three beats, 750ms total.
* **Volume bars** use the same colour as the candle but at 42% opacity so they never fight with price.
* **Crosshair dot** is yellow with an ink ring: the only place yellow appears inside a chart besides the donut's Energy segment.

## F. Sound and haptics
None by default. If the builder wants a bonus: a 12ms soft "tick" on live updates is **off by default** and must be a visible toggle in the footer. Mobile haptics: a single `navigator.vibrate(8)` on Confirm only.

## G. "Taste checks" before shipping
1. Cover the screen with your hand and move the mouse: does anything move without you touching it? Only the ticker, LIVE dot and tiny number flashes should.
2. Click everything three times quickly. Nothing should queue up, stack, or end in a wrong state (every animation interruptible).
3. Scroll fast up and down. Nothing re-animates.
4. Set CPU 6× slowdown in DevTools; the page must stay usable (animations may be choppy but must finish).
5. Turn on reduced motion; the whole site should still feel complete.
