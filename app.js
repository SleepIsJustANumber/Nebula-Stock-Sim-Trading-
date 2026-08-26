// Main application - initializes and wires up event listeners
const App = {
  init() {
    // Initialize UI
    UI.init();

    // Initialize market data
    Market.init();

    // Initial account state
    Account.computeEquity();
    UI.updateAll();
    UI.log('⚡ NEBULA·SIM ready · 35+ stocks');

    // ----- Event Listeners -----
    // Place order button
    document.getElementById('placeOrderBtn').addEventListener('click', () => {
      const sym = document.getElementById('symbolSelect').value;
      const side = document.getElementById('orderSide').value;
      const qty = parseInt(document.getElementById('orderQuantity').value);
      const priceInput = document.getElementById('orderPrice').value;
      const price = priceInput ? parseFloat(priceInput) : null;

      if (isNaN(qty) || qty < 1) {
        UI.log('❌ enter valid quantity');
        return;
      }
      OrderEngine.execute(sym, side, qty, price);
    });

    // Market buy button
    document.getElementById('marketBuyBtn').addEventListener('click', () => {
      const sym = document.getElementById('symbolSelect').value;
      const qty = parseInt(document.getElementById('orderQuantity').value) || 10;
      OrderEngine.execute(sym, 'buy', qty);
    });

    // Market sell button
    document.getElementById('marketSellBtn').addEventListener('click', () => {
      const sym = document.getElementById('symbolSelect').value;
      const qty = parseInt(document.getElementById('orderQuantity').value) || 10;
      OrderEngine.execute(sym, 'sell', qty);
    });

    // Reset account
    document.getElementById('resetAccountBtn').addEventListener('click', () => {
      Account.reset();
      UI.updateAll();
      UI.log('🔄 Account reset');
    });

    // Random trade
    document.getElementById('randomTradeBtn').addEventListener('click', () => {
      OrderEngine.randomTrade();
    });

    // Clear log
    document.getElementById('clearLogBtn').addEventListener('click', () => {
      UI.clearLog();
    });

    // ----- Market update loop -----
    setInterval(() => {
      Market.updatePrices();
      Account.computeEquity();
      UI.updateAll();
    }, CONFIG.MARKET_UPDATE_INTERVAL);

    // Quick tip
    console.log('🚀 NEBULA·SIM loaded — trade safely (simulated)');
  }
};

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}