const Portfolio = require('../models/Portfolio');
const { getIsConnected } = require('../config/db');
const marketDataService = require('../services/marketDataService');
const riskService = require('../services/riskService');

// In-Memory Fallback Portfolios
const inMemoryPortfolios = {};

const getPortfolio = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user';
    let portfolio;

    if (getIsConnected()) {
      portfolio = await Portfolio.findOne({ userId });
      if (!portfolio) {
        portfolio = await Portfolio.create({
          userId,
          name: 'My Core Portfolio',
          assets: [
            { symbol: 'RELIANCE', allocation: 30, quantity: 100, avgBuyPrice: 2700 },
            { symbol: 'TCS', allocation: 25, quantity: 60, avgBuyPrice: 3950 },
            { symbol: 'INFY', allocation: 20, quantity: 120, avgBuyPrice: 1550 },
            { symbol: 'HDFCBANK', allocation: 25, quantity: 160, avgBuyPrice: 1480 }
          ]
        });
      }
    } else {
      if (!inMemoryPortfolios[userId]) {
        inMemoryPortfolios[userId] = {
          _id: 'port_' + Date.now(),
          userId,
          name: 'My Core Portfolio',
          initialCapital: 1000000,
          assets: [
            { symbol: 'RELIANCE', allocation: 30, quantity: 100, avgBuyPrice: 2700 },
            { symbol: 'TCS', allocation: 25, quantity: 60, avgBuyPrice: 3950 },
            { symbol: 'INFY', allocation: 20, quantity: 120, avgBuyPrice: 1550 },
            { symbol: 'HDFCBANK', allocation: 25, quantity: 160, avgBuyPrice: 1480 }
          ]
        };
      }
      portfolio = inMemoryPortfolios[userId];
    }

    res.json({ success: true, data: portfolio });
  } catch (error) {
    next(error);
  }
};

const updatePortfolio = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user';
    const { assets, initialCapital, name } = req.body;

    let portfolio;
    if (getIsConnected()) {
      portfolio = await Portfolio.findOneAndUpdate(
        { userId },
        { assets, initialCapital, name, updatedAt: new Date() },
        { new: true, upsert: true }
      );
    } else {
      inMemoryPortfolios[userId] = {
        _id: inMemoryPortfolios[userId] ? inMemoryPortfolios[userId]._id : 'port_' + Date.now(),
        userId,
        name: name || 'My Core Portfolio',
        initialCapital: initialCapital || 1000000,
        assets: assets || []
      };
      portfolio = inMemoryPortfolios[userId];
    }

    res.json({ success: true, message: 'Portfolio updated successfully', data: portfolio });
  } catch (error) {
    next(error);
  }
};

const analyzePortfolio = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'demo_user';
    let portfolio;
    if (getIsConnected()) {
      portfolio = await Portfolio.findOne({ userId });
    } else {
      portfolio = inMemoryPortfolios[userId];
    }

    if (!portfolio || !portfolio.assets || portfolio.assets.length === 0) {
      return res.status(400).json({ success: false, message: 'No assets found in portfolio.' });
    }

    const assetsHistories = [];
    let totalValue = 0;
    const assetBreakdown = [];

    for (const asset of portfolio.assets) {
      const quote = await marketDataService.getQuote(asset.symbol);
      const history = await marketDataService.getHistoricalData(asset.symbol, '1Y');
      const currentAssetVal = (asset.quantity || 10) * quote.price;
      totalValue += currentAssetVal;

      assetsHistories.push({
        symbol: asset.symbol,
        weight: asset.allocation || (100 / portfolio.assets.length),
        quote,
        history,
        currentValue: currentAssetVal
      });
    }

    // Calculate normalized portfolio historical curve
    const minLen = Math.min(...assetsHistories.map(a => a.history.length));
    const portfolioCurve = [];

    let totalWeight = assetsHistories.reduce((acc, a) => acc + a.weight, 0);

    for (let i = 0; i < minLen; i++) {
      let dailyPortfolioPrice = 0;
      let date = assetsHistories[0].history[i].date;

      for (const a of assetsHistories) {
        const normWeight = a.weight / (totalWeight || 1);
        dailyPortfolioPrice += a.history[i].close * normWeight;
      }

      portfolioCurve.push({
        date,
        close: parseFloat(dailyPortfolioPrice.toFixed(2))
      });
    }

    // Risk & return on portfolio curve
    const portfolioRisk = riskService.computeRiskMetrics(portfolioCurve);

    // Asset allocation percentages
    assetsHistories.forEach(a => {
      assetBreakdown.push({
        symbol: a.symbol,
        name: a.quote.name,
        weightPct: parseFloat(((a.currentValue / (totalValue || 1)) * 100).toFixed(1)),
        currentValue: parseFloat(a.currentValue.toFixed(2)),
        currentPrice: a.quote.price
      });
    });

    res.json({
      success: true,
      totalPortfolioValue: parseFloat(totalValue.toFixed(2)),
      portfolioReturnPct: portfolioRisk.annualizedReturnPct,
      portfolioVolatilityPct: portfolioRisk.annualizedVolatilityPct,
      maxDrawdownPct: portfolioRisk.maxDrawdownPct,
      sharpeRatio: portfolioRisk.sharpeRatio,
      allocations: assetBreakdown,
      growthCurve: portfolioCurve
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio, updatePortfolio, analyzePortfolio };
