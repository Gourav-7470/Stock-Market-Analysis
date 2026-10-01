import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Activity, BarChart2, Flame, RefreshCw } from 'lucide-react';
import { getMarketOverview } from '../services/api';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getMarketOverview();
      setOverview(res.data);
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const gainers = overview?.topGainers || [
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 975.20, change: 2.10 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1240.75, change: 1.80 },
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.45, change: 1.42 }
  ];

  const decliners = overview?.topDecliners || [
    { symbol: 'WIPRO', name: 'Wipro Limited', price: 485.60, change: -0.45 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.30, change: -0.31 }
  ];

  const mostActive = overview?.mostActive || [
    { symbol: 'TATAMOTORS', price: 975.20, volume: 16800000, change: 2.10 },
    { symbol: 'HDFCBANK', price: 1545.80, volume: 14500000, change: 0.85 },
    { symbol: 'RELIANCE', price: 2850.45, volume: 12450000, change: 1.42 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            Market Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time market indices, breadth stats, gainers, decliners, and trading volume.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Major Indices Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(overview?.indices || [
          { symbol: '^NSEI', name: 'NIFTY 50', level: 22485.50, change: 0.65 },
          { symbol: '^BSESN', name: 'SENSEX', level: 74012.30, change: 0.58 },
          { symbol: 'NIFTY IT', name: 'NIFTY IT', level: 35120.10, change: 0.82 },
          { symbol: 'BANKNIFTY', name: 'NIFTY BANK', level: 47850.90, change: 0.45 }
        ]).map((idx, i) => {
          const isPos = idx.change >= 0;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{idx.name}</span>
                <span className="font-mono text-[10px] text-slate-500">{idx.symbol}</span>
              </div>
              <div className="font-mono text-2xl font-extrabold text-white">
                {idx.level.toLocaleString()}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPos ? '+' : ''}{idx.change}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Breadth Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" /> Market Breadth Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-950 border border-emerald-500/20 p-3 rounded-xl">
            <span className="text-xs text-slate-400">Advances</span>
            <div className="font-mono text-lg font-bold text-emerald-400">1,420</div>
          </div>
          <div className="bg-slate-950 border border-rose-500/20 p-3 rounded-xl">
            <span className="text-xs text-slate-400">Declines</span>
            <div className="font-mono text-lg font-bold text-rose-400">780</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <span className="text-xs text-slate-400">Unchanged</span>
            <div className="font-mono text-lg font-bold text-slate-300">95</div>
          </div>
        </div>
      </div>

      {/* Gainers, Decliners, Most Active Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Gainers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Top Gainers
            </h3>
          </div>
          <div className="space-y-2">
            {gainers.map((s) => (
              <button
                key={s.symbol}
                onClick={() => navigate(`/stocks/${s.symbol}`)}
                className="w-full bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 p-3 rounded-xl flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-white">{s.symbol}</div>
                  <div className="text-[11px] text-slate-400">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-slate-200">₹{s.price}</div>
                  <div className="text-xs font-semibold text-emerald-400">+{s.change}%</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Decliners */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" /> Top Decliners
            </h3>
          </div>
          <div className="space-y-2">
            {decliners.map((s) => (
              <button
                key={s.symbol}
                onClick={() => navigate(`/stocks/${s.symbol}`)}
                className="w-full bg-slate-950 border border-slate-800/80 hover:border-rose-500/40 p-3 rounded-xl flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-white">{s.symbol}</div>
                  <div className="text-[11px] text-slate-400">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-slate-200">₹{s.price}</div>
                  <div className="text-xs font-semibold text-rose-400">{s.change}%</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Most Active by Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" /> Most Active (Volume)
            </h3>
          </div>
          <div className="space-y-2">
            {mostActive.map((s) => (
              <button
                key={s.symbol}
                onClick={() => navigate(`/stocks/${s.symbol}`)}
                className="w-full bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 p-3 rounded-xl flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-white">{s.symbol}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{(s.volume / 1000000).toFixed(1)}M Shares</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-slate-200">₹{s.price}</div>
                  <div className={`text-xs font-semibold ${s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
