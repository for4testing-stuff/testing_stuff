/* ==========================================================================
   BOURSE·DAILY — js/dividend.js
   New Feature: Dividend Yield Screener & Calculator
   ========================================================================== */

(function() {
  function calculateDividendYields() {
    if (typeof BourseData === 'undefined') return [];
    return BourseData.companies.map(c => {
      let hash = 0;
      for (let i = 0; i < c.symbol.length; i++) hash += c.symbol.charCodeAt(i);
      const divPayout = Number(((hash % 35) + 5).toFixed(2));
      const divYield = Number(((divPayout / c.price) * 100).toFixed(2));
      return {
        ...c,
        divPayout,
        divYield
      };
    }).sort((a, b) => b.divYield - a.divYield);
  }

  window.BourseDividend = {
    calculateDividendYields
  };
})();
