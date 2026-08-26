// Order Engine - executes trades with risk rules
const OrderEngine = {
  execute(symbol, side, quantity, price = null) {
    // Validation
    if (!CONFIG.SYMBOLS.includes(symbol)) {
      UI.log('❌ invalid symbol');
      return false;
    }
    if (quantity <= 0) {
      UI.log('❌ qty must be > 0');
      return false;
    }

    const currentPrice = Market.getPrice(symbol);
    let execPrice = price ? price : currentPrice;

    // Limit order simulation
    if (price) {
      if (side === 'buy' && price < currentPrice * 0.92) {
        UI.log(`⏳ limit buy ${symbol} @ $${price.toFixed(2)} (below market, not filled)`);
        return false;
      }
      if (side === 'sell' && price > currentPrice * 1.08) {
        UI.log(`⏳ limit sell ${symbol} @ $${price.toFixed(2)} (above market, not filled)`);
        return false;
      }
      execPrice = price;
    }

    const cost = execPrice * quantity;

    // Execute
    if (side === 'buy') {
      if (cost > Account.cash) {
        UI.log(`❌ insufficient cash (need $${cost.toFixed(2)})`);
        return false;
      }
      Account.updatePortfolio(symbol, 'buy', quantity, execPrice);
      UI.log(`✅ BUY ${quantity} ${symbol} @ $${execPrice.toFixed(2)}`);
    } else if (side === 'sell') {
      if (!Account.hasPosition(symbol) || Account.getPosition(symbol).qty < quantity) {
        UI.log(`❌ not enough ${symbol} to sell (${Account.getPosition(symbol)?.qty || 0} avail)`);
        return false;
      }
      Account.updatePortfolio(symbol, 'sell', quantity, execPrice);
      UI.log(`✅ SELL ${quantity} ${symbol} @ $${execPrice.toFixed(2)}`);
    }

    // Update UI
    UI.updateAll();

    // Risk rule: daily loss limit
    if (Account.dailyLoss < -CONFIG.MAX_DAILY_LOSS) {
      UI.log(`⚠️ RISK: daily loss limit hit (-$${CONFIG.MAX_DAILY_LOSS}). Closing positions.`);
      Account.closeAllPositions();
      UI.updateAll();
      UI.log('🔄 All positions closed (risk)');
    }

    return true;
  },

  // Random trade for demo
  randomTrade() {
    const sym = Market.getRandomSymbol();
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const qty = Math.floor(Math.random() * 30) + 1;
    const price = Market.getPrice(sym) + (Math.random() - 0.5) * 6;
    this.execute(sym, side, qty, price);
  }
};