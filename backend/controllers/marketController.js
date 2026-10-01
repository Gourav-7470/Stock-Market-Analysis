const marketDataService = require('../services/marketDataService');

const getOverview = async (req, res, next) => {
  try {
    const overview = await marketDataService.getMarketOverview();
    res.json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview };
