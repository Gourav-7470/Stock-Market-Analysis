import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MarketTicker from './components/MarketTicker';
import DisclaimerBanner from './components/DisclaimerBanner';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StockExplorer from './pages/StockExplorer';
import StockDetails from './pages/StockDetails';
import StockCompare from './pages/StockCompare';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import MLForecastPage from './pages/MLForecastPage';
import NewsSentimentPage from './pages/NewsSentimentPage';
import StrategyBacktestPage from './pages/StrategyBacktestPage';
import WatchlistPage from './pages/WatchlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
          <DisclaimerBanner />
          <Navbar />
          <MarketTicker />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stocks" element={<StockExplorer />} />
              <Route path="/stocks/:symbol" element={<StockDetails />} />
              <Route path="/compare" element={<StockCompare />} />
              <Route path="/portfolio" element={<PortfolioAnalytics />} />
              <Route path="/forecast" element={<MLForecastPage />} />
              <Route path="/sentiment" element={<NewsSentimentPage />} />
              <Route path="/backtest" element={<StrategyBacktestPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>

          <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 space-y-2">
              <p className="font-semibold text-slate-400">Stock & Financial Market Analysis Platform</p>
              <p>Designed for Educational & Financial Data Science Analytics. Model predictions are statistical estimates, not financial advice.</p>
              <p className="text-[10px] text-slate-600">© 2026 FinAnalytics AI. Built with React, Node.js, Express, MongoDB, & Python FastAPI.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
