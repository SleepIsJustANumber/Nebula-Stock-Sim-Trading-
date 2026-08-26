// UI rendering module
const UI = {
  // DOM refs
  elements: {},

  init() {
    this.elements = {
      cashDisplay: document.getElementById('cashDisplay'),
      equityDisplay: document.getElementById('equityDisplay'),
      maxLossDisplay: document.getElementById('maxLossDisplay'),
      concentrationDisplay: document.getElementById('concentrationDisplay'),
      drawdownDisplay: document.getElementById('drawdownDisplay'),
      positionsCount: document.getElementById('positionsCount'),
      portfolioBody: document.getElementById('portfolioBody'),
      tickerContainer: document.getElementById('tickerContainer'),
      watchlistContainer: document.getElementById('watchlistContainer'),
      symbolSelect: document.getElementById('symbolSelect'),
      orderLog: document.getElementById('orderLog')
    };

    this.populateSymbolSelect();
    this.renderWatchlist();
  },

  populateSymbolSelect() {
    const sel = this.elements.symbolSelect;
    sel.innerHTML = '';
    for (let sym of CONFIG.SYMBOLS) {
      const opt = document.createElement('option');
      opt.value = sym;
      opt.innerText = sym;
      sel.appendChild(opt);
    }
  },

  renderWatchlist() {
    const container = this.elements.watchlistContainer;
    container.innerHTML = '';
    for (let sym of CONFIG.SYMBOLS) {
      const span = document.createElement('span');
      span.className = 'watchlist-tag';
      span.innerText = sym;
      container.appendChild(span);
    }
  },

  renderMarketFeed() {
    const container = this.elements.tickerContainer;
    container.innerHTML = '';
    // Show first 8 in ticker
    const display = CONFIG.SYMBOLS.slice(0, 8);
    for (let sym of display) {
      const price = Market.getPrice(sym);
      const change = Market.getChangePercent(sym);
      const isPos = parseFloat(change) >= 0;
      const div = document.createElement('div');
      div.className = 'ticker-item';
      div.innerHTML = `
        <span class="ticker-sym">${sym}</span>
        <span class="ticker-price">$${price.toFixed(2)}</span>
        <span class="ticker-change ${isPos ? 'positive' : 'negative'}">
          ${isPos ? '+' : ''}${change}%
        </span>
      `;
      container.appendChild(div);
    }
  },

  renderPortfolio() {
    const tbody = this.elements.portfolioBody;
    tbody.innerHTML = '';
    let hasPos = false;

    for (let sym in Account.portfolio) {
      const pos = Account.portfolio[sym];
      if (pos.qty === 0) continue;
      hasPos = true;
      const curPrice = Market.getPrice(sym) || 0;
      const pl = (curPrice - pos.avgPrice) * pos.qty;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="sym">${sym}</td>
        <td>${pos.qty}</td>
        <td>$${pos.avgPrice.toFixed(2)}</td>
        <td style="color:${pl >= 0 ? '#7ad0a0' : '#f68b8b'}">
          ${pl >= 0 ? '+' : ''}${pl.toFixed(2)}
        </td>
      `;
      tbody.appendChild(row);
    }

    if (!hasPos) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#5f7193;">no positions</td></tr>';
    }
  },

  updateAccountUI() {
    this.elements.cashDisplay.innerText = Account.cash.toFixed(2);
    this.elements.equityDisplay.innerText = Account.totalEquity.toFixed(2);
    this.elements.drawdownDisplay.innerText = Account.getDrawdown().toFixed(1) + '%';
    this.elements.concentrationDisplay.innerText = Account.getConcentration().toFixed(0) + '%';
    this.elements.maxLossDisplay.innerText = `-${Math.min(CONFIG.MAX_DAILY_LOSS, Math.abs(Account.dailyLoss)).toFixed(0)}`;
    this.elements.positionsCount.innerText = Account.getPositionCount() + ' positions';
  },

  updateAll() {
    this.updateAccountUI();
    this.renderPortfolio();
    this.renderMarketFeed();
  },

  log(message) {
    const logDiv = this.elements.orderLog;
    const entry = document.createElement('div');
    const time = new Date().toLocaleTimeString();
    entry.innerText = `[${time}] ${message}`;
    logDiv.prepend(entry);
    if (logDiv.children.length > 40) {
      logDiv.removeChild(logDiv.lastChild);
    }
  },

  clearLog() {
    this.elements.orderLog.innerHTML = '';
  }
};