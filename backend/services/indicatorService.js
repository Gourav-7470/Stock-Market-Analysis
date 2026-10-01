class IndicatorService {
  // Simple Moving Average
  calculateSMA(prices, period) {
    const sma = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        const slice = prices.slice(i - period + 1, i + 1);
        const sum = slice.reduce((a, b) => a + b, 0);
        sma.push(parseFloat((sum / period).toFixed(2)));
      }
    }
    return sma;
  }

  // Exponential Moving Average
  calculateEMA(prices, period) {
    const ema = [];
    const k = 2 / (period + 1);
    let prevEma = null;

    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        ema.push(null);
      } else if (i === period - 1) {
        const slice = prices.slice(0, period);
        prevEma = slice.reduce((a, b) => a + b, 0) / period;
        ema.push(parseFloat(prevEma.toFixed(2)));
      } else {
        prevEma = prices[i] * k + prevEma * (1 - k);
        ema.push(parseFloat(prevEma.toFixed(2)));
      }
    }
    return ema;
  }

  // Relative Strength Index (14)
  calculateRSI(prices, period = 14) {
    const rsi = [];
    let gains = 0;
    let losses = 0;

    for (let i = 0; i < prices.length; i++) {
      if (i === 0) {
        rsi.push(null);
        continue;
      }

      const diff = prices[i] - prices[i - 1];
      if (i <= period) {
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);

        if (i === period) {
          let avgGain = gains / period;
          let avgLoss = losses / period;
          let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
          rsi.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
        } else {
          rsi.push(null);
        }
      } else {
        const prevRsi = rsi[i - 1];
        // Wilders Smoothing approximation for speed
        const currentGain = diff >= 0 ? diff : 0;
        const currentLoss = diff < 0 ? Math.abs(diff) : 0;
        
        let avgGain = (gains * (period - 1) + currentGain) / period;
        let avgLoss = (losses * (period - 1) + currentLoss) / period;
        gains = avgGain;
        losses = avgLoss;

        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(parseFloat((100 - (100 / (1 + rs))).toFixed(2)));
      }
    }
    return rsi;
  }

  // MACD (12, 26, 9)
  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    const macdLine = [];
    for (let i = 0; i < prices.length; i++) {
      if (ema12[i] === null || ema26[i] === null) {
        macdLine.push(null);
      } else {
        macdLine.push(parseFloat((ema12[i] - ema26[i]).toFixed(2)));
      }
    }

    const validMacd = macdLine.filter(val => val !== null);
    const signalValues = this.calculateEMA(validMacd, 9);
    
    const signalLine = [];
    const histogram = [];
    let signalIdx = 0;

    for (let i = 0; i < macdLine.length; i++) {
      if (macdLine[i] === null) {
        signalLine.push(null);
        histogram.push(null);
      } else {
        const sig = signalValues[signalIdx] !== undefined ? signalValues[signalIdx] : null;
        signalLine.push(sig);
        histogram.push(sig !== null ? parseFloat((macdLine[i] - sig).toFixed(2)) : null);
        signalIdx++;
      }
    }

    return { macdLine, signalLine, histogram };
  }

  // Bollinger Bands (20, 2)
  calculateBollingerBands(prices, period = 20, stdDevMult = 2) {
    const sma20 = this.calculateSMA(prices, period);
    const upper = [];
    const lower = [];

    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        lower.push(null);
      } else {
        const slice = prices.slice(i - period + 1, i + 1);
        const mean = sma20[i];
        const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        
        upper.push(parseFloat((mean + stdDevMult * stdDev).toFixed(2)));
        lower.push(parseFloat((mean - stdDevMult * stdDev).toFixed(2)));
      }
    }
    return { middle: sma20, upper, lower };
  }

  // Average True Range (14)
  calculateATR(history, period = 14) {
    const atr = [];
    const trueRanges = [];

    for (let i = 0; i < history.length; i++) {
      if (i === 0) {
        trueRanges.push(history[i].high - history[i].low);
        atr.push(null);
        continue;
      }

      const highLow = history[i].high - history[i].low;
      const highPrevClose = Math.abs(history[i].high - history[i - 1].close);
      const lowPrevClose = Math.abs(history[i].low - history[i - 1].close);
      const tr = Math.max(highLow, highPrevClose, lowPrevClose);
      trueRanges.push(tr);

      if (i < period) {
        atr.push(null);
      } else if (i === period) {
        const sum = trueRanges.slice(0, period + 1).reduce((a, b) => a + b, 0);
        atr.push(parseFloat((sum / period).toFixed(2)));
      } else {
        const prevAtr = atr[i - 1];
        const currentAtr = (prevAtr * (period - 1) + tr) / period;
        atr.push(parseFloat(currentAtr.toFixed(2)));
      }
    }
    return atr;
  }

  // On-Balance Volume (OBV)
  calculateOBV(history) {
    const obv = [];
    let currentObv = 0;

    for (let i = 0; i < history.length; i++) {
      if (i === 0) {
        obv.push(currentObv);
        continue;
      }

      if (history[i].close > history[i - 1].close) {
        currentObv += history[i].volume;
      } else if (history[i].close < history[i - 1].close) {
        currentObv -= history[i].volume;
      }
      obv.push(currentObv);
    }
    return obv;
  }

  // Stochastic Oscillator (%K, %D)
  calculateStochastic(history, period = 14, smoothK = 3, smoothD = 3) {
    const kValues = [];
    const dValues = [];

    for (let i = 0; i < history.length; i++) {
      if (i < period - 1) {
        kValues.push(null);
        dValues.push(null);
      } else {
        const slice = history.slice(i - period + 1, i + 1);
        const lowestLow = Math.min(...slice.map(item => item.low));
        const highestHigh = Math.max(...slice.map(item => item.high));
        const currentClose = history[i].close;

        let rawK = 50;
        if (highestHigh !== lowestLow) {
          rawK = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
        }
        kValues.push(parseFloat(rawK.toFixed(2)));
      }
    }

    const smoothedK = this.calculateSMA(kValues.map(v => v || 0), smoothK);
    const smoothedD = this.calculateSMA(smoothedK.map(v => v || 0), smoothD);

    return { percentK: smoothedK, percentD: smoothedD };
  }

  // Compute overall indicators and descriptive state dashboard
  computeAll(history) {
    if (!history || history.length === 0) return {};

    const closes = history.map(h => h.close);
    const volumes = history.map(h => h.volume);

    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    const sma100 = this.calculateSMA(closes, 100);
    const sma200 = this.calculateSMA(closes, 200);

    const ema20 = this.calculateEMA(closes, 20);
    const ema50 = this.calculateEMA(closes, 50);

    const rsi = this.calculateRSI(closes, 14);
    const macd = this.calculateMACD(closes);
    const bollinger = this.calculateBollingerBands(closes, 20, 2);
    const atr = this.calculateATR(history, 14);
    const obv = this.calculateOBV(history);
    const stochastic = this.calculateStochastic(history, 14);
    const volumeSMA = this.calculateSMA(volumes, 20);

    const latestClose = closes[closes.length - 1];
    const latestRsi = rsi[rsi.length - 1] || 50;
    const latestMacd = macd.histogram[macd.histogram.length - 1] || 0;
    const latestSma50 = sma50[sma50.length - 1] || latestClose;
    const latestSma200 = sma200[sma200.length - 1] || latestClose;

    // Descriptive state summary (educational, objective)
    let rsiState = 'Neutral range';
    if (latestRsi > 70) rsiState = 'Overbought (>70)';
    else if (latestRsi < 30) rsiState = 'Oversold (<30)';

    let priceVsSma50State = latestClose >= latestSma50 ? 'Above SMA 50' : 'Below SMA 50';
    let macdState = latestMacd >= 0 ? 'Positive Momentum' : 'Negative Momentum';

    return {
      series: {
        sma20,
        sma50,
        sma100,
        sma200,
        ema20,
        ema50,
        rsi,
        macd,
        bollinger,
        atr,
        obv,
        stochastic,
        volumeSMA
      },
      dashboard: {
        rsi: { value: latestRsi, state: rsiState },
        macd: { value: latestMacd, state: macdState },
        sma50: { value: latestSma50, state: priceVsSma50State },
        sma200: { value: latestSma200, state: latestClose >= latestSma200 ? 'Above SMA 200' : 'Below SMA 200' },
        bollingerBandWidth: {
          upper: bollinger.upper[bollinger.upper.length - 1],
          lower: bollinger.lower[bollinger.lower.length - 1],
          state: 'Normal Volatility Envelope'
        }
      }
    };
  }
}

module.exports = new IndicatorService();
