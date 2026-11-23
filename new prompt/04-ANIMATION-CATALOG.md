# 04 · Animation catalog (60 animations)

GLOBAL RULES
- Animate only `transform`, `opacity`; plus `clip-path` (mask reveals), `stroke-dashoffset` (line draws), `grid-template-rows` (accordion). Never animate width/height/top/left/margin/box-shadow blur.
- `will-change` only during the animation, removed on `animationend`/`transitionend`.
- Max 6 simultaneous running animations; the rest queue (stagger ≤ 40 ms per item, cap total stagger at 480 ms).
- Entrance = `--ease-out`; exit = `--ease-in` and ~70% of entrance duration; state change = `--ease-io`.
- Reduced motion (media query OR in-app toggle `html[data-motion="reduce"]`): every animation below lists its fallback. Default fallback: element shown in final state immediately; opacity fades allowed at 120 ms.
- Controller: `Motion` object in `js/core/motion.js` exposes `Motion.reduced`, `Motion.paused`, `Motion.run(el, name)`, `Motion.observe(el, name)` (IntersectionObserver, once). All JS animations use `requestAnimationFrame` and respect `Motion.paused`.
- Pause everything when `document.hidden`.
- Each animation has a `data-anim="name"` hook and a replay button in `code/animation-lab.html`.

Columns: ID · Name · Where · Trigger · Duration/easing · What moves · Reduced-motion fallback.

## A. Page and structure (A01–A10)
| ID | Name | Where | Trigger | Spec | Reduced |
|---|---|---|---|---|---|
| A01 | Load sequence | every page | DOMContentLoaded | ticker fades 0→1 (240), masthead rule draws left→right via `scaleX` 0→1 (360, origin left), wordmark mask reveal (A04), nav fades in with 40 ms stagger, main content A05 | show all |
| A02 | Ticker marquee | ticker bar | auto | translateX 0 → −50% linear, 60 s loop for 20 items; pauses on hover/focus-within/pause button/hidden tab/reduced | static horizontally scrollable list with `tabindex=0` |
| A03 | Date typewriter | masthead date | load | characters appear 18 ms each (caret blinks 3×, then fades) | instant text |
| A04 | Headline mask reveal | H1, lead story | in view | each line in an overflow-hidden wrapper, inner translateY(105%)→0, 600 ms ease-out, 80 ms line stagger | instant |
| A05 | Scroll reveal | cards, sections | enters viewport (threshold .15, once) | translateY 16px→0 + opacity 0→1, 360 ms; siblings stagger 40 ms | instant |
| A06 | Page transition | link clicks (same-origin) | click | out: main opacity→0 120 ms; navigate; in: opacity 0→1 180 ms | none |
| A07 | Sticky header shrink | header | scrollY > 120 | wordmark `scale` 1→.7 (transform-origin left), masthead row collapses via `grid-template-rows` 1fr→0fr 240 ms, hard 3px rule fades in | instant swap, no scale |
| A08 | Reading progress bar | Learn, long pages | scroll | 4px ink bar `scaleX` follows scroll (rAF, no easing) | static, hidden |
| A09 | Skip-link slide | all pages | focus | translateY(−100%)→0, 120 ms | appears instantly |
| A10 | Back-to-top | long pages | scroll > 800 | button translateY 16→0 + opacity; click smooth-scroll 480 ms | instant jump |

## B. Numbers and live data (B01–B08)
| ID | Name | Where | Trigger | Spec | Reduced |
|---|---|---|---|---|---|
| B01 | Count-up | big numbers, summary band | in view | 0→value over 900 ms ease-out, Indian grouping each frame, final value exact | show final |
| B02 | Digit roll | live price | price change | each changed digit slot rolls vertically (translateY −100%) 240 ms; unchanged digits stay | swap text |
| B03 | Tick flash | live price cell | each tick | cell gets 2px underline in gain/loss colour for 600 ms (no yellow, no background flash) + arrow glyph updates | underline stays 600 ms without motion |
| B04 | Arrow bump | change pill | sign flips | arrow translateY ±4px then 0, 180 ms ease-snap | swap glyph |
| B05 | Change-pill swap | pill | value change | old value slides up/out, new slides in from below, 240 ms | swap text |
| B06 | Live dot pulse | "LIVE" chip | auto | opacity 1→.35→1, 1400 ms steps(2) | static dot |
| B07 | Market-status flip | status chip | open/close transition | rotateX 0→90→0 (two halves, 2×120 ms) text swaps at midpoint | swap text |
| B08 | Ticker price update | ticker items | tick | brief ink→paper inversion 120 ms on the item | none |

## C. Charts (C01–C14)
| ID | Name | Spec | Reduced |
|---|---|---|---|
| C01 | Line draw | path `stroke-dasharray=len; dashoffset len→0`, 900 ms ease-io; endpoint dot pops scale 0→1 (180) at the end | draw complete |
| C02 | Area hatch fade | hatch layer opacity 0→.18, 360 ms after C01 | show |
| C03 | Candle grow | each candle `scaleY` 0→1 from the midpoint, 360 ms, 8 ms stagger left→right (cap 480 ms) | show |
| C04 | Volume bars grow | scaleY 0→1 from baseline, 360 ms, same stagger | show |
| C05 | Crosshair and tooltip | vertical dotted line follows pointer/keys (transform only), tooltip follows with 80 ms lag, flips side near edges | same, no lag |
| C06 | Range tab slide | tab underline slides 240 ms; chart path morphs old→new (interpolate y values 360 ms) | instant redraw |
| C07 | Chart-type switch | cross-fade 180 ms between line/candle/area | instant |
| C08 | Donut sweep | segments draw clockwise sequentially via dashoffset, 600 ms total | static |
| C09 | Donut hover pull-out | hovered/focused segment translates 6px outward, legend row inverts (ink bg, paper text) | outline only |
| C10 | Range bar fill | 52-week bar fills from low to current 600 ms; marker drops from −12px with a 180 ms ease-snap | static |
| C11 | Sparkline draw | 600 ms dashoffset; last dot appears | static |
| C12 | Heatmap cascade | tiles scale .9→1 + opacity, 24 ms diagonal stagger (cap 480) | static |
| C13 | Bar grow | horizontal bars scaleX 0→1, origin left, 360 ms, 40 ms stagger; value labels count up | static |
| C14 | Gauge needle | needle rotates from 0 to value 600 ms ease-snap; step marks light up | static needle |

## D. Tables and lists (D01–D08)
| ID | Name | Spec | Reduced |
|---|---|---|---|
| D01 | Row load stagger | rows fade+translateY 8→0, 24 ms stagger (first 12 only) | instant |
| D02 | Row hover sweep | yellow background wipes left→right using `::before` scaleX 0→1 (origin left), 180 ms; text switches to ink | instant yellow |
| D03 | Sort reorder (FLIP) | rows record old Y, reorder DOM, animate transform from delta to 0, 360 ms ease-io; sorted header arrow rotates 180° (180 ms) | instant reorder |
| D04 | Filter result change | removed rows collapse (opacity 0 then `grid-rows` 1fr→0fr, 240 ms), added rows expand; count text cross-fades | instant |
| D05 | Row insert/remove | new row slides down 240 ms with 1 s ink left-edge marker; removed row collapses with Undo toast | instant |
| D06 | Skeleton pulse | opacity steps 1, .85, .7, .6 repeating over 1400 ms | static `--soft` |
| D07 | Sticky header rule | on scroll a 2px ink bottom line fades in under header cells, 120 ms | instant |
| D08 | Reorder move | "Move up/down" swaps two rows with FLIP 240 ms; moved row gets 600 ms ink outline | instant |

## E. Controls (E01–E12)
| ID | Name | Spec | Reduced |
|---|---|---|---|
| E01 | Button press | hover: translate(−1px,−1px), shadow 2→3; active: translate(2px,2px), shadow 0; 80 ms | no translate, outline only |
| E02 | Button loading | label stays; 3 square dots step-animate (steps(3)) 600 ms; width locked | static "…" |
| E03 | Star toggle | glyph swaps; 4 short hard-edged ticks radiate (scale 0→1, 180 ms, ink); hit area flashes outline | glyph swap |
| E04 | Tab underline slide | 3px yellow bar translateX/scaleX to new tab 240 ms ease-io | instant |
| E05 | Segmented thumb slide | ink thumb translateX 180 ms; label colour swaps at midpoint | instant |
| E06 | Switch toggle | thumb translateX 120 ms; ON/OFF text swap | instant |
| E07 | Stepper bump | value translateY ±6 then 0 (120 ms); at limits, horizontal shake 3 cycles 240 ms | no shake; message only |
| E08 | Input focus underline | 3px yellow bar scaleX 0→1 under field 180 ms | instant |
| E09 | Checkbox tick draw | check path dashoffset 120 ms | instant |
| E10 | Invalid shake | field translateX ±4px ×3, 240 ms, plus error text fades in | message only |
| E11 | Accordion | `grid-template-rows` 0fr→1fr 240 ms; chevron rotates 180° | instant |
| E12 | Chip toggle | bg fills left→right 120 ms, check icon fades in | instant |

## F. Overlays (F01–F10)
| ID | Name | Spec | Reduced |
|---|---|---|---|
| F01 | Modal open | scrim opacity 0→.55 (180); dialog translateY 12→0 + opacity (240) and shadow grows `--sh-2→--sh-4` via pseudo-element opacity; focus moves in | fade only 120 |
| F02 | Modal close | reverse at 70% duration; focus returns to trigger | fade only |
| F03 | Bottom sheet | translateY 100%→0 320 ms ease-out; drag follows pointer; release past 30% dismisses | fade only |
| F04 | Toast in/out | translateX −16→0 + opacity 240; progress bar `scaleX` 1→0 over 6 s (10 s with Undo); pause on hover/focus | fade only, no progress animation (static time text) |
| F05 | Search dropdown | list opacity 0→1 120; items stagger 20 ms (max 6) | instant |
| F06 | Command palette | like F01 but top-anchored; results cross-fade 80 ms between queries | fade only |
| F07 | Mobile menu panel | panel translateX −100%→0 240; links stagger 30 ms | fade only |
| F08 | Tooltip | opacity 0→1 + translateY 4→0, 120 ms, 300 ms hover delay (0 on focus) | fade only |
| F09 | Popover/menu | scaleY .96→1 + opacity, origin top, 120 ms | fade only |
| F10 | Shortcut overlay | like F01, keys light one by one (40 ms stagger) | instant |

## G. Text (G01–G06)
| ID | Name | Spec | Reduced |
|---|---|---|---|
| G01 | Scramble | headline letters cycle mono glyphs then settle left→right over 600 ms (once per page, only on the lead story) | instant text |
| G02 | Character stagger | section titles: each char opacity/translateY 8→0, 18 ms stagger, max 30 chars | instant |
| G03 | Underline draw | link underline `scaleX` 0→1 from left on hover/focus, 180 ms; exits to the right | static underline on hover |
| G04 | Glossary highlight | term gets yellow marker sweep (hover/focus only) 180 ms; tooltip shows | instant |
| G05 | Typewriter (AI) | AI answer streams at 40 chars/s with blinking block caret; "Skip" button shows full text | full text immediately |
| G06 | Kicker blink | "BREAKING" kicker dot pulses (B06 style) 3 times then stops | static |

## H. Empty, success, error and AI (H01–H06)
| ID | Name | Spec | Reduced |
|---|---|---|---|
| H01 | Marching border | dashed border; `background-position` or `stroke-dashoffset` loops 2 s linear | static dashes |
| H02 | Illustration line draw | empty-state SVG strokes draw 900 ms stagger 120 ms | static |
| H03 | Order stamp | "EXECUTED (SAMPLE)" scale 1.4→1, rotate −8°→−4°, opacity 0→1, 240 ms ease-snap, holds 2 s then fades 240 | fade only |
| H04 | Alert-hit banner | banner slides down 240; bell icon rings (rotate ±12°, 3 cycles 480 ms) | slide none, no ring |
| H05 | AI thinking dots | three squares step-pulse 900 ms, `aria-label="Analyst is thinking"` | static "…" |
| H06 | Insight card reveal | card flips in with `rotateX(-8deg)→0` + opacity 360 ms; rule-explanation panel expands (E11) | fade only |

## I. Load timeline (home page, 1440 px, cold load)
0 ms ticker fade → 80 ms masthead rule draw → 160 ms date typewriter (≈ 1 s) → 200 ms wordmark mask → 300 ms nav stagger → 400 ms lead headline mask → 520 ms index cards (A05 stagger) → 640 ms table rows (D01) → in-view charts when visible (C01/C11). Everything visible and usable by 1200 ms; no animation delays interaction (pointer events never blocked).

## J. Taste checks (reject if violated)
1. Nothing bounces more than once. 2. No spinner anywhere (use skeletons or stepped dots). 3. No parallax, no cursor trailers, no confetti. 4. Motion explains cause→effect (what changed, where it went). 5. Auto-motion limited to ticker, LIVE dot, marching border (all pausable). 6. No animation over 900 ms except chart draw (900) and ticker.
