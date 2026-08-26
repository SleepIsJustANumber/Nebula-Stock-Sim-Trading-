// Account module - manages cash, portfolio, equity
const Account = {
  cash: CONFIG.INITIAL_CASH,
  portfolio: {}, // symbol -> { qty, avgPrice }
  totalEquity: CONFIG.INITIAL_CASH,
  dailyLoss: 0,
  initialEquity: CONFIG.INITIAL_CASH,

  reset() {
    this.cash = CONFIG.INITIAL_CASH;
    this.portfolio = {};
    this.totalEquity = CONFIG.INITIAL_CASH;
    this.dailyLoss = 0;
    this.initialEquity = CONFIG.INITIAL_CASH;
  },

  computeEquity() {
    let total = this.cash;
    for (let sym in this.portfolio) {
      total += this.portfolio[sym].qty * (Market.getPrice(sym) || 0);
    }
    this.totalEquity = Math.round(total * 100) / 100;
    return this.totalEquity;
  },

  getDrawdown() {
    let dd = ((this.initialEquity - this.totalEquity) / this.initialEquity * 100);
    return dd < 0 ? 0 : dd;
  },

  getConcentration() {
    let maxVal = 0;
    for (let sym in this.portfolio) {
      let val = this.portfolio[sym].qty * (Market.getPrice(sym) || 0);
      if (val > maxVal) maxVal = val;
    }
    return this.totalEquity > 0 ? (maxVal / this.totalEquity * 100) : 0;
  },

  getPositionCount() {
    return Object.keys(this.portfolio).filter(k => this.portfolio[k].qty > 0).length;
  },

  // Update portfolio after a trade
  updatePortfolio(symbol, side, quantity, price) {
    if (side === 'buy') {
      if (this.portfolio[symbol]) {
        const oldQty = this.portfolio[symbol].qty;
        const oldAvg = this.portfolio[symbol].avgPrice;
        const newQty = oldQty + quantity;
        const newAvg = (oldAvg * oldQty + price * quantity) / newQty;
        this.portfolio[symbol].qty = newQty;
        this.portfolio[symbol].avgPrice = newAvg;
      } else {
        this.portfolio[symbol] = { qty: quantity, avgPrice: price };
      }
      this.cash -= price * quantity;
      this.dailyLoss -= (price * quantity);
    } else if (side === 'sell') {
      const oldQty = this.portfolio[symbol].qty;
      const newQty = oldQty - quantity;
      if (newQty === 0) {
        delete this.portfolio[symbol];
      } else {
        this.portfolio[symbol].qty = newQty;
      }
      this.cash += price * quantity;
      this.dailyLoss += (price * quantity);
    }
    this.computeEquity();
  },

  // Close all positions at market
  closeAllPositions() {
    for (let sym in this.portfolio) {
      const pos = this.portfolio[sym];
      const price = Market.getPrice(sym) || 0;
      this.cash += pos.qty * price;
    }
    this.portfolio = {};
    this.computeEquity();
  },

  hasPosition(symbol) {
    return this.portfolio[symbol] && this.portfolio[symbol].qty > 0;
  },

  getPosition(symbol) {
    return this.portfolio[symbol] || null;
  }
};