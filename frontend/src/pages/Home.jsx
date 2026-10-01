import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BarChart2, PieChart, Brain, Newspaper, Shield, PlaySquare, ArrowRight, Zap, Award } from 'lucide-react';
import { getMarketOverview } from '../services/api';

const Home = () => {
  const [overview, setOverview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMarketOverview().then(res => setOverview(res.data)).catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stocks/${searchQuery.trim().toUpperCase()}`);
    }
  };

  const featureCards = [
    {
      title: 'Interactive Technical Analysis',
      desc: 'Candlestick & Line charts with SMA 20/50/200, EMA, RSI, MACD, Stochastic, ATR, and Bollinger Bands.',
      icon: BarChart2,
      link: '/stocks/RELIANCE',
      badge: 'Technical Engine'
    },
    {
      title: 'Quantitative Risk Analysis',
      desc: 'Annualized Volatility, Peak-to-Trough Maximum Drawdown, Historical 95% Value-at-Risk (VaR), and Sharpe Ratio.',
      icon: Shield,
      link: '/stocks/RELIANCE',
      badge: 'Risk Engine'
    },
    {
      title: 'Machine Learning Forecasting',
      desc: 'Walk-forward time-series predictions using XGBoost, Random Forest, ARIMA, with SHAP feature explainability.',
      icon: Brain,
      link: '/forecast',
      badge: 'ML Engine'
    },
    {
      title: 'Portfolio Analytics & Growth',
      desc: 'Hypothetical portfolio backtesting, asset correlation, Sharpe optimization, and cumulative value growth curves.',
      icon: PieChart,
      link: '/portfolio',
      badge: 'Portfolio'
    },
    {
      title: 'NLP News Sentiment Analysis',
      desc: 'Aggregates news headlines and extracts sentiment scores using natural language processing pipelines.',
      icon: Newspaper,
      link: '/sentiment',
      badge: 'NLP Engine'
    },
    {
      title: 'Strategy Backtesting Engine',
      desc: 'Evaluate SMA Crossovers and RSI reversal quantitative strategies taking into account transaction costs and slippage.',
      icon: PlaySquare,
      link: '/backtest',
      badge: 'Quant Engine'
    }
  ];

  const popularStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'TATAMOTORS'];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300">
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Educational Financial Analytics Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Institutional-Grade Stock & Financial Market Analytics
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Explore historical stock data, calculate technical indicators, analyze volatility & drawdown risk, forecast price ranges with Machine Learning, and backtest quantitative trading strategies.
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter stock symbol (e.g. RELIANCE, TCS, INFY)..."
                className="w-full bg-slate-950 border-0 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl text-sm transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
            >
              Analyze Stock <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Stock Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-medium">Quick Select:</span>
            {popularStocks.map(sym => (
              <button
                key={sym}
                onClick={() => navigate(`/stocks/${sym}`)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all"
              >
                [ {sym} ]
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Market Overview Index Cards */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Major Indian Indices & Market Overview
            </h2>
            <Link to="/dashboard" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View Full Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(overview?.indices || [
              { name: 'NIFTY 50', level: '22,485.50', change: 0.65 },
              { name: 'SENSEX', level: '74,012.30', change: 0.58 },
              { name: 'NIFTY IT', level: '35,120.10', change: 0.82 },
              { name: 'NIFTY BANK', level: '47,850.90', change: 0.45 }
            ]).map((idx, i) => {
              const isPos = idx.change >= 0;
              return (
                <div key={i} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-slate-400">{idx.name}</span>
                  <div className="font-mono text-2xl font-bold text-white">{idx.level}</div>
                  <div className={`text-xs font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{idx.change}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Comprehensive Platform Modules</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Designed for Data Science, Quantitative Finance, and Full-Stack Analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {card.badge}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Module <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Home;
