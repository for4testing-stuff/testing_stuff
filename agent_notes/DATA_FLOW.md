# DATA FLOW

- Data Source: `js/data.js` exposes global `BourseData` containing mock companies, indices, sectors, and helper formatting functions (`formatINR`, `formatChange`).
- State Management:
  - LocalStorage stores user watchlist symbols (`bourse_watchlist`), portfolio holdings (`bourse_portfolio`), and dark mode preferences (`bourse_dark_mode`).
  - SessionStorage stores AI API keys and configurations (`bourse_ai_config`).
- Real-time Updates: `js/app.js` runs a background timer simulating live price fluctuations and updates DOM nodes and charts dynamically.
