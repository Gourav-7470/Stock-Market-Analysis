import React, { useState, useEffect } from 'react';
import { BarChart2, Grid, RefreshCw } from 'lucide-react';
import { compareStocks } from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const StockCompare = () => {
  const [selectedSymbols, setSelectedSymbols] = useState(['TCS', 'INFY', 'HCLTECH', 'RELIANCE']);
  const [comparisonData, setComparisonData] = useState([]);
  const [corrMatrix, setCorrMatrix] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await compareStocks(selectedSymbols);
      setComparisonData(res.comparison || []);
      setCorrMatrix(res.correlationMatrix || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [selectedSymbols]);

  const toggleSymbol = (sym) => {
    if (selectedSymbols.includes(sym)) {
      if (selectedSymbols.length > 2) {
        setSelectedSymbols(selectedSymbols.filter(s => s !== sym));
      }
    } else {
      setSelectedSymbols([...selectedSymbols, sym]);
    }
  };

  const catalog = ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'TATAMOTORS'];
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

  // Prepare normalized % return series for comparative chart
  const minHistLen = comparisonData.length > 0 ? Math.min(...comparisonData.map(c => c.history ? c.history.length : 0)) : 0;
  const chartSeries = [];

  if (minHistLen > 0) {
    for (let i = 0; i < minHistLen; i++) {
      const date = comparisonData[0].history[i].date;
      const row = { date };
      
      comparisonData.forEach(item => {
        const basePrice = item.history[0].close;
        const currentPrice = item.history[i].close;
        const returnPct = ((currentPrice - basePrice) / basePrice) * 100;
        row[item.symbol] = parseFloat(returnPct.toFixed(2));
      });
      chartSeries.push(row);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & Symbol Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-indigo-400" /> Multi-Stock Analytical Comparison
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Relative performance, risk metric comparison table, and Pearson correlation matrix.
            </p>
          </div>

          <button
            onClick={fetchComparison}
            disabled={loading}
            className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Stock Selector Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Select Assets to Compare:</span>
          {catalog.map(sym => {
            const isSelected = selectedSymbols.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => toggleSymbol(sym)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Metrics Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Comparative Financial & Risk Metrics
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Metric</th>
                {comparisonData.map(c => (
                  <th key={c.symbol} className="py-3 px-4 font-bold text-indigo-400">{c.symbol}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Current Price</td>
                {comparisonData.map(c => <td key={c.symbol} className="py-3 px-4 font-bold">₹{c.price}</td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">1-Year Cumulative Return</td>
                {comparisonData.map(c => (
                  <td key={c.symbol} className={`py-3 px-4 font-bold ${c.return1Y >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.return1Y >= 0 ? '+' : ''}{c.return1Y}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Annualized Volatility</td>
                {comparisonData.map(c => <td key={c.symbol} className="py-3 px-4 text-amber-400">{c.volatility}%</td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Maximum Drawdown</td>
                {comparisonData.map(c => <td key={c.symbol} className="py-3 px-4 text-rose-400">{c.maxDrawdown}%</td>)}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Sharpe Ratio</td>
                {comparisonData.map(c => <td key={c.symbol} className="py-3 px-4 text-indigo-300 font-bold">{c.sharpeRatio}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Normalized Performance Comparison Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Normalized Relative Return Performance (%)
        </h3>
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} minTickGap={30} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(val) => [`${val}%`, 'Return']} />
              <Legend />
              {comparisonData.map((item, idx) => (
                <Line
                  key={item.symbol}
                  type="monotone"
                  dataKey={item.symbol}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlation Matrix Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-4 h-4 text-indigo-400" /> Pearson Return Correlation Heatmap
          </h3>
          <span className="text-xs text-slate-400">Values range from -1.0 to +1.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="text-slate-400">
                <th className="py-2 px-3 text-left">Asset</th>
                {selectedSymbols.map(s => <th key={s} className="py-2 px-3 font-bold text-indigo-400">{s}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {selectedSymbols.map(s1 => (
                <tr key={s1}>
                  <td className="py-3 px-3 text-left font-bold text-slate-200">{s1}</td>
                  {selectedSymbols.map(s2 => {
                    const val = corrMatrix[s1] ? corrMatrix[s1][s2] : (s1 === s2 ? 1.00 : 0.60);
                    // Color intensity based on correlation
                    const bg = s1 === s2 
                      ? 'bg-indigo-600/30 text-indigo-300 font-bold'
                      : val > 0.7 
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : val > 0.4
                      ? 'bg-sky-500/15 text-sky-300'
                      : 'bg-slate-950 text-slate-400';

                    return (
                      <td key={s2} className={`py-3 px-3 rounded ${bg}`}>
                        {typeof val === 'number' ? val.toFixed(2) : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StockCompare;
