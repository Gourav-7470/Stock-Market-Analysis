import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, TrendingDown, Bookmark, BookmarkCheck, Shield, Brain, Newspaper, Activity, RefreshCw } from 'lucide-react';
import { getQuote, getHistory, getIndicators, getRisk, getForecast, getSentiment, addWatchlist, removeWatchlist, getWatchlist } from '../services/api';
import PriceChart from '../components/PriceChart';
import IndicatorDashboard from '../components/IndicatorDashboard';
import RiskAnalysisCard from '../components/RiskAnalysisCard';
import ForecastCard from '../components/ForecastCard';
import SentimentCard from '../components/SentimentCard';

const StockDetails = () => {
  const { symbol = 'RELIANCE' } = useParams();
  const [period, setPeriod] = useState('1Y');
  
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [indicators, setIndicators] = useState({});
  const [risk, setRisk] = useState({});
  const [forecast, setForecast] = useState({});
  const [sentiment, setSentiment] = useState({});
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStockDetails = async () => {
    setLoading(true);
    try {
      const quoteRes = await getQuote(symbol);
      setQuote(quoteRes.data);

      const histRes = await getHistory(symbol, period);
      setHistory(histRes.data || []);

      const indRes = await getIndicators(symbol);
      setIndicators(indRes.data || {});

      const riskRes = await getRisk(symbol);
      setRisk(riskRes.data || {});

      const fcRes = await getForecast(symbol, 'xgboost', 5);
      setForecast(fcRes);

      const sentRes = await getSentiment(symbol);
      setSentiment(sentRes);

      // Check watchlist
      try {
        const wlRes = await getWatchlist();
        if (wlRes.symbols && wlRes.symbols.includes(symbol.toUpperCase())) {
          setIsWatchlisted(true);
        } else {
          setIsWatchlisted(false);
        }
      } catch (e) {}

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockDetails();
  }, [symbol, period]);

  const toggleWatchlist = async () => {
    try {
      if (isWatchlisted) {
        await removeWatchlist(symbol);
        setIsWatchlisted(false);
      } else {
        await addWatchlist(symbol);
        setIsWatchlisted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleModelChange = async (model, horizon) => {
    try {
      const res = await getForecast(symbol, model, horizon);
      setForecast(res);
    } catch (e) {}
  };

  if (loading && !quote) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Fetching Stock Data & Analytics...</p>
      </div>
    );
  }

  const isPos = quote?.change >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Stock Quote Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {quote?.name || `${symbol} Ltd.`}
              </h1>
              <span className="font-mono text-sm text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
                {quote?.symbol || symbol}
              </span>
              <span className="text-xs text-slate-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-medium">
                {quote?.sector || 'NSE / BSE Equity'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Source: <strong className="text-slate-400">{quote?.source || 'Market API'}</strong> | Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={toggleWatchlist}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isWatchlisted
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800'
            }`}
          >
            {isWatchlisted ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
            {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
          </button>

        </div>

        {/* Key Quote Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Current Price</span>
            <div className="font-mono text-xl font-bold text-white">
              {quote?.currency || '₹'}{quote?.price?.toLocaleString() || '2,850'}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Daily Change</span>
            <div className={`font-mono text-xl font-bold flex items-center gap-1 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPos ? '+' : ''}{quote?.change}%
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400">52 Week High</span>
            <div className="font-mono text-lg font-bold text-emerald-400">
              ₹{quote?.high52?.toLocaleString() || '3,024'}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400">52 Week Low</span>
            <div className="font-mono text-lg font-bold text-rose-400">
              ₹{quote?.low52?.toLocaleString() || '2,218'}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Volume</span>
            <div className="font-mono text-lg font-bold text-slate-200">
              {(quote?.volume ? (quote.volume / 1000000).toFixed(1) : '12.4')}M
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400">P/E Ratio</span>
            <div className="font-mono text-lg font-bold text-indigo-400">
              {quote?.peRatio || '24.5'}
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Price Chart */}
      <PriceChart
        history={history}
        period={period}
        onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
      />

      {/* Technical Indicators Dashboard */}
      <IndicatorDashboard data={indicators} />

      {/* Risk & Volatility Module */}
      <RiskAnalysisCard risk={risk} />

      {/* ML Forecast & Sentiment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ForecastCard forecastData={forecast} onModelChange={handleModelChange} />
        <SentimentCard sentimentData={sentiment} />
      </div>

    </div>
  );
};

export default StockDetails;
