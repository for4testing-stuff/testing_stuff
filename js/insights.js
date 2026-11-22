/* ==========================================================================
   BOURSE·DAILY — js/insights.js
   Tier 1: Smart Insights & Ask the Analyst Engine (Offline, Rule-Based)
   ========================================================================== */

(function() {
  // Helper to get sector median PE
  function getSectorMedianPE(sector) {
    const pes = BourseData.companies
      .filter(c => c.sector === sector && c.pe > 0)
      .map(c => c.pe)
      .sort((a, b) => a - b);
    if (pes.length === 0) return 20;
    const mid = Math.floor(pes.length / 2);
    return pes.length % 2 !== 0 ? pes[mid] : (pes[mid - 1] + pes[mid]) / 2;
  }

  // Calculate standard deviation of daily returns
  function calculateVolatility(history) {
    if (!history || history.length < 2) return 'moderate';
    const returns = [];
    for (let i = 1; i < history.length; i++) {
      returns.push((history[i] - history[i-1]) / history[i-1]);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const sd = Math.sqrt(variance) * 100;
    if (sd < 0.8) return 'calm';
    if (sd > 1.8) return 'volatile';
    return 'moderate';
  }

  const BourseInsights = {
    forStock(symbol) {
      const comp = BourseData.companies.find(c => c.symbol === symbol);
      if (!comp) return [];
      const insights = [];

      // 1. Momentum insight
      const hist = comp.history;
      const sma5 = hist.slice(-5).reduce((a,b)=>a+b,0) / 5;
      const sma20 = hist.slice(-20).reduce((a,b)=>a+b,0) / Math.min(20, hist.length);
      if (comp.price > sma5 && sma5 > sma20) {
        insights.push({
          text: `${comp.symbol} is trading above both its 5-day and 20-day moving averages, indicating short-term upward momentum.`,
          rule: 'Momentum: Price > 5-day SMA > 20-day SMA'
        });
      } else if (comp.price < sma5 && sma5 < sma20) {
        insights.push({
          text: `${comp.symbol} is trading below both its 5-day and 20-day moving averages, pointing toward short-term downward pressure.`,
          rule: 'Momentum: Price < 5-day SMA < 20-day SMA'
        });
      } else {
        insights.push({
          text: `${comp.symbol} is currently consolidating between its 5-day and 20-day moving averages without a strong directional trend.`,
          rule: 'Momentum: Price oscillating between moving averages'
        });
      }

      // 2. 52-week range position
      const range = comp.high52 - comp.low52;
      const pctPos = range > 0 ? ((comp.price - comp.low52) / range) * 100 : 50;
      if (pctPos >= 90) {
        insights.push({
          text: `The stock is trading near the upper end of its 52-week range (at ${pctPos.toFixed(0)}% of the 52-week spread).`,
          rule: '52-week position: >= 90% of (high52 - low52)'
        });
      } else if (pctPos <= 10) {
        insights.push({
          text: `The stock is trading near the lower end of its 52-week range (at ${pctPos.toFixed(0)}% of the 52-week spread).`,
          rule: '52-week position: <= 10% of (high52 - low52)'
        });
      } else {
        insights.push({
          text: `The stock is currently positioned at ${pctPos.toFixed(0)}% within its 52-week high-low band.`,
          rule: '52-week position: mid-range percentile'
        });
      }

      // 3. Valuation or Loss-making
      if (comp.pe < 0) {
        insights.push({
          text: `${comp.symbol} currently reports a negative P/E ratio and is loss-making over trailing twelve months.`,
          rule: 'Valuation: P/E < 0 indicates operating loss'
        });
      } else {
        const sectorMedian = getSectorMedianPE(comp.sector);
        if (comp.pe < sectorMedian * 0.8) {
          insights.push({
            text: `At a P/E of ${comp.pe}, ${comp.symbol} trades at a discount compared to the ${comp.sector} sector median (${sectorMedian.toFixed(1)}).`,
            rule: 'Valuation: P/E < 80% of sector median'
          });
        } else if (comp.pe > sectorMedian * 1.2) {
          insights.push({
            text: `At a P/E of ${comp.pe}, ${comp.symbol} trades at a premium compared to the ${comp.sector} sector median (${sectorMedian.toFixed(1)}).`,
            rule: 'Valuation: P/E > 120% of sector median'
          });
        } else {
          insights.push({
            text: `With a P/E ratio of ${comp.pe}, ${comp.symbol} is valued in line with the ${comp.sector} sector median (${sectorMedian.toFixed(1)}).`,
            rule: 'Valuation: P/E within ±20% of sector median'
          });
        }
      }

      return insights;
    },

    forMarket() {
      const companies = BourseData.companies;
      const gainers = companies.filter(c => c.change >= 0).length;
      const losers = companies.length - gainers;
      
      // Top sector calculation
      const sectorMap = {};
      companies.forEach(c => {
        if (!sectorMap[c.sector]) sectorMap[c.sector] = { totalChg: 0, count: 0 };
        sectorMap[c.sector].totalChg += c.changePct;
        sectorMap[c.sector].count += 1;
      });
      let topSector = 'Technology';
      let maxAvg = -999;
      Object.keys(sectorMap).forEach(sec => {
        const avg = sectorMap[sec].totalChg / sectorMap[sec].count;
        if (avg > maxAvg) {
          maxAvg = avg;
          topSector = sec;
        }
      });

      return [
        {
          text: `Market breadth shows ${gainers} advancing equities against ${losers} declining issues across primary exchanges.`,
          rule: 'Market summary: count of gainers vs losers'
        },
        {
          text: `The ${topSector} sector leads today's session with an average gain of +${maxAvg.toFixed(2)}%.`,
          rule: 'Sector performance: highest average percentage change'
        },
        {
          text: `Trading volume remains active across high-cap constituents with steady institutional participation.`,
          rule: 'Volume analysis: aggregate turnover tracking'
        }
      ];
    },

    forPortfolio() {
      const holdings = BourseData.Store.getHoldings();
      if (holdings.length === 0) {
        return [{ text: 'Your portfolio currently contains no active equity holdings.', rule: 'Holdings count == 0' }];
      }

      // Calculate sector concentrations
      const sectorTotals = {};
      let totalPortfolioVal = 0;
      holdings.forEach(h => {
        const comp = BourseData.companies.find(c => c.symbol === h.symbol);
        if (!comp) return;
        const val = h.qty * comp.price;
        totalPortfolioVal += val;
        sectorTotals[comp.sector] = (sectorTotals[comp.sector] || 0) + val;
      });

      const insights = [];
      Object.keys(sectorTotals).forEach(sec => {
        const pct = (sectorTotals[sec] / (totalPortfolioVal || 1)) * 100;
        if (pct > 40) {
          insights.push({
            text: `High sector concentration warning: The ${sec} sector accounts for ${pct.toFixed(0)}% of your portfolio value.`,
            rule: 'Concentration: Sector weight > 40%'
          });
        }
      });

      if (insights.length === 0) {
        insights.push({
          text: `Your portfolio maintains a healthy diversification across multiple industry sectors.`,
          rule: 'Concentration: No single sector > 40%'
        });
      }

      // Volatility insight for holdings
      let totalVolScore = 0;
      holdings.forEach(h => {
        const comp = BourseData.companies.find(c => c.symbol === h.symbol);
        if (comp) totalVolScore += calculateVolatility(comp.history) === 'volatile' ? 2 : 1;
      });
      const avgVol = totalVolScore / holdings.length;
      if (avgVol > 1.5) {
        insights.push({
          text: `Overall portfolio volatility is elevated due to holdings in high-beta growth sectors.`,
          rule: 'Portfolio volatility: average standard deviation of returns'
        });
      } else {
        insights.push({
          text: `Portfolio volatility is moderate, reflecting a balanced mix of steady and cyclical equities.`,
          rule: 'Portfolio volatility: average standard deviation within normal bounds'
        });
      }

      return insights;
    },

    answerQuery(query) {
      q = query.toLowerCase().trim();
      if (!q) return { answer: 'Please enter a question or select an example below.', table: null };

      // Intent 1: 52-week high
      if (q.includes('52-week high') || q.includes('near high')) {
        const matches = BourseData.companies.filter(c => {
          const range = c.high52 - c.low52;
          return range > 0 && ((c.price - c.low52) / range) >= 0.85;
        }).slice(0, 5);
        return {
          answer: `Here are equities trading near the upper end of their 52-week range:`,
          table: matches
        };
      }

      // Intent 2: Loss-making
      if (q.includes('loss') || q.includes('negative p/e') || q.includes('loss-making')) {
        const matches = BourseData.companies.filter(c => c.pe < 0);
        return {
          answer: `Companies currently reporting negative P/E ratios and operating losses:`,
          table: matches
        };
      }

      // Intent 3: Compare two symbols
      const symbols = BourseData.companies.map(c => c.symbol.toLowerCase());
      const mentioned = symbols.filter(s => q.includes(s));
      if (mentioned.length >= 2) {
        const c1 = BourseData.companies.find(c => c.symbol.toLowerCase() === mentioned[0]);
        const c2 = BourseData.companies.find(c => c.symbol.toLowerCase() === mentioned[1]);
        return {
          answer: `Comparison between ${c1.symbol} (${c1.name}) and ${c2.symbol} (${c2.name}):`,
          table: [c1, c2]
        };
      }

      // Intent 4: Biggest gainer in sector
      const sectors = [...new Set(BourseData.companies.map(c => c.sector.toLowerCase()))];
      const foundSector = sectors.find(sec => q.includes(sec));
      if (foundSector) {
        const inSector = BourseData.companies.filter(c => c.sector.toLowerCase() === foundSector);
        inSector.sort((a, b) => b.changePct - a.changePct);
        return {
          answer: `Top performing equities in the ${foundSector} sector today:`,
          table: inSector.slice(0, 3)
        };
      }

      // Intent 5: Glossary terms
      if (q.includes('what is p/e') || q.includes('pe ratio')) {
        return {
          answer: 'The Price-to-Earnings (P/E) ratio measures a company\'s share price relative to its annual earnings per share. A lower P/E may indicate undervaluation or lower growth expectations.',
          table: null
        };
      }
      if (q.includes('market cap')) {
        return {
          answer: 'Market Capitalization (M-Cap) is the total monetary value of a company\'s outstanding shares, calculated as share price multiplied by total shares.',
          table: null
        };
      }

      // Fallback
      return {
        answer: 'I could not match that query to a specific market rule. Try one of these example questions:',
        table: null,
        chips: [
          'Which stocks are near their 52-week high?',
          'Show loss-making companies',
          'Compare MRDN and CYBR',
          'Biggest gainer in Technology'
        ]
      };
    }
  };

  window.BourseInsights = BourseInsights;
})();
