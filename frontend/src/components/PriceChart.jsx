import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, LineChart, AreaChart, Eye } from 'lucide-react';

const PriceChart = ({ history = [], period = '1Y', onPeriodChange }) => {
  const [chartType, setChartType] = useState('area'); // 'line' | 'area' | 'candle'
  const [showSma20, setShowSma20] = useState(true);
  const [showSma50, setShowSma50] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  if (!history || history.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl">
        <span className="text-slate-500 text-sm">Loading Historical Price Data...</span>
      </div>
    );
  }

  // Pre-calculate SMAs on history data for overlay
  const processedData = history.map((item, idx, arr) => {
    let sma20 = null;
    let sma50 = null;

    if (idx >= 19) {
      const slice20 = arr.slice(idx - 19, idx + 1);
      sma20 = slice20.reduce((a, b) => a + b.close, 0) / 20;
    }
    if (idx >= 49) {
      const slice50 = arr.slice(idx - 49, idx + 1);
      sma50 = slice50.reduce((a, b) => a + b.close, 0) / 50;
    }

    return {
      ...item,
      sma20: sma20 ? parseFloat(sma20.toFixed(2)) : null,
      sma50: sma50 ? parseFloat(sma50.toFixed(2)) : null,
      color: item.close >= item.open ? '#10b981' : '#f43f5e'
    };
  });

  const timeframes = ['1D', '1W', '1M', '6M', '1Y', '5Y'];

  const formatYAxis = (val) => `₹${val.toLocaleString()}`;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-md">
          <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1 mb-1">{data.date}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
            <div><span className="text-slate-400">Open:</span> <span className="text-slate-200">₹{data.open}</span></div>
            <div><span className="text-slate-400">High:</span> <span className="text-emerald-400">₹{data.high}</span></div>
            <div><span className="text-slate-400">Low:</span> <span className="text-rose-400">₹{data.low}</span></div>
            <div><span className="text-slate-400">Close:</span> <span className="text-white font-bold">₹{data.close}</span></div>
            <div className="col-span-2 pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Volume:</span> <span className="text-slate-300">{(data.volume / 1000000).toFixed(2)}M</span>
            </div>
            {data.sma20 && <div><span className="text-indigo-400">SMA 20:</span> <span>₹{data.sma20}</span></div>}
            {data.sma50 && <div><span className="text-amber-400">SMA 50:</span> <span>₹{data.sma50}</span></div>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        
        {/* Chart type toggles */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'area' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AreaChart className="w-3.5 h-3.5" />
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'line' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Line
          </button>
          <button
            onClick={() => setChartType('candle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'candle' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Bar / Candle
          </button>
        </div>

        {/* Overlay toggles */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showSma20}
              onChange={(e) => setShowSma20(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-indigo-400 font-medium">SMA 20</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showSma50}
              onChange={(e) => setShowSma50(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="text-amber-400 font-medium">SMA 50</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={(e) => setShowVolume(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-slate-400 focus:ring-0"
            />
            <span className="text-slate-400">Volume</span>
          </label>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onPeriodChange && onPeriodChange(tf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                period === tf ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

      </div>

      {/* Chart Canvas */}
      <div className="h-[420px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              minTickGap={40}
            />
            <YAxis
              yAxisId="price"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tickFormatter={formatYAxis}
              domain={['auto', 'auto']}
              orientation="right"
            />
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="left"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 'dataMax * 4']}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
              />
            )}
            <Tooltip content={<CustomTooltip />} />

            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="#334155"
                opacity={0.5}
                radius={[2, 2, 0, 0]}
              />
            )}

            {chartType === 'area' && (
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="close"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            )}

            {chartType === 'line' && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="close"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            )}

            {chartType === 'candle' && (
              <Bar
                yAxisId="price"
                dataKey="close"
                fill="#10b981"
                stroke="#10b981"
              />
            )}

            {showSma20 && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma20"
                stroke="#818cf8"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            )}

            {showSma50 && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma50"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
