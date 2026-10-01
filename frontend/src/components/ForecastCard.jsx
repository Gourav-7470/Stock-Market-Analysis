import React, { useState } from 'react';
import { Brain, Sparkles, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

const ForecastCard = ({ forecastData = {}, onModelChange }) => {
  const [model, setModel] = useState('xgboost');
  const [horizon, setHorizon] = useState(5);

  const range = forecastData.estimatedRange || { lower: 2790, upper: 2930 };
  const metrics = forecastData.metrics || { MAE: 14.2, RMSE: 19.8, MAPE: '1.2%', directionalAccuracy: '68.5%' };
  const features = forecastData.featureImportances || [
    { feature: 'Previous Close', importance: 0.38 },
    { feature: '5D Momentum', importance: 0.22 },
    { feature: 'RSI (14)', importance: 0.16 },
    { feature: 'Volume Change', importance: 0.12 },
    { feature: 'Volatility (20D)', importance: 0.08 },
    { feature: 'SMA 50', importance: 0.04 }
  ];

  const handleSelectModel = (m) => {
    setModel(m);
    if (onModelChange) onModelChange(m, horizon);
  };

  const handleSelectHorizon = (h) => {
    setHorizon(h);
    if (onModelChange) onModelChange(model, h);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              ML Price Forecasting Engine
            </h3>
            <span className="text-[11px] text-slate-400">Time-Series Walk-Forward Validation</span>
          </div>
        </div>

        {/* Model & Horizon Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['xgboost', 'random_forest', 'linear'].map((m) => (
              <button
                key={m}
                onClick={() => handleSelectModel(m)}
                className={`px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  model === m ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'random_forest' ? 'RF' : m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[5, 10, 30].map((h) => (
              <button
                key={h}
                onClick={() => handleSelectHorizon(h)}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  horizon === h ? 'bg-slate-800 text-indigo-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Forecast Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Estimated Price Range */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-lg">
          <div>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {horizon}-Day Estimated Range
            </span>
            <div className="font-mono text-2xl font-extrabold text-white mt-2">
              ₹{range.lower?.toLocaleString()} – ₹{range.upper?.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Current Price: <span className="font-mono text-slate-200 font-bold">₹{forecastData.currentPrice?.toLocaleString() || '2,850'}</span>
            </p>
          </div>
          <div className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 p-2 rounded-lg font-medium">
            Model: <strong className="uppercase">{forecastData.model || model}</strong> | Walk-forward validated horizon
          </div>
        </div>

        {/* Model Metrics */}
        <div className="md:col-span-2 bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Model Performance Metrics
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400">MAE</span>
              <div className="font-mono text-sm font-bold text-slate-200">{metrics.MAE}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400">RMSE</span>
              <div className="font-mono text-sm font-bold text-slate-200">{metrics.RMSE}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400">MAPE</span>
              <div className="font-mono text-sm font-bold text-emerald-400">{metrics.MAPE}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400">Direction Acc.</span>
              <div className="font-mono text-sm font-bold text-indigo-400">{metrics.directionalAccuracy}</div>
            </div>
          </div>
        </div>

      </div>

      {/* SHAP Feature Importance Section */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          SHAP Model Explainability (Input Feature Importance)
        </span>
        <div className="space-y-2 pt-1">
          {features.map((feat, idx) => {
            const pct = Math.round(feat.importance * 100);
            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>{feat.feature}</span>
                  <span className="font-mono text-slate-400">{pct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Disclaimer */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Predictions are statistical model estimates based on historical time-series data and do not guarantee future results.</span>
      </div>

    </div>
  );
};

export default ForecastCard;
