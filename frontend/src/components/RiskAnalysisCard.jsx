import React from 'react';
import { ShieldAlert, TrendingDown, Percent, Scale, Info } from 'lucide-react';

const RiskAnalysisCard = ({ risk = {} }) => {
  const metrics = [
    {
      label: 'Annualized Volatility',
      value: `${risk.annualizedVolatilityPct ?? 21.8}%`,
      desc: '252-day standard deviation',
      icon: Percent,
      color: 'text-amber-400'
    },
    {
      label: 'Maximum Drawdown',
      value: `${risk.maxDrawdownPct ?? -27.4}%`,
      desc: 'Peak-to-trough decline',
      icon: TrendingDown,
      color: 'text-rose-400'
    },
    {
      label: 'Historical VaR (95%)',
      value: `${risk.historicalVaR95Pct ?? -2.8}%`,
      desc: '1-day 95% confidence loss',
      icon: ShieldAlert,
      color: 'text-indigo-400'
    },
    {
      label: 'Sharpe Ratio',
      value: `${risk.sharpeRatio ?? 1.45}`,
      desc: 'Risk-adjusted return',
      icon: Scale,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Risk & Volatility Analytics
        </h3>
        <span className="text-[11px] text-slate-400">Quantitative Risk Engine</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-1.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="font-mono text-xl font-bold text-slate-100">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {m.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300 font-semibold">Methodology:</strong> {risk.methodology || 'Historical percentile VaR (95% confidence, 1-day horizon) & Annualized Standard Deviation (252 trading days).'}. Risk parameters do not account for liquidity black swans.
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
