# UI AUDIT

## Screens Table

| ID | Name | File Path | Description |
|---|---|---|---|
| S01 | Markets Overview / Home | `index.html` | Main market dashboard, indices, live simulation ticker, news, and AI insights. |
| S02 | Watchlist & Portfolio | `watchlist.html` | Watchlist management, portfolio holdings, P&L calculations, advanced analytics. |
| S03 | Stock Detail | `stock.html` | Individual stock charts, key statistics, financials, and analyst ratings. |
| S04 | Compare Stocks | `compare.html` | Side-by-side fundamental comparison and 30-day normalized performance chart. |
| S05 | Learn & Analysis | `learn.html` | Financial education modules, terminology, and FAQ. |
| S06 | QA Report Dashboard | `qa.html` | Automated test results and QA checklist report. |
| S07 | Presentation View | `presentation.html` | Project demonstration and executive overview view. |
| S08 | Animation Lab | `code/animation-lab.html` | Laboratory view for CSS animations and components. |

## Screen Findings

### S01: Markets Overview (`index.html`)
- **Severity: Medium** | File: `index.html` | Finding: Search dropdown positioning can overlap ticker elements on smaller laptops.
- **Severity: Low** | File: `index.html` | Finding: Hero grid layout needs tighter padding synchronization across screen sizes.

### S02: Watchlist & Portfolio (`watchlist.html`)
- **Severity: Medium** | File: `watchlist.html` | Finding: Portfolio analytics cards wrap awkwardly on medium-width screens if holdings list is empty.
- **Severity: Low** | File: `watchlist.html` | Finding: Table scroll overflow on mobile viewports.

### S03: Stock Detail (`stock.html`)
- **Severity: Low** | File: `stock.html` | Finding: Tab navigation buttons need more distinct active state contrast.

### S04: Compare Stocks (`compare.html`)
- **Severity: Medium** | File: `compare.html` | Finding: Comparison table grid columns can truncate long company names on narrow screens.

### S05: Learn & Analysis (`learn.html`)
- **Severity: Low** | File: `learn.html` | Finding: Accordion items lack smooth expansion transition.

### S06: QA Report Dashboard (`qa.html`)
- **Severity: Low** | File: `qa.html` | Finding: Status badges could use clearer color coding.

### S07: Presentation View (`presentation.html`)
- **Severity: Low** | File: `presentation.html` | Finding: Presentation slide container needs centered max-width constraints.

### S08: Animation Lab (`code/animation-lab.html`)
- **Severity: Low** | File: `code/animation-lab.html` | Finding: Standalone lab page uses inline style defaults.
