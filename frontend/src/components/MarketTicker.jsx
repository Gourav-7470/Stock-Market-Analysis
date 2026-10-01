import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTicker = ({ indices = [] }) => {
  const defaultIndices = [
    { symbol: 'NIFTY 50', level: '22,485.50', change: +0.65, points: '+145.20' },
    { symbol: 'SENSEX', level: '74,012.30', change: +0.58, points: '+425.80' },
    { symbol: 'NIFTY IT', level: '35,120.10', change: +0.82, points: '+284.50' },
    { symbol: 'BANK NIFTY', level: '47,850.90', change: +0.45, points: '+214.10' },
    { symbol: 'BRENT CRUDE', level: '$85.40', change: -0.32, points: '-0.28' }
  ];

  const items = indices.length > 0 ? indices : defaultIndices;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 min-w-max text-xs">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          MARKETS LIVE
        </span>
        {items.map((item, idx) => {
          const isPos = typeof item.change === 'number' ? item.change >= 0 : !item.change.toString().startsWith('-');
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="font-medium text-slate-300">{item.name || item.symbol}</span>
              <span className="font-mono text-slate-100">{item.level}</span>
              <span className={`flex items-center gap-0.5 font-medium ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPos ? '+' : ''}{typeof item.change === 'number' ? item.change.toFixed(2) : item.change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketTicker;
