# 03 · Animation Specification

Numbers match the 17 items in the master prompt and the numbered cards in `code/animation-lab.html`. Open the lab beside this document: every behaviour below is running there.

## 0. Motion principles (read first)

1. **Motion explains, never decorates.** Each animation answers a question: "where did that come from?" (reveal), "what changed?" (flash), "what am I pointing at?" (crosshair), "did it work?" (press, tick).
2. **One easing curve.** `cubic-bezier(.2,.7,.2,1)`: quick start, long soft landing. It feels like ink settling. The only exception is `cubic-bezier(.34,1.56,.64,1)` (small overshoot) used for *pops* (star, end dot, red marker, arrow flip), because a pop is meant to feel physical.
3. **Duration ladder:** 150ms (press, hover feedback) · 250ms (state change, row sweep, modal) · 500ms (reveal, chart morph, tab slide) · 900–1200ms (data draws). Nothing longer than 1.2s except the infinite ticker and the LIVE dot.
4. **Compositor-only:** animate `transform` and `opacity`. SVG exceptions: `stroke-dashoffset` / `stroke-dasharray` (cheap, no layout). Never animate `width`, `height`, `top`, `left`, `box-shadow` blur or `filter`. The one deliberate exception is the button shadow (hard, no blur, 150ms), which is cheap enough.
5. **Stagger = 60ms** for blocks, **12ms** for repeated marks (candles), **25ms** for list items. More than ~12 staggered items must cap total delay at 400ms.
6. **Once is enough.** Scroll reveals, count-ups and draw-ins run once per page view. Re-triggering them every scroll is the fastest way to make a site feel tiring.
7. **Respect the user.** `prefers-reduced-motion: reduce` shows final states instantly. Live updates still change values but without flashes; ticker becomes a manually scrollable strip.
8. **Interruptible.** Every state animation can be reversed or replaced mid-way (hover out during the sweep reverses it; clicking a new tab during a morph cancels the old morph).

### Timing table (cheat sheet)

| Interaction | Duration | Delay | Easing |
|---|---|---|---|
| Button press / release | 150ms | 0 | ease |
| Button hover lift | 150ms | 0 | ease |
| Row highlighter sweep | 250ms | 0 | ease |
| Modal open / close | 250ms | 0 | ease |
| Star pop | 450ms | 0 | pop |
| Tab slider | 500ms | 0 | ease |
| Chart morph (tab switch) | 500ms | 0 | ease-out cubic (rAF) |
| Reveal on scroll | 500ms | 60ms × index | ease |
| Headline line mask | 700ms | 110ms × line | ease |
| Count-up | 900ms | 0 | ease-out cubic (rAF) |
| Line draw | 1200ms | 0 | ease |
| Area fade | 600ms | 900ms | ease |
| End dot pop | 500ms | 1150ms | pop |
| Callout fade | 600ms | 1500ms | ease |
| Candle grow | 420ms | 12ms × index | ease |
| Volume rise | 520ms | 12ms × index + 150ms | ease |
| Donut sweep | 700ms | 160ms × segment | ease |
| Range bar fill | 900ms | 0 | ease |
| Range marker drop | 450ms | 850ms | pop |
| Price flash | 600ms | 0 | ease |
| Page transition | 150ms out / 300ms in | 0 | ease |

---

## 1 · Ticker tape (infinite marquee)

* **What:** the black strip scrolls right-to-left forever.
* **How:** the strip contains **two identical tracks** side by side; the wrapper animates `translateX(0 → −50%)` linearly. Because the second track is an exact copy, the jump back to 0 is invisible. `will-change: transform`.
* **Speed:** ~48s for the whole loop at 12 items (≈ 60px/s). Rule: 40–70 px/s; faster feels frantic, slower feels dead. Recompute `duration = trackWidth / 60` if the item count changes.
* **Pause:** on hover, on keyboard focus-within and via the Pause button (`.is-paused`). Use `animation-play-state`, never remove the animation (that would snap back to 0).
* **Reduced motion:** no animation; the strip is horizontally scrollable.
* **A11y:** the duplicate track is `aria-hidden`. Give the strip `role="region" aria-label="Market ticker"`.
* **Detail:** when a live tick changes a ticker value it flashes exactly like a table number (see #8).

## 2 · Page-load stagger

* **Order:** masthead → kicker → headline → summary → index strip → chart → tables.
* **Each block:** `opacity 0→1` and `translateY(12px→0)`, 500ms, `--i × 60ms`.
* **Implementation:** `BD.stagger('[data-reveal-load]')` writes `--i`, then `BD.reveal()` adds `.is-in`. Above-the-fold blocks are revealed immediately by the observer.
* **Never** hide content with JS off: put the reveal CSS inside `html.js [data-reveal]{…}` so no-JS users see everything.
* **Layout shift:** blocks keep their space (transform doesn't affect layout) so CLS stays 0.

## 3 · Scroll reveal

* `IntersectionObserver`, threshold .15, root margin `0 0 −6% 0`, `unobserve` after the first hit (once only).
* Same visual as #2. Sections must not reveal one by one when the user jumps via anchor link; if the element is already above the viewport on load, reveal at once.
* Also the *trigger* for count-ups, sparkline draws, string effects and chart draw-ins inside the revealed block (`fire()` in animations.js). That is why a chart far down the page draws when you get there, not on load.

## 4 · Number count-up

* **Targets:** index values, big price, portfolio total, change percentages, fact-box numbers.
* **Markup:** `<span data-count="482300" data-decimals="0" data-prefix="₹">`. Real value is in the attribute; the text content is the *final* value too (so no-JS and screenshots are right).
* **Motion:** from 0 to target in 900ms, ease-out cubic (`1 − (1−t)³`) with `requestAnimationFrame`; the final frame writes the exact target (avoids float drift like 482299.9999).
* **Formatting each frame** with `toLocaleString('en-IN')` so grouping appears correctly *while counting* (4,82,300 not 482,300).
* **Tabular digits** so the width doesn't jitter.
* **Don't** count up on live ticks (those flash instead) or on tab switches.
* **Reduced motion:** write the final value immediately.

## 5 · Chart draw-in

### Line chart
1. Measure the path (`getTotalLength()`), set `--len`, `stroke-dasharray: len; stroke-dashoffset: len`.
2. On `.is-in`: `stroke-dashoffset → 0` over **1200ms**. The line draws left to right like a pen.
3. Area fill fades in 900ms after start (so it appears as the line nears the end).
4. **End dot:** scale 0→1 with overshoot at 1150ms; then an outward **pulse ring** (scale 1→3.2, opacity .5→0, 1.8s, infinite, only until the user interacts or after 3 pulses).
5. Last-price flag and callouts fade in at 1300 / 1500ms: the story comes *after* the shape.

### Candlesticks
* Each candle is a `<g>`; `transform-box: fill-box; transform-origin: center; scaleY(0→1)`, 420ms, `index × 12ms`. 56 candles ⇒ total ≈ 1.1s.
* Volume bars `scaleY(0→1)` from the **bottom** (`transform-origin: bottom`), +150ms offset so price leads, volume follows.
* The dashed last-price line and flag fade in at 900ms.

## 6 · Chart interactivity

### Crosshair + tooltip
* Pointer move → find nearest data index by x → draw a **1px dashed vertical line**, a **yellow dot with ink ring** snapped to that point, and a **hard-shadow tooltip**.
* Tooltip moves with `transform: translate()` only (no top/left). It flips left of the pointer when it would overflow, and clamps to the top.
* Fade in/out 150ms. On leave it fades out; it does **not** jump.
* Touch: `pointermove` works for touch drag; add `touch-action: pan-y` so vertical scrolling still works.
* **Keyboard:** the chart is focusable (`tabindex=0`); ←/→ moves one point, Home/End jump to first/last; the tooltip has `role="status"` so screen readers announce it.

### Tab switching (1D → 1W → 1M…)
* **Slider:** a single dark block (`.slider`) translates and resizes to sit behind the chosen tab (500ms). The label colour flips ink→paper at the same time (250ms).
* **Morph:** the old line is *resampled* to the new point count and each point is tweened to its new position (500ms, rAF, ease-out). Then the chart is replaced by the new full SVG with transitions disabled so nothing re-draws. Axis labels cross-fade (200ms).
* **Cancel:** starting a new morph cancels the previous tween.
* Candlestick charts do not morph (shapes differ); use the grow-in again with a 150ms fade-out of the old candles first.

## 7 · Sparklines

* **Draw-in:** each sparkline is a single `<path>`; same dash technique, 900ms, when its row first becomes visible. Stagger rows by 60ms.
* **Hover:** `stroke-width 1.7 → 2.6` in 150ms when the row is hovered. Stroke width is the only property that changes, so there is no layout shift.
* **Colour:** gain/loss by sign. Add `role="img"` and `aria-label="Rising trend"`.

## 8 · Live price simulation

* **Cadence:** a `setTimeout` loop with random 2–3s delay. Each tick picks **1–4 random** elements marked `data-live`. Do **not** update everything at once; real tapes are uneven.
* **Price step:** `new = old × (1 ± up to 0.08%)`. The change % is recomputed from `data-base` (previous close).
* **Flash:** the *cell* gets `flash-up` (green 22% → transparent) or `flash-dn` (red) for **600ms**. Restart technique: remove class, force reflow, add class.
* **Arrow flip:** if the sign changes, ▲ ↔ ▼ rotates 180° with the pop easing (250ms) and the colour class swaps.
* **Sync:** all appearances of the same symbol update together (ticker, table row, stock header, portfolio value). Use one in-memory price store and re-render subscribers.
* **Portfolio value** re-sums from holdings; its number flashes too, but it does **not** count up again.
* **LIVE indicator:** "LIVE ●" with a red dot that fades 1 → .25 → 1 over 2s. Next to it: pause/play button (`aria-pressed`). Paused ⇒ dot turns grey and static, label "PAUSED".
* **Hidden tab:** skip ticks when `document.hidden` (saves battery and avoids a burst on return).
* **Reduced motion:** values still update (it's information) but no flash; instead the cell gets a 2px underline in the up/down colour for 600ms.
* **Screen readers:** do **not** announce every tick. Updating cells are `aria-live="off"`. Offer a polite summary only when the user pauses ("Nifty 50 up 0.45%").

## 9 · Table row highlighter

* A yellow bar sits behind the row (`::before` on the first cell) and `scaleX(0→1)` from the **left** over 250ms (transform-origin left). It feels like dragging a highlighter across a printed line.
* Leaving the row reverses it (same duration, so quick passes look like a smear).
* Width is the full row width (`--rowW` set in JS because the pseudo-element lives in cell 1).
* **Text inside switches to ink** while highlighted (red/green on yellow is 3.6:1, which fails WCAG AA).
* `cursor:pointer`; also on `:focus-within` for keyboard users; rows are `tabindex=0` with Enter = open.

## 10 · Buttons

* **Rest:** hard shadow 3px 3px.
* **Hover:** `translate(−1px,−1px)` + shadow 4px (button lifts toward the light).
* **Press:** `translate(3px,3px)` + shadow 0. The button sits flat on the page like a stamp.
* **Release:** springs back in 150ms.
* **Add to Watchlist:** the star icon rotates 144° while scaling 1→1.35→1 (450ms, pop curve) and the label changes to "Added" with an **SVG check that draws itself** (stroke-dashoffset 24→0, 300ms, 80ms delay). Reverse on un-add. Icon only, no emoji.

## 11 · Watchlist star + row removal

1. Click: star fills yellow↔transparent (250ms) while popping (scale 1→1.35→1, rotate 144°).
2. After 350ms: row fades and slides 12px left (300ms).
3. Then height collapses to 0 over 220ms so rows below glide up.
4. Counter "Your list · 8 stocks" counts down 8→7 (300ms roll).
5. Toast with **Undo** for 5s; Undo reinserts with the reverse animation.

## 12 · Donut

* **Sweep:** each segment's dash grows from 0 to its length, one after another (700ms each, 160ms apart), clockwise from 12 o'clock.
* **Hover:** that segment scales to 1.045 about the centre (250ms) = "pushes out"; matching legend row gets a yellow background and slides 4px right; the centre number+label change to that sector's value ("34%", "BANKING"). Leaving restores "5 SECTORS".
* **Keyboard:** legend rows are focusable and trigger the same state.
* Colours are flat; never add gradients between segments. Each segment has the 1.5px ink ring around the whole donut, not around each segment.

## 13 · 52-week range

* Ink fill `scaleX(0→1)` 900ms from the left to the current position.
* Red marker drops 16px with overshoot (450ms) starting at 850ms, so it "lands" as the fill finishes.
* On live updates the marker **slides** (transform) to its new place in 300ms.

## 14 · Page transitions

* **Preferred:** CSS `@view-transition { navigation: auto }` (Chrome/Edge/Safari). Old page: fade + 6px up in 150ms. New page: fade + 10px up in 300ms.
* **Fallback:** on internal link click, add `.is-leaving` to `<body>` (opacity 0, translateY −6px, 150ms) and navigate after 150ms.
* Persist the ticker position? Not possible across pages without a SPA; instead start the ticker at a random offset so it never looks like it restarts.
* Don't intercept: middle-click, ctrl/cmd-click, `target=_blank`, hash links, external links.
* **Reduced motion:** navigate instantly.

## 15 · Modal

* **Open:** backdrop opacity 0→1 (250ms); box `translateY(8px) scale(.96) → none` (250ms). Focus moves to the quantity field after 30ms. Body scroll locks.
* **Close (Esc / Cancel / backdrop click / Confirm):** exact reverse; focus returns to the button that opened it.
* **Focus trap:** Tab at the last control goes to the first and Shift+Tab the reverse.
* **Estimated cost** updates as you type; the number does a 120ms cross-fade (not a count-up: it needs to feel instant).
* **Confirm:** button shows a 300ms press, then the modal closes and a toast confirms.

## 16 · Headline reveal

* The H1 is split into **lines supplied by you** (not auto-wrapped) so the lines are identical on every screen: "Markets close higher / as banks lead / the rally" (adjust per breakpoint with 2 arrays).
* Each line lives in an `overflow:hidden` mask; the inner span goes `translateY(105%) → 0`, 700ms, 110ms apart.
* Keep `aria-label` with the full sentence on the heading, and mark the visual spans `aria-hidden`.

## 17 · Reduced motion

`@media (prefers-reduced-motion: reduce)` in CSS, plus `BD.reduced()` checks in JS:

| Feature | Reduced behaviour |
|---|---|
| Ticker | static, horizontally scrollable |
| Reveal / headline / chars | visible immediately |
| Count-up | final number immediately |
| Line, sparkline, candle, volume, range | final state immediately |
| Donut | final state immediately; hover highlight stays (it's a state, not motion) |
| Live flash | replaced by 2px underline for 600ms |
| Page transition | none |
| Buttons | colour/outline changes only; no translate |
| Modal | opacity only |
| LIVE dot | static |

Test it: macOS System Settings ▸ Accessibility ▸ Display ▸ Reduce motion; Windows ▸ Accessibility ▸ Visual effects ▸ Animation effects off; Chrome DevTools ▸ Rendering ▸ Emulate `prefers-reduced-motion`.

---

## Orchestration: what happens on first load of Home (timeline)

| t (ms) | Event |
|---|---|
| 0 | Ticker starts moving. Page is `opacity:1`, blocks hidden. |
| 0–300 | Masthead reveals, nav underline slides into place (no animation on first placement) |
| 120 | Kicker + LIVE dot |
| 180 | Headline line 1 slides up; 290 line 2; 400 line 3 |
| 360 | Summary fades up |
| 420 | Index strip fades up, numbers count up 0→value over 900ms (done at ~1.3s) |
| 480 | Chart box reveals; line starts drawing at once when the chart is ≥15% visible, finishing at ~1.7s |
| 900 | Area fade starts, 1150 end dot pops, 1300 price flag, 1500 callouts |
| 540–840 | Tables reveal (60ms apart); sparklines draw as each row appears |
| 2000+ | First live tick |

Total "settling" time ≈ 2 seconds. The page is *readable* from 400ms; nothing blocks interaction at any time.

## Things we deliberately do NOT animate
* Parallax, scroll-jacking, tilt/3D cards, cursor-follower blobs, confetti, shimmer skeletons, background gradients, typewriter on body text, auto-rotating carousels, counters on every tab change, bouncing arrows, shake on error (use a static red underline + message instead).
