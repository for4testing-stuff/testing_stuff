/* ==========================================================================
   BOURSE·DAILY — js/data.js
   20 Fictional Indian Companies with generated stocks, fundamentals, and seedable PRNG.
   ========================================================================== */

(function() {
  // Simple LCG PRNG seeded by symbol string so charts are identical on every visit
  function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
      hash |= 0;
    }
    let seed = Math.abs(hash);
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  const RAW_COMPANIES = [
    { symbol: 'MRDN', name: 'Meridian Agro & Chemicals', sector: 'Agri & Chemicals', price: 1245.50, prevClose: 1210.00, mCap: '48,230 Cr', pe: 24.5, high52: 1402.80, low52: 842.10, desc: 'Meridian Agro & Chemicals Ltd is a leading manufacturer of specialty crop nutrients, agrochemicals and industrial polymers with extensive domestic and export distribution.' },
    { symbol: 'TCCL', name: 'Titanium Crown Cement', sector: 'Materials', price: 812.30, prevClose: 825.00, mCap: '31,450 Cr', pe: 18.2, high52: 950.00, low52: 620.00, desc: 'Titanium Crown Cement produces premium high-grade cement and building materials across western and southern corridors.' },
    { symbol: 'VTLK', name: 'Veda Telelink & Networks', sector: 'Telecom', price: 342.10, prevClose: 331.40, mCap: '62,100 Cr', pe: 32.1, high52: 395.50, low52: 240.00, desc: 'Veda Telelink provides next-generation optical fiber infrastructure and enterprise cloud connectivity solutions.' },
    { symbol: 'ELIX', name: 'Elixir Pharma Innovations', sector: 'Healthcare', price: 2150.75, prevClose: 2105.00, mCap: '89,200 Cr', pe: 38.4, high52: 2480.00, low52: 1650.00, desc: 'Elixir Pharma develops specialty oncology formulations and active pharmaceutical ingredients for global markets.' },
    { symbol: 'SOLR', name: 'Solaris Power Grid', sector: 'Energy & Power', price: 624.80, prevClose: 618.50, mCap: '1,12,400 Cr', pe: 21.0, high52: 710.00, low52: 450.00, desc: 'Solaris Power Grid operates utility-scale solar photovoltaic installations and high-voltage transmission networks.' },
    { symbol: 'AURM', name: 'Aurelia FinCorp & Leasing', sector: 'Financials', price: 1485.20, prevClose: 1510.00, mCap: '74,500 Cr', pe: 15.6, high52: 1690.00, low52: 1100.00, desc: 'Aurelia FinCorp offers retail credit, SME working capital loans and asset-backed structured leasing services.' },
    { symbol: 'CYBR', name: 'CyberSphere Systems', sector: 'Technology', price: 3120.40, prevClose: 3045.00, mCap: '1,45,000 Cr', pe: 42.8, high52: 3500.00, low52: 2200.00, desc: 'CyberSphere Systems delivers enterprise cybersecurity software, AI-driven threat intelligence and cloud DevOps.' },
    { symbol: 'INDL', name: 'Indus Steel & Alloys', sector: 'Metals & Mining', price: 485.60, prevClose: 492.00, mCap: '28,900 Cr', pe: 11.4, high52: 580.00, low52: 360.00, desc: 'Indus Steel produces high-tensile structural steel, alloy plates and specialized railway components.' },
    { symbol: 'NEPT', name: 'Neptune Maritime Logistics', sector: 'Logistics', price: 718.90, prevClose: 702.30, mCap: '19,800 Cr', pe: 19.8, high52: 830.00, low52: 510.00, desc: 'Neptune Maritime operates container feeder vessels, port terminal facilities and multimodal freight corridors.' },
    { symbol: 'ZPHR', name: 'Zephyr Aviation & Travels', sector: 'Aviation & Tour', price: 214.30, prevClose: 220.10, mCap: '14,200 Cr', pe: -14.2, high52: 290.00, low52: 180.00, desc: 'Zephyr Aviation operates a domestic fleet of passenger aircraft connecting Tier-2 and Tier-3 urban centers.' },
    { symbol: 'KRLS', name: 'Keralam Rubber & Plantation', sector: 'Agri & Chemicals', price: 925.40, prevClose: 915.00, mCap: '12,600 Cr', pe: 16.5, high52: 1050.00, low52: 720.00, desc: 'Keralam Rubber cultivates and processes high-grade natural rubber latex for automotive tire manufacturers.' },
    { symbol: 'ASTRA', name: 'Astra Defense & Aerospace', sector: 'Defense & Aero', price: 2840.10, prevClose: 2750.00, mCap: '98,400 Cr', pe: 51.2, high52: 3100.00, low52: 1450.00, desc: 'Astra Defense manufactures avionics, radar systems, and lightweight tactical vehicle components for defense.' },
    { symbol: 'BENG', name: 'Bengal Breweries & Beverages', sector: 'FMCG', price: 540.20, prevClose: 538.90, mCap: '36,200 Cr', pe: 35.4, high52: 610.00, low52: 440.00, desc: 'Bengal Breweries produces non-alcoholic beverages, malt extracts, and premium consumer refreshment goods.' },
    { symbol: 'DVNA', name: 'Divina Retail & Hypermarkets', sector: 'Retail', price: 672.50, prevClose: 685.00, mCap: '52,100 Cr', pe: 44.0, high52: 790.00, low52: 520.00, desc: 'Divina Retail operates a pan-India network of omnichannel hypermarkets, supermarkets, and fashion boutiques.' },
    { symbol: 'GAMA', name: 'Gamma Infrastructure Corp', sector: 'Infrastructure', price: 385.90, prevClose: 379.20, mCap: '41,800 Cr', pe: 22.7, high52: 440.00, low52: 290.00, desc: 'Gamma Infra constructs highways, urban metro rail tunnels, and multi-story commercial real estate complexes.' },
    { symbol: 'HIML', name: 'Himalayan Mineral Waters', sector: 'FMCG', price: 195.40, prevClose: 192.10, mCap: '8,400 Cr', pe: 29.1, high52: 225.00, low52: 150.00, desc: 'Himalayan Mineral Waters sources pristine spring water from high-altitude aquifers for premium bottling.' },
    { symbol: 'MAGN', name: 'Magnum Auto Components', sector: 'Automotive', price: 1120.80, prevClose: 1135.00, mCap: '25,600 Cr', pe: 20.3, high52: 1310.00, low52: 890.00, desc: 'Magnum Auto manufactures precision gearboxes, transmission assemblies, and electric motor stators.' },
    { symbol: 'ORCA', name: 'Orca Shipping & Dredging', sector: 'Logistics', price: 445.30, prevClose: 436.80, mCap: '16,500 Cr', pe: 14.8, high52: 510.00, low52: 340.00, desc: 'Orca Shipping provides harbor dredging, maritime towage, and offshore oilfield support vessel charters.' },
    { symbol: 'PRSM', name: 'Prism Optoelectronics', sector: 'Technology', price: 1580.60, prevClose: 1520.00, mCap: '58,300 Cr', pe: 48.9, high52: 1750.00, low52: 980.00, desc: 'Prism Optoelectronics designs high-resolution display panels, camera modules, and laser sensors.' },
    { symbol: 'VULT', name: 'Vulture Asset Management', sector: 'Financials', price: 2310.00, prevClose: 2340.00, mCap: '82,000 Cr', pe: 26.4, high52: 2600.00, low52: 1700.00, desc: 'Vulture Asset Management manages private equity funds, corporate debt restructuring, and mutual funds.' }
  ];

  // Enrich companies with generated chart data
  const companies = RAW_COMPANIES.map(c => {
    const rng = seededRandom(c.symbol);
    const change = c.price - c.prevClose;
    const changePct = (change / c.prevClose) * 100;
    
    // Generate 30 days history
    const history = [];
    let p = c.prevClose;
    for (let i = 0; i < 30; i++) {
      const delta = (rng() - 0.48) * (p * 0.025);
      p = Number((p + delta).toFixed(2));
      history.push(p);
    }
    history[history.length - 1] = c.price;

    // Generate intraday points
    const intraday = [];
    let ip = c.prevClose;
    for (let i = 0; i < 24; i++) {
      const delta = (rng() - 0.49) * (ip * 0.008);
      ip = Number((ip + delta).toFixed(2));
      intraday.push(ip);
    }
    intraday[intraday.length - 1] = c.price;

    return {
      ...c,
      change: Number(change.toFixed(2)),
      changePct: Number(changePct.toFixed(2)),
      history,
      intraday,
      volume: Math.floor(rng() * 450000 + 50000),
      turnover: '₹ ' + (Math.floor(rng() * 80 + 10)) + ' Cr',
      bid: Number((c.price * 0.999).toFixed(2)),
      ask: Number((c.price * 1.001).toFixed(2))
    };
  });

  // Format Indian Numbering System (e.g. 4,82,300)
  function formatINR(num, decimals = 2) {
    if (isNaN(num)) return num;
    let parts = Number(num).toFixed(decimals).split('.');
    let intPart = parts[0];
    let decPart = parts[1] ? '.' + parts[1] : '';
    
    if (intPart.length > 3) {
      let last3 = intPart.slice(-3);
      let rest = intPart.slice(0, -3);
      rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      intPart = rest + ',' + last3;
    }
    return intPart + decPart;
  }

  // Format price change with sign and arrow
  function formatChange(change, changePct) {
    const isUp = change >= 0;
    const sign = isUp ? '+' : '';
    const arrow = isUp ? '▲' : '▼';
    return `<span class="${isUp ? 'up' : 'dn'} mono">${arrow} ${sign}${formatINR(change)} (${sign}${changePct.toFixed(2)}%)</span>`;
  }

  // LocalStorage helper for Watchlist & Holdings
  const Store = {
    getWatchlist() {
      try {
        const d = localStorage.getItem('bourse_watchlist');
        return d ? JSON.parse(d) : ['MRDN', 'CYBR', 'ASTRA', 'SOLR', 'AURM'];
      } catch(e) {
        return ['MRDN', 'CYBR', 'ASTRA', 'SOLR', 'AURM'];
      }
    },
    setWatchlist(list) {
      try {
        localStorage.setItem('bourse_watchlist', JSON.stringify(list));
      } catch(e) {}
    },
    getHoldings() {
      try {
        const d = localStorage.getItem('bourse_holdings');
        return d ? JSON.parse(d) : [
          { symbol: 'MRDN', qty: 150, avgPrice: 1180.00 },
          { symbol: 'CYBR', qty: 45, avgPrice: 2950.00 },
          { symbol: 'ASTRA', qty: 80, avgPrice: 2600.00 },
          { symbol: 'SOLR', qty: 300, avgPrice: 590.00 }
        ];
      } catch(e) {
        return [
          { symbol: 'MRDN', qty: 150, avgPrice: 1180.00 },
          { symbol: 'CYBR', qty: 45, avgPrice: 2950.00 },
          { symbol: 'ASTRA', qty: 80, avgPrice: 2600.00 },
          { symbol: 'SOLR', qty: 300, avgPrice: 590.00 }
        ];
      }
    },
    setHoldings(h) {
      try {
        localStorage.setItem('bourse_holdings', JSON.stringify(h));
      } catch(e) {}
    }
  };

  window.BourseData = {
    companies,
    formatINR,
    formatChange,
    Store
  };
})();
