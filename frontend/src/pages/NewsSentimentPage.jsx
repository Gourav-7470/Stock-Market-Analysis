import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { getSentiment } from '../services/api';
import SentimentCard from '../components/SentimentCard';

const NewsSentimentPage = () => {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [inputSymbol, setInputSymbol] = useState('RELIANCE');
  const [sentiment, setSentiment] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSentiment = async (sym) => {
    setLoading(true);
    try {
      const res = await getSentiment(sym);
      setSentiment(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment(symbol);
  }, [symbol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputSymbol.trim()) {
      setSymbol(inputSymbol.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-sky-400" /> Financial News Sentiment NLP Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregates financial headlines and classifies sentiment score into Positive, Neutral, and Negative.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            placeholder="Symbol (e.g. INFY)..."
            className="bg-transparent border-0 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none w-36 font-mono"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold"
          >
            Analyze Sentiment
          </button>
        </form>
      </div>

      <SentimentCard sentimentData={sentiment} />

    </div>
  );
};

export default NewsSentimentPage;
