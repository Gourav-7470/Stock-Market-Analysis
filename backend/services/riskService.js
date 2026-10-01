class RiskService {
  computeRiskMetrics(history) {
    if (!history || history.length < 2) {
      return {
        dailyReturns: [],
        annualizedVolatility: 0,
        maxDrawdown: 0,
        historicalVaR95: 0,
        sharpeRatio: 0
      };
    }

    const closes = history.map(h => h.close);
    const dailyReturns = [];

    for (let i = 1; i < closes.length; i++) {
      const ret = (closes[i] - closes[i - 1]) / closes[i - 1];
      dailyReturns.push(ret);
    }

    // Mean daily return
    const meanReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;

    // Daily Volatility (Standard Deviation of returns)
    const variance = dailyReturns.reduce((acc, val) => acc + Math.pow(val - meanReturn, 2), 0) / dailyReturns.length;
    const dailyVolatility = Math.sqrt(variance);

    // Annualized Volatility (assuming 252 trading days)
    const annualizedVolatility = dailyVolatility * Math.sqrt(252);

    // Maximum Drawdown
    let maxDrawdown = 0;
    let peak = closes[0];

    const drawdowns = [];
    for (let i = 0; i < closes.length; i++) {
      if (closes[i] > peak) {
        peak = closes[i];
      }
      const drawdown = (closes[i] - peak) / peak;
      drawdowns.push(drawdown);
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // Historical VaR (95% confidence level - 5th percentile)
    const sortedReturns = [...dailyReturns].sort((a, b) => a - b);
    const varIndex = Math.floor(sortedReturns.length * 0.05);
    const historicalVaR95 = sortedReturns[varIndex] !== undefined ? sortedReturns[varIndex] : 0;

    // Sharpe Ratio (assuming risk-free rate = 6.5% p.a. -> 0.065 / 252 daily)
    const annualizedReturn = meanReturn * 252;
    const riskFreeRate = 0.065;
    const sharpeRatio = annualizedVolatility === 0 ? 0 : (annualizedReturn - riskFreeRate) / annualizedVolatility;

    // Rolling 20-day volatility
    const rollingVolatility = [];
    const window = 20;
    for (let i = 0; i < dailyReturns.length; i++) {
      if (i < window - 1) {
        rollingVolatility.push(null);
      } else {
        const slice = dailyReturns.slice(i - window + 1, i + 1);
        const sliceMean = slice.reduce((a, b) => a + b, 0) / window;
        const sliceVar = slice.reduce((a, b) => a + Math.pow(b - sliceMean, 2), 0) / window;
        rollingVolatility.push(parseFloat((Math.sqrt(sliceVar) * Math.sqrt(252) * 100).toFixed(2)));
      }
    }

    return {
      dailyVolatilityPct: parseFloat((dailyVolatility * 100).toFixed(2)),
      annualizedVolatilityPct: parseFloat((annualizedVolatility * 100).toFixed(2)),
      maxDrawdownPct: parseFloat((maxDrawdown * 100).toFixed(2)),
      historicalVaR95Pct: parseFloat((historicalVaR95 * 100).toFixed(2)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      annualizedReturnPct: parseFloat((annualizedReturn * 100).toFixed(2)),
      methodology: 'Historical percentile VaR (95% confidence, 1-day horizon) & Annualized SD (252 trading days)',
      rollingVolatility
    };
  }
}

module.exports = new RiskService();
