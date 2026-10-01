const Watchlist = require('../models/Watchlist');
const { getIsConnected } = require('../config/db');
const marketDataService = require('../services/marketDataService');

const inMemoryWatchlists = {};

const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user';
    let watchlist;

    if (getIsConnected()) {
      watchlist = await Watchlist.findOne({ userId });
      if (!watchlist) {
        watchlist = await Watchlist.create({
          userId,
          symbols: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK']
        });
      }
    } else {
      if (!inMemoryWatchlists[userId]) {
        inMemoryWatchlists[userId] = {
          _id: 'wl_' + Date.now(),
          userId,
          symbols: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK']
        };
      }
      watchlist = inMemoryWatchlists[userId];
    }

    // Enrich symbols with current quote data
    const enrichedItems = [];
    for (const sym of watchlist.symbols) {
      const quote = await marketDataService.getQuote(sym);
      enrichedItems.push(quote);
    }

    res.json({
      success: true,
      symbols: watchlist.symbols,
      items: enrichedItems
    });
  } catch (error) {
    next(error);
  }
};

const addSymbol = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user';
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Symbol is required' });
    }

    const symUpper = symbol.toUpperCase().trim();
    let watchlist;

    if (getIsConnected()) {
      watchlist = await Watchlist.findOne({ userId });
      if (!watchlist) {
        watchlist = new Watchlist({ userId, symbols: [symUpper] });
      } else if (!watchlist.symbols.includes(symUpper)) {
        watchlist.symbols.push(symUpper);
      }
      await watchlist.save();
    } else {
      if (!inMemoryWatchlists[userId]) {
        inMemoryWatchlists[userId] = { userId, symbols: [] };
      }
      if (!inMemoryWatchlists[userId].symbols.includes(symUpper)) {
        inMemoryWatchlists[userId].symbols.push(symUpper);
      }
      watchlist = inMemoryWatchlists[userId];
    }

    res.json({ success: true, message: `${symUpper} added to watchlist`, symbols: watchlist.symbols });
  } catch (error) {
    next(error);
  }
};

const removeSymbol = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user';
    const symUpper = req.params.symbol.toUpperCase().trim();
    let watchlist;

    if (getIsConnected()) {
      watchlist = await Watchlist.findOne({ userId });
      if (watchlist) {
        watchlist.symbols = watchlist.symbols.filter(s => s !== symUpper);
        await watchlist.save();
      }
    } else {
      if (inMemoryWatchlists[userId]) {
        inMemoryWatchlists[userId].symbols = inMemoryWatchlists[userId].symbols.filter(s => s !== symUpper);
        watchlist = inMemoryWatchlists[userId];
      }
    }

    res.json({ success: true, message: `${symUpper} removed from watchlist`, symbols: watchlist ? watchlist.symbols : [] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addSymbol, removeSymbol };
