# ARCHITECTURE

## Entry Points and Rendering Model
- Client-side rendered static HTML pages served by a static file server (`http.server`).
- HTML pages:
  - `index.html`: Markets overview & home page (`index.html`).
  - `watchlist.html`: Watchlist and portfolio management (`watchlist.html`).
  - `stock.html`: Individual stock detail view (`stock.html`).
  - `compare.html`: Multi-company side-by-side comparison engine (`compare.html`).
  - `learn.html`: Financial learning hub and FAQ (`learn.html`).
  - `qa.html`: QA Report dashboard (`qa.html`).
  - `presentation.html`: Project presentation demo (`presentation.html`).
- Core JavaScript Modules (`js/`):
  - `js/data.js`: Mock financial dataset, company profiles, formatting helpers (`BourseData`).
  - `js/app.js`: Main application logic, real-time simulated price ticker engine, search, watchlists, dark mode controller.
  - `js/charts.js`: Chart.js integrations for portfolio and stock price charts.
  - `js/insights.js`: AI insights briefing generator.
  - `js/ai-bridge.js`: Optional real LLM bridge (OpenAI, Anthropic).
  - `js/dividend.js`: Dividend calculator and analysis.
- Stylesheets (`css/`):
  - `css/styles.css`: Master stylesheet with design system variables, dark mode overrides, grid system, typography rules.
- Animation Lab (`code/`):
  - `code/animations.css`, `code/animations.js`, `code/animation-lab.html`.
