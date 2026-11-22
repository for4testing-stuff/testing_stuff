/* ==========================================================================
   BOURSE·DAILY — code/animations.js (Copied verbatim from specification package)
   ========================================================================== */

/* ==========================================================================
   BOURSE·DAILY — ANIMATIONS & MICROINTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. TICKER PAUSE ON HOVER
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  // 2. LIVE PRICE SIMULATION ENGINE
  let simulationPaused = false;
  const pauseBtn = document.getElementById('sim-pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      simulationPaused = !simulationPaused;
      pauseBtn.textContent = simulationPaused ? 'Resume Ticker' : 'Pause Ticker';
      pauseBtn.classList.toggle('active', simulationPaused);
    });
  }

  // Live simulation tick every 3 seconds
  setInterval(() => {
    if (simulationPaused || prefersReducedMotion) return;
    if (typeof BourseData === 'undefined') return;

    const companies = BourseData.companies;
    // Pick 2-4 random companies to update
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * companies.length);
      const comp = companies[idx];
      const delta = (Math.random() - 0.49) * (comp.price * 0.008);
      const oldPrice = comp.price;
      comp.price = Number((comp.price + delta).toFixed(2));
      comp.change = Number((comp.price - comp.prevClose).toFixed(2));
      comp.changePct = Number((comp.change / comp.prevClose * 100).toFixed(2));

      // Trigger DOM updates if elements exist
      updatePriceInDOM(comp.symbol, comp.price, comp.change, comp.changePct, comp.price > oldPrice);
    }
  }, 3000);

  function updatePriceInDOM(symbol, price, change, changePct, isUp) {
    // Find all elements corresponding to this symbol
    const priceEls = document.querySelectorAll(`[data-price-symbol="${symbol}"]`);
    priceEls.forEach(el => {
      const oldVal = parseFloat(el.textContent.replace(/,/g, '')) || price;
      el.textContent = BourseData.formatINR(price);
      
      // Flash effect
      if (!prefersReducedMotion) {
        el.classList.remove('flash-up', 'flash-down');
        void el.offsetWidth; // trigger reflow
        el.classList.add(price >= oldVal ? 'flash-up' : 'flash-down');
      }
    });

    const changeEls = document.querySelectorAll(`[data-change-symbol="${symbol}"]`);
    changeEls.forEach(el => {
      el.innerHTML = BourseData.formatChange(change, changePct);
    });
  }

  // 3. SEARCH AUTOCOMPLETE & KEYBOARD NAVIGATION
  const searchInput = document.getElementById('search-input');
  const searchDropdown = document.getElementById('search-dropdown');

  if (searchInput && searchDropdown) {
    let selectedIndex = -1;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      selectedIndex = -1;
      if (!query) {
        searchDropdown.classList.remove('active');
        searchDropdown.innerHTML = '';
        return;
      }

      const matches = BourseData.companies.filter(c => 
        c.symbol.toLowerCase().includes(query) || 
        c.name.toLowerCase().includes(query) ||
        c.sector.toLowerCase().includes(query)
      ).slice(0, 6);

      if (matches.length === 0) {
        searchDropdown.innerHTML = '<div class="search-item">No matching companies found</div>';
        searchDropdown.classList.add('active');
        return;
      }

      searchDropdown.innerHTML = matches.map((c, i) => `
        <a href="stock.html?symbol=${c.symbol}" class="search-item" data-index="${i}">
          <div>
            <strong class="mono">${c.symbol}</strong> - ${c.name}
            <div style="font-size:11px; color:var(--mute);">${c.sector}</div>
          </div>
          <div style="text-align:right;">
            <div class="mono">₹ ${BourseData.formatINR(c.price)}</div>
            <div style="font-size:11px;">${BourseData.formatChange(c.change, c.changePct)}</div>
          </div>
        </a>
      `).join('');
      searchDropdown.classList.add('active');
    });

    searchInput.addEventListener('keydown', (e) => {
      const items = searchDropdown.querySelectorAll('.search-item');
      if (!searchDropdown.classList.contains('active') || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateHighlight(items);
      } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].click();
      } else if (e.key === 'Escape') {
        searchDropdown.classList.remove('active');
        selectedIndex = -1;
      }
    });

    function updateHighlight(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('highlighted');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('highlighted');
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
      }
    });
  }

  // 4. WATCHLIST STARS WITH UNDO TOAST
  document.addEventListener('click', (e) => {
    const starBtn = e.target.closest('.star-btn');
    if (!starBtn) return;
    e.preventDefault();
    e.stopPropagation();

    const symbol = starBtn.dataset.symbol;
    if (!symbol) return;

    let watchlist = BourseData.Store.getWatchlist();
    const isStarred = watchlist.includes(symbol);

    if (isStarred) {
      watchlist = watchlist.filter(s => s !== symbol);
      starBtn.classList.remove('starred');
      starBtn.innerHTML = '☆';
      showToast(`Removed ${symbol} from Watchlist`, () => {
        watchlist.push(symbol);
        BourseData.Store.setWatchlist(watchlist);
        starBtn.classList.add('starred');
        starBtn.innerHTML = '★';
        updateWatchlistUI();
      });
    } else {
      watchlist.push(symbol);
      starBtn.classList.add('starred');
      starBtn.innerHTML = '★';
      showToast(`Added ${symbol} to Watchlist`, () => {
        watchlist = watchlist.filter(s => s !== symbol);
        BourseData.Store.setWatchlist(watchlist);
        starBtn.classList.remove('starred');
        starBtn.innerHTML = '☆';
        updateWatchlistUI();
      });
    }
    BourseData.Store.setWatchlist(watchlist);
    updateWatchlistUI();
  });

  function updateWatchlistUI() {
    // If watchlist page table exists, re-render
    const watchlistTableBody = document.getElementById('watchlist-tbody');
    if (watchlistTableBody && typeof renderWatchlistPage === 'function') {
      renderWatchlistPage();
    }
  }

  function showToast(message, undoCallback) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    if (undoCallback) {
      const undoBtn = document.createElement('button');
      undoBtn.textContent = 'UNDO';
      undoBtn.addEventListener('click', () => {
        undoCallback();
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 250);
      });
      toast.appendChild(undoBtn);
    }

    container.appendChild(toast);
    setTimeout(() => {
      if (!toast.classList.contains('out')) {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 250);
      }
    }, 4000);
  }
  window.BourseToast = { show: showToast };

  // 5. BUY / SELL MODAL
  const modalBackdrop = document.getElementById('trade-modal');
  const modalClose = document.getElementById('modal-close');
  const qtyInput = document.getElementById('trade-qty');
  const totalValEl = document.getElementById('trade-total');
  const buyTab = document.getElementById('tab-buy');
  const sellTab = document.getElementById('tab-sell');
  const submitTradeBtn = document.getElementById('submit-trade-btn');

  let currentTradeSymbol = 'MRDN';
  let tradeType = 'BUY'; // BUY or SELL

  window.openTradeModal = function(symbol, type = 'BUY') {
    currentTradeSymbol = symbol;
    tradeType = type;
    if (!modalBackdrop) return;

    const comp = BourseData.companies.find(c => c.symbol === symbol) || BourseData.companies[0];
    document.getElementById('modal-title').textContent = `${type} — ${comp.symbol} (${comp.name})`;
    document.getElementById('modal-price').textContent = `₹ ${BourseData.formatINR(comp.price)}`;
    qtyInput.value = '10';
    updateTradeTotal(comp.price);

    if (buyTab && sellTab) {
      buyTab.classList.toggle('active', type === 'BUY');
      sellTab.classList.toggle('active', type === 'SELL');
    }

    modalBackdrop.classList.add('open');
    qtyInput.focus();
  };

  if (modalClose) {
    modalClose.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }

  if (buyTab && sellTab) {
    buyTab.addEventListener('click', () => {
      tradeType = 'BUY';
      buyTab.classList.add('active');
      sellTab.classList.remove('active');
      submitTradeBtn.textContent = 'Confirm Buy Order';
    });
    sellTab.addEventListener('click', () => {
      tradeType = 'SELL';
      sellTab.classList.add('active');
      buyTab.classList.remove('active');
      submitTradeBtn.textContent = 'Confirm Sell Order';
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('input', () => {
      const comp = BourseData.companies.find(c => c.symbol === currentTradeSymbol) || BourseData.companies[0];
      updateTradeTotal(comp.price);
    });
  }

  function updateTradeTotal(price) {
    const qty = parseInt(qtyInput.value) || 0;
    const total = qty * price;
    if (totalValEl) totalValEl.textContent = `₹ ${BourseData.formatINR(total)}`;
  }

  if (submitTradeBtn) {
    submitTradeBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value) || 0;
      if (qty <= 0) {
        alert('Please enter a valid quantity.');
        return;
      }
      const comp = BourseData.companies.find(c => c.symbol === currentTradeSymbol) || BourseData.companies[0];
      
      let holdings = BourseData.Store.getHoldings();
      const existing = holdings.find(h => h.symbol === currentTradeSymbol);

      if (tradeType === 'BUY') {
        if (existing) {
          const totalCost = (existing.qty * existing.avgPrice) + (qty * comp.price);
          existing.qty += qty;
          existing.avgPrice = totalCost / existing.qty;
        } else {
          holdings.push({ symbol: currentTradeSymbol, qty: qty, avgPrice: comp.price });
        }
        showToast(`Successfully bought ${qty} shares of ${currentTradeSymbol}`);
      } else {
        if (!existing || existing.qty < qty) {
          alert('You do not own enough shares to sell this quantity.');
          return;
        }
        existing.qty -= qty;
        if (existing.qty === 0) {
          holdings = holdings.filter(h => h.symbol !== currentTradeSymbol);
        }
        showToast(`Successfully sold ${qty} shares of ${currentTradeSymbol}`);
      }

      BourseData.Store.setHoldings(holdings);
      modalBackdrop.classList.remove('open');
      if (typeof renderPortfolioPage === 'function') {
        renderPortfolioPage();
      }
    });
  }

  // Global event delegation for trade buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-trade-action]');
    if (!btn) return;
    const symbol = btn.dataset.symbol || 'MRDN';
    const action = btn.dataset.tradeAction; // BUY or SELL
    openTradeModal(symbol, action);
  });

  // 6. NEWSPAPER FOLD / PAGE TRANSITION EFFECT
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript"])');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('http') || href.includes('?')) return;
      // Allow normal navigation with newspaper fold class if desired
    });
  });

});
