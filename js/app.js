/* ==========================================================================
   BOURSE·DAILY — js/app.js (Master application controller)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. DYNAMIC DATE & VOLUME GENERATION (A3)
  const dateEls = document.querySelectorAll('#current-date');
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-IN', options).toUpperCase();
  // Derive volume/issue number from date
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const volNum = 24;
  const issueNum = 50 + (dayOfYear % 150);
  const fullDateText = `${dateStr} — VOL. XXIV NO. ${issueNum}`;
  dateEls.forEach(el => el.textContent = fullDateText);

  // 2. TICKER PAUSE & SEAMLESS DUP (A5)
  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack && window.BourseData) {
    const items = BourseData.companies.map(c => `
      <div class="ticker-item">
        <span class="symbol">${c.symbol}</span>
        <span class="price mono" data-price-symbol="${c.symbol}">₹ ${BourseData.formatINR(c.price)}</span>
        <span class="chg ${c.change >= 0 ? 'up' : 'dn'}" data-change-symbol="${c.symbol}" aria-live="polite">${c.change >= 0 ? '▲' : '▼'} ${c.change >= 0 ? '+' : ''}${BourseData.formatINR(c.change)}</span>
      </div>
    `).join('');
    tickerTrack.innerHTML = items + `<div aria-hidden="true" style="display:flex;">` + items + `</div>`;

    tickerTrack.addEventListener('mouseenter', () => tickerTrack.style.animationPlayState = 'paused');
    tickerTrack.addEventListener('mouseleave', () => tickerTrack.style.animationPlayState = 'running');
  }

  // DARK MODE TOGGLE CONTROLLER
  const darkModeBtn = document.getElementById('dark-mode-toggle');
  if (darkModeBtn) {
    if (localStorage.getItem('bourse_dark_mode') === 'true') {
      document.body.classList.add('dark-mode');
      darkModeBtn.textContent = 'Light Mode';
    }
    darkModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('bourse_dark_mode', isDark);
      darkModeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }
  let simulationPaused = false;
  const pauseBtn = document.getElementById('sim-pause-btn');
  if (pauseBtn) {
    pauseBtn.setAttribute('aria-label', 'Pause or resume live price ticker simulation');
    pauseBtn.addEventListener('click', () => {
      simulationPaused = !simulationPaused;
      pauseBtn.textContent = simulationPaused ? 'Resume Ticker' : 'Pause Ticker';
      pauseBtn.setAttribute('aria-pressed', simulationPaused);
      pauseBtn.classList.toggle('active', simulationPaused);
    });
  }

  setInterval(() => {
    if (simulationPaused || prefersReducedMotion) return;
    if (typeof BourseData === 'undefined') return;

    const companies = BourseData.companies;
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * companies.length);
      const comp = companies[idx];
      const delta = (Math.random() - 0.49) * (comp.price * 0.008);
      const oldPrice = comp.price;
      comp.price = Number((comp.price + delta).toFixed(2));
      comp.change = Number((comp.price - comp.prevClose).toFixed(2));
      comp.changePct = Number((comp.change / comp.prevClose * 100).toFixed(2));

      updatePriceInDOM(comp.symbol, comp.price, comp.change, comp.changePct, comp.price >= oldPrice);
    }
  }, 3000);

  function updatePriceInDOM(symbol, price, change, changePct, isUp) {
    const priceEls = document.querySelectorAll(`[data-price-symbol="${symbol}"]`);
    priceEls.forEach(el => {
      const oldVal = parseFloat(el.textContent.replace(/,/g, '')) || price;
      el.textContent = BourseData.formatINR(price);
      if (!prefersReducedMotion) {
        el.classList.remove('flash-up', 'flash-down');
        void el.offsetWidth;
        el.classList.add(price >= oldVal ? 'flash-up' : 'flash-down');
      }
    });

    const changeEls = document.querySelectorAll(`[data-change-symbol="${symbol}"]`);
    changeEls.forEach(el => {
      el.innerHTML = BourseData.formatChange(change, changePct);
    });
  }

  // 4. SEARCH AUTOCOMPLETE & KEYBOARD NAVIGATION (B8)
  const searchInput = document.getElementById('search-input');
  const searchDropdown = document.getElementById('search-dropdown');

  if (searchInput && searchDropdown) {
    let selectedIndex = -1;
    searchInput.setAttribute('role', 'combobox');
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.setAttribute('aria-autocomplete', 'list');
    searchInput.setAttribute('aria-controls', 'search-dropdown');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      selectedIndex = -1;
      if (!query) {
        searchDropdown.classList.remove('active');
        searchDropdown.innerHTML = '';
        searchInput.setAttribute('aria-expanded', 'false');
        return;
      }

      const matches = BourseData.companies.filter(c => 
        c.symbol.toLowerCase().includes(query) || 
        c.name.toLowerCase().includes(query) ||
        c.sector.toLowerCase().includes(query)
      ).slice(0, 6);

      if (matches.length === 0) {
        searchDropdown.innerHTML = '<div class="search-item" role="option">No matching companies found</div>';
        searchDropdown.classList.add('active');
        searchInput.setAttribute('aria-expanded', 'true');
        return;
      }

      searchDropdown.innerHTML = matches.map((c, i) => `
        <a href="stock.html?symbol=${c.symbol}" class="search-item" role="option" id="search-opt-${i}" data-index="${i}">
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
      searchInput.setAttribute('aria-expanded', 'true');
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
        searchInput.setAttribute('aria-expanded', 'false');
        selectedIndex = -1;
      }
    });

    function updateHighlight(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('highlighted');
          item.setAttribute('aria-selected', 'true');
          searchInput.setAttribute('aria-activedescendant', item.id);
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('highlighted');
          item.removeAttribute('aria-selected');
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
        searchInput.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. WATCHLIST STARS WITH UNDO TOAST
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
      starBtn.setAttribute('aria-pressed', 'false');
      starBtn.setAttribute('aria-label', `Add ${symbol} to Watchlist`);
      showToast(`Removed ${symbol} from Watchlist`, () => {
        watchlist.push(symbol);
        BourseData.Store.setWatchlist(watchlist);
        starBtn.classList.add('starred');
        starBtn.innerHTML = '★';
        starBtn.setAttribute('aria-pressed', 'true');
        starBtn.setAttribute('aria-label', `Remove ${symbol} from Watchlist`);
        updateWatchlistUI();
      });
    } else {
      watchlist.push(symbol);
      starBtn.classList.add('starred');
      starBtn.innerHTML = '★';
      starBtn.setAttribute('aria-pressed', 'true');
      starBtn.setAttribute('aria-label', `Remove ${symbol} from Watchlist`);
      showToast(`Added ${symbol} to Watchlist`, () => {
        watchlist = watchlist.filter(s => s !== symbol);
        BourseData.Store.setWatchlist(watchlist);
        starBtn.classList.remove('starred');
        starBtn.innerHTML = '☆';
        starBtn.setAttribute('aria-pressed', 'false');
        starBtn.setAttribute('aria-label', `Add ${symbol} to Watchlist`);
        updateWatchlistUI();
      });
    }
    BourseData.Store.setWatchlist(watchlist);
    updateWatchlistUI();
  });

  function updateWatchlistUI() {
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
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span>${message}</span>`;

    if (undoCallback) {
      const undoBtn = document.createElement('button');
      undoBtn.textContent = 'UNDO';
      undoBtn.setAttribute('aria-label', 'Undo last action');
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

  // 6. ACCESSIBLE BUY / SELL MODAL WITH FOCUS TRAP (A4)
  const modalBackdrop = document.getElementById('trade-modal');
  const modalClose = document.getElementById('modal-close');
  const qtyInput = document.getElementById('trade-qty');
  const totalValEl = document.getElementById('trade-total');
  const buyTab = document.getElementById('tab-buy');
  const sellTab = document.getElementById('tab-sell');
  const submitTradeBtn = document.getElementById('submit-trade-btn');

  let currentTradeSymbol = 'MRDN';
  let tradeType = 'BUY';
  let lastActiveElement = null;

  window.openTradeModal = function(symbol, type = 'BUY') {
    currentTradeSymbol = symbol;
    tradeType = type;
    if (!modalBackdrop) return;

    lastActiveElement = document.activeElement;
    const comp = BourseData.companies.find(c => c.symbol === symbol) || BourseData.companies[0];
    document.getElementById('modal-title').textContent = `${type} — ${comp.symbol} (${comp.name})`;
    document.getElementById('modal-price').textContent = `₹ ${BourseData.formatINR(comp.price)}`;
    qtyInput.value = '10';
    updateTradeTotal(comp.price);

    if (buyTab && sellTab) {
      buyTab.classList.toggle('active', type === 'BUY');
      sellTab.classList.toggle('active', type === 'SELL');
      buyTab.setAttribute('aria-selected', type === 'BUY');
      sellTab.setAttribute('aria-selected', type === 'SELL');
      submitTradeBtn.textContent = type === 'BUY' ? 'Confirm Buy Order' : 'Confirm Sell Order';
    }

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    qtyInput.focus();
  };

  function closeTradeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeTradeModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeTradeModal();
    });
    modalBackdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeTradeModal();
      }
      // Focus trap
      if (e.key === 'Tab') {
        const focusable = modalBackdrop.querySelectorAll('button, input, [tabindex="0"]');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (buyTab && sellTab) {
    buyTab.addEventListener('click', () => {
      tradeType = 'BUY';
      buyTab.classList.add('active');
      sellTab.classList.remove('active');
      buyTab.setAttribute('aria-selected', 'true');
      sellTab.setAttribute('aria-selected', 'false');
      submitTradeBtn.textContent = 'Confirm Buy Order';
    });
    sellTab.addEventListener('click', () => {
      tradeType = 'SELL';
      sellTab.classList.add('active');
      buyTab.classList.remove('active');
      buyTab.setAttribute('aria-selected', 'false');
      sellTab.setAttribute('aria-selected', 'true');
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
      closeTradeModal();
      if (typeof renderPortfolioPage === 'function') {
        renderPortfolioPage();
      }
      if (typeof renderHomeStocks === 'function') {
        renderHomeStocks();
      }
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-trade-action]');
    if (!btn) return;
    const symbol = btn.dataset.symbol || 'MRDN';
    const action = btn.dataset.tradeAction;
    openTradeModal(symbol, action);
  });

});
