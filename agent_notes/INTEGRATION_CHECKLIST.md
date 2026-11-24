# INTEGRATION CHECKLIST

| Feature | Files | API/Handler | How to Verify | Expected Result | Result |
|---|---|---|---|---|---|
| Real-time Ticker & Simulation | `js/app.js`, `js/data.js` | `setInterval` price updates | Check live ticker & indices | Prices and changes update dynamically | PASS |
| Watchlist & Portfolio Management | `watchlist.html`, `js/app.js` | LocalStorage + DOM | Add/remove items, update qty | Holdings and P&L update correctly | PASS |
| Advanced Portfolio Risk Analytics | `watchlist.html`, `js/app.js` | Computed metrics | View portfolio section | Beta, VaR, Sharpe, Div Yield displayed | PASS |
| Side-by-Side Comparison Engine | `compare.html` | `BourseData.companies` | Select 3 stocks & view table/chart | 11 fundamental metrics & 30D chart render | PASS |
| Dark Mode Toggle | `css/styles.css`, `js/app.js` | DOM class + LocalStorage | Click Dark Mode button | Theme switches instantly and persists | PASS |
| Stock Detail & Charts | `stock.html`, `js/charts.js` | Chart.js instance | Open stock detail view | Charts and stats render without error | PASS |
| Learning Hub & FAQ | `learn.html` | Accordion UI | Click FAQ items | Modules expand smoothly | PASS |
| QA Dashboard | `qa.html` | QA report view | Open QA page | Report table renders | PASS |
