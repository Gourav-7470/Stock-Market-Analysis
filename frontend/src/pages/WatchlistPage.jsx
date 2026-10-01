import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Plus, Trash2, TrendingUp, TrendingDown, ArrowRight, RefreshCw } from 'lucide-react';
import { getWatchlist, addWatchlist, removeWatchlist } from '../services/api';

const WatchlistPage = () => {
  const [items, setItems] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWatchlistData = async () => {
    setLoading(true);
    try {
      const res = await getWatchlist();
      setItems(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlistData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      try {
        await addWatchlist(newSymbol.trim().toUpperCase());
        setNewSymbol('');
        fetchWatchlistData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRemove = async (sym) => {
    try {
      await removeWatchlist(sym);
      setItems(items.filter(item => item.symbol !== sym));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-400" /> My Personal Watchlist
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor live stock price quotes, intraday daily changes, and quick analytical shortcuts.
          </p>
        </div>

        {/* Add Symbol Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Add symbol (e.g. ITC)..."
            className="bg-transparent border-0 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none w-36 font-mono"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>
      </div>

      {/* Watchlist Grid */}
      {items.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your favorite stock tickers using the search bar above to monitor quotes and metrics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const isPos = item.change >= 0;
            return (
              <div
                key={item.symbol}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl transition-all group relative"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-indigo-400 transition-colors">
                      {item.symbol}
                    </h3>
                    <p className="text-xs text-slate-400 truncate max-w-[180px]">{item.name}</p>
                  </div>

                  <button
                    onClick={() => handleRemove(item.symbol)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between border-t border-b border-slate-800/80 py-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Price</span>
                    <span className="font-mono text-xl font-bold text-white">₹{item.price?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Daily Change</span>
                    <span className={`font-mono text-base font-bold flex items-center justify-end gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isPos ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">Vol: {(item.volume / 1000000).toFixed(1)}M</span>
                  <button
                    onClick={() => navigate(`/stocks/${item.symbol}`)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Full Analysis <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default WatchlistPage;
