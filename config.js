// NEBULA · Configuration
const CONFIG = {
  SYMBOLS: [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'JPM', 'V',
    'WMT', 'PG', 'JNJ', 'HD', 'MA', 'BAC', 'XOM', 'CVX', 'PFE', 'ABT',
    'MRK', 'KO', 'PEP', 'MCD', 'CSCO', 'INTC', 'IBM', 'ORCL', 'CRM', 'QCOM',
    'AMD', 'UBER', 'PYPL', 'ADBE', 'SNOW', 'SHOP', 'COIN', 'PLTR', 'SNAP', 'ZM'
  ],
  INITIAL_CASH: 100000,
  MAX_DAILY_LOSS: 2000,
  MARKET_UPDATE_INTERVAL: 2200
};

// Export for use across modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}