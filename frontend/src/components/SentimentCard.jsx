import React from 'react';
import { Newspaper, ThumbsUp, Minus, ThumbsDown, ExternalLink } from 'lucide-react';

const SentimentCard = ({ sentimentData = {} }) => {
  const breakdown = sentimentData.breakdown || { positive: 52, neutral: 31, negative: 17 };
  const headlines = sentimentData.headlines || [
    { title: 'Reliance Industries reports strong quarterly revenue growth', source: 'Financial Express', sentiment: 'Positive', score: 0.78, timestamp: '2 hours ago' },
    { title: 'Analysts maintain buy rating on key stock ahead of board meeting', source: 'Economic Times', sentiment: 'Positive', score: 0.62, timestamp: '4 hours ago' },
    { title: 'Market volatility impacts sector valuations across exchanges', source: 'LiveMint', sentiment: 'Neutral', score: 0.05, timestamp: '6 hours ago' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-sky-400" />
          Financial News NLP Sentiment
        </h3>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          Overall: {sentimentData.overallSentiment || 'Positive / Bullish'}
        </span>
      </div>

      {/* Sentiment Distribution Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-emerald-400 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" /> Positive {breakdown.positive}%
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Minus className="w-3.5 h-3.5" /> Neutral {breakdown.neutral}%
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <ThumbsDown className="w-3.5 h-3.5" /> Negative {breakdown.negative}%
          </span>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex">
          <div style={{ width: `${breakdown.positive}%` }} className="bg-emerald-500 h-full" />
          <div style={{ width: `${breakdown.neutral}%` }} className="bg-slate-500 h-full" />
          <div style={{ width: `${breakdown.negative}%` }} className="bg-rose-500 h-full" />
        </div>
      </div>

      {/* Headlines List */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Recent Aggregated Headlines & NLP Classification
        </span>
        <div className="space-y-2">
          {headlines.map((item, idx) => {
            const isPos = item.sentiment === 'Positive';
            const isNeg = item.sentiment === 'Negative';
            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800/70 hover:border-slate-700 rounded-xl p-3 flex items-start justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-200 hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.timestamp || 'Today'}</span>
                  </div>
                </div>

                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    isPos
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isNeg
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default SentimentCard;
