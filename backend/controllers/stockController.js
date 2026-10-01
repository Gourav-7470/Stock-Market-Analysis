const marketDataService = require('../services/marketDataService');
const indicatorService = require('../services/indicatorService');
const riskService = require('../services/riskService');

const search = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const results = await marketDataService.searchStocks(query);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

const getQuote = async (req, res, next) => {
  try {
    const symbol = req.params.symbol;
    const quote = await marketDataService.getQuote(symbol);
    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const symbol = req.params.symbol;
    const period = req.query.period || '1Y';
    const history = await marketDataService.getHistoricalData(symbol, period);
    res.json({ success: true, symbol: symbol.toUpperCase(), period, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};

const getIndicators = async (req, res, next) => {
  try {
    const symbol = req.params.symbol;
    const history = await marketDataService.getHistoricalData(symbol, '1Y');
    const indicators = indicatorService.computeAll(history);
    res.json({ success: true, symbol: symbol.toUpperCase(), data: indicators });
  } catch (error) {
    next(error);
  }
};

const getRisk = async (req, res, next) => {
  try {
    const symbol = req.params.symbol;
    const history = await marketDataService.getHistoricalData(symbol, '1Y');
    const riskMetrics = riskService.computeRiskMetrics(history);
    res.json({ success: true, symbol: symbol.toUpperCase(), data: riskMetrics });
  } catch (error) {
    next(error);
  }
};

const compareStocks = async (req, res, next) => {
  try {
    const symbolsParam = req.query.symbols || 'TCS,INFY,HCLTECH';
    const symbolsList = symbolsParam.split(',').map(s => s.trim().toUpperCase());

    const comparisonData = [];
    for (const sym of symbolsList) {
      const quote = await marketDataService.getQuote(sym);
      const history = await marketDataService.getHistoricalData(sym, '1Y');
      const risk = riskService.computeRiskMetrics(history);
      
      const firstPrice = history[0] ? history[0].close : quote.price;
      const lastPrice = history[history.length - 1] ? history[history.length - 1].close : quote.price;
      const return1Y = ((lastPrice - firstPrice) / firstPrice) * 100;

      comparisonData.push({
        symbol: sym,
        name: quote.name,
        sector: quote.sector,
        price: quote.price,
        return1Y: parseFloat(return1Y.toFixed(2)),
        volatility: risk.annualizedVolatilityPct,
        maxDrawdown: risk.maxDrawdownPct,
        sharpeRatio: risk.sharpeRatio,
        history
      });
    }

    // Build correlation matrix
    const correlationMatrix = {};
    for (let i = 0; i < comparisonData.length; i++) {
      const sym1 = comparisonData[i].symbol;
      correlationMatrix[sym1] = {};
      
      const returns1 = [];
      const hist1 = comparisonData[i].history;
      for (let k = 1; k < hist1.length; k++) {
        returns1.push((hist1[k].close - hist1[k-1].close) / hist1[k-1].close);
      }

      for (let j = 0; j < comparisonData.length; j++) {
        const sym2 = comparisonData[j].symbol;
        if (i === j) {
          correlationMatrix[sym1][sym2] = 1.00;
        } else {
          const returns2 = [];
          const hist2 = comparisonData[j].history;
          const minLen = Math.min(hist1.length, hist2.length);
          for (let k = 1; k < minLen; k++) {
            returns2.push((hist2[k].close - hist2[k-1].close) / hist2[k-1].close);
          }
          
          // Pearson correlation
          const mean1 = returns1.reduce((a,b)=>a+b, 0) / returns1.length;
          const mean2 = returns2.reduce((a,b)=>a+b, 0) / returns2.length;

          let num = 0, den1 = 0, den2 = 0;
          for (let m = 0; m < returns1.length && m < returns2.length; m++) {
            const diff1 = returns1[m] - mean1;
            const diff2 = returns2[m] - mean2;
            num += diff1 * diff2;
            den1 += diff1 * diff1;
            den2 += diff2 * diff2;
          }
          const corr = (den1 === 0 || den2 === 0) ? 0 : num / (Math.sqrt(den1) * Math.sqrt(den2));
          correlationMatrix[sym1][sym2] = parseFloat(corr.toFixed(2));
        }
      }
    }

    res.json({
      success: true,
      comparison: comparisonData,
      correlationMatrix
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
  getQuote,
  getHistory,
  getIndicators,
  getRisk,
  compareStocks
};
