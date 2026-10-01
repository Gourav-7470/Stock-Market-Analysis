import React, { useState, useEffect } from 'react';
import { Brain, Search } from 'lucide-react';
import { getForecast } from '../services/api';
import ForecastCard from '../components/ForecastCard';

const MLForecastPage = () => {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [inputSymbol, setInputSymbol] = useState('RELIANCE');
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchForecast = async (sym) => {
    setLoading(true);
    try {
      const res = await getForecast(sym, 'xgboost', 5);
      setForecast(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(symbol);
  }, [symbol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputSymbol.trim()) {
      setSymbol(inputSymbol.trim().toUpperCase());
    }
  };

  const handleModelChange = async (model, horizon) => {
    setLoading(true);
    try {
      const res = await getForecast(symbol, model, horizon);
      setForecast(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" /> Machine Learning Forecasting Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Time-Series forecasting engine using XGBoost, Random Forest, & Ridge regression with SHAP explainability.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            placeholder="Symbol (e.g. TCS)..."
            className="bg-transparent border-0 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none w-36 font-mono"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold"
          >
            Forecast
          </button>
        </form>
      </div>

      <ForecastCard forecastData={forecast} onModelChange={handleModelChange} />

    </div>
  );
};

export default MLForecastPage;
