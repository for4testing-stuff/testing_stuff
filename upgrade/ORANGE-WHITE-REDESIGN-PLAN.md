# BOURSE·DAILY — ORANGE & WHITE EDITORIAL REDESIGN MASTER PLAN
**Theme:** Premium Modern Orange & White (Bold Editorial Financial Gazette)
**Aesthetic:** High-contrast warm orange (#ea580c / #f97316), pristine white paper backgrounds (#ffffff), deep charcoal ink text (#0f172a), crisp newspaper grid lines, buttery-smooth slide animations, and micro-interactions.

---

## 1. Color Palette Transformation (Dark/Monochrome -> Orange & White Editorial)
- **Primary Ink / Text (`--ink`)**: `#0f172a` (Slate 900)
- **Paper Background (`--paper`)**: `#ffffff` (Pure White)
- **Primary Accent (`--orange`)**: `#f97316` (Vibrant Orange) & `#ea580c` (Deep Orange 600)
- **Surface & Cards (`--surface`)**: `#fff7ed` (Orange 50 - subtle warmth)
- **Borders & Lines (`--line-color`)**: `#fed7aa` (Orange 200) / `#0f172a` for sharp editorial contrast
- **Gain / Up (`--gain`)**: `#16a34a` (Green)
- **Loss / Down (`--loss`)**: `#dc2626` (Red)

---

## 2. Component & Layout Redesign Strategy
1. **Masthead & Header**:
   - Pure white background with a striking 4px solid orange top accent bar.
   - Bold serif logo ("BOURSE·DAILY") in deep charcoal with an orange bullet (`·`).
   - Ticker tape with an orange background (`#fff7ed`) and dark orange text.
2. **Cards & Boxes (`.box`)**:
   - Pure white background (`#ffffff`), 2px solid orange/charcoal borders (`2px solid var(--ink)`), and sharp offset drop-shadows (`3px 3px 0 var(--orange)`).
   - On hover, cards smoothly slide/lift upwards with an orange shadow sweep.
3. **Slide & Scroll Animations**:
   - Smooth entrance slide animations (`slideInUp`, `fadeIn`, `slideInRight`) powered by `code/animations.css`.
   - Infinite horizontal marquee ticker with butter-smooth GPU acceleration.
4. **Interactive Elements & Buttons**:
   - Buttons styled with vibrant orange background (`#f97316`), white text, bold sans-serif typography, and crisp hover states.
   - Form selects and search inputs featuring orange focus rings (`outline: 2px solid var(--orange)`).

---

## 3. Implementation Steps
1. Update `css/styles.css` CSS custom properties (`:root`) to the new Orange & White editorial theme.
2. Enhance `code/animations.css` with buttery smooth slide, hover-lift, and fade keyframes.
3. Update all main HTML pages (`index.html`, `watchlist.html`, `compare.html`, `stock.html`, `learn.html`, `qa.html`) to reflect the new orange accent styling and smooth animations.
4. Test and verify in Brave browser (`http://localhost:8080/index.html`).
