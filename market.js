// Market data module
const Market = {
  prices: {},

  init() {
    for (let sym of CONFIG.SYMBOLS) {
      this.prices[sym] = Math.round((50 + Math.random() * 350) * 100) / 100;
    }
  },

  updatePrices() {
    for (let sym of CONFIG.SYMBOLS) {
      let change = (Math.random() - 0.5) * 6.4;
      let newPrice = this.prices[sym] + change;
      if (newPrice < 4) newPrice = 4 + Math.random() * 5;
      this.prices[sym] = Math.round(newPrice * 100) / 100;
    }
  },

  getPrice(symbol) {
    return this.prices[symbol] || 0;
  },

  getRandomSymbol() {
    return CONFIG.SYMBOLS[Math.floor(Math.random() * CONFIG.SYMBOLS.length)];
  },

  // Generate a random price movement for display
  getChangePercent(symbol) {
    return ((Math.random() - 0.5) * 4).toFixed(2);
  }
};

// Auto-init
Market.init();