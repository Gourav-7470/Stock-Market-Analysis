import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-200/90 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <p>
          <strong className="font-semibold text-amber-300">Educational Disclaimer:</strong> This platform is intended for educational and analytical purposes only. Market data and model outputs may be delayed, incomplete, or inaccurate. Forecasts are statistical estimates based on historical data and assumptions and do not constitute guaranteed future performance or personalized investment advice.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
