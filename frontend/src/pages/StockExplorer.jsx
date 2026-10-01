import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { searchStocks } from '../services/api';

const StockExplorer = () => {
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    searchStocks(query).then(res => setStocks(res.data || [])).catch(() => {});
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" /> Stock Explorer & Asset Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search equities, view key financial metrics, high-low ranges, and launch technical analysis.
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stock symbol or company name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stocks.map((stock) => {
          const isPos = stock.change >= 0;
          return (
            <div
              key={stock.symbol}
              onClick={() => navigate(`/stocks/${stock.symbol}`)}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-indigo-400 transition-colors">
                    {stock.symbol}
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-[180px]">{stock.name}</p>
                </div>
                <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-medium">
                  {stock.sector}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-b border-slate-800/80 py-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Quote</span>
                  <span className="font-mono text-xl font-bold text-white">₹{stock.price?.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Daily Return</span>
                  <span className={`font-mono text-base font-bold flex items-center justify-end gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {isPos ? '+' : ''}{stock.change}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 font-mono">52W High: ₹{stock.high52}</span>
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Analyze <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default StockExplorer;
