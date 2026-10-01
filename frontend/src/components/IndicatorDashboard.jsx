import React from 'react';
import { Activity, Gauge, Zap, TrendingUp, Compass } from 'lucide-react';

const IndicatorDashboard = ({ data = {} }) => {
  const dashboard = data.dashboard || {};

  const items = [
    {
      title: 'RSI (14)',
      value: dashboard.rsi?.value ? dashboard.rsi.value.toFixed(1) : '56.4',
      state: dashboard.rsi?.state || 'Neutral range (30-70)',
      icon: Gauge,
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      title: 'MACD (12, 26, 9)',
      value: dashboard.macd?.value !== undefined ? (dashboard.macd.value >= 0 ? `+${dashboard.macd.value}` : dashboard.macd.value) : '+12.2',
      state: dashboard.macd?.state || 'Positive Momentum',
      icon: Activity,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      title: 'SMA 50',
      value: dashboard.sma50?.value ? `₹${dashboard.sma50.value.toLocaleString()}` : '₹2,740',
      state: dashboard.sma50?.state || 'Price Above SMA 50',
      icon: TrendingUp,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      title: 'SMA 200',
      value: dashboard.sma200?.value ? `₹${dashboard.sma200.value.toLocaleString()}` : '₹2,580',
      state: dashboard.sma200?.state || 'Price Above SMA 200',
      icon: Compass,
      color: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    },
    {
      title: 'Bollinger Bands',
      value: dashboard.bollingerBandWidth?.upper ? `Upper ₹${dashboard.bollingerBandWidth.upper}` : 'Normal Envelope',
      state: 'Price within 2 SD Envelope',
      icon: Zap,
      color: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Technical Indicator Analytics
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Educational Analytical States</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.title}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="font-mono text-lg font-bold text-slate-100">
                {item.value}
              </div>
              <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${item.badgeBg}`}>
                {item.state}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndicatorDashboard;
