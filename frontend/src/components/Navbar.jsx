import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, TrendingUp, BarChart2, PieChart, Brain, Newspaper, PlaySquare, Bookmark, User, LogOut } from 'lucide-react';
import { searchStocks } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length > 0) {
        try {
          const res = await searchStocks(query);
          setResults(res.data || []);
          setIsOpen(true);
        } catch (e) {
          setResults([]);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const timer = setTimeout(handleSearch, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectStock = (symbol) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/stocks/${symbol}`);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: TrendingUp },
    { label: 'Explorer', path: '/stocks/RELIANCE', icon: BarChart2 },
    { label: 'Compare', path: '/compare', icon: BarChart2 },
    { label: 'Portfolio', path: '/portfolio', icon: PieChart },
    { label: 'ML Forecast', path: '/forecast', icon: Brain },
    { label: 'Sentiment', path: '/sentiment', icon: Newspaper },
    { label: 'Backtest', path: '/backtest', icon: PlaySquare },
    { label: 'Watchlist', path: '/watchlist', icon: Bookmark },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FinAnalytics<span className="text-indigo-400">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 tracking-wider uppercase font-medium -mt-1">
                Quantitative Platform
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length > 0 && setIsOpen(true)}
                placeholder="Search stocks... (e.g. RELIANCE, TCS, INFY)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/50">
                  Stock Results
                </div>
                {results.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => selectStock(stock.symbol)}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">
                        {stock.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-slate-200">
                        ₹{stock.price}
                      </div>
                      <div className={`text-xs font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path.startsWith('/stocks') && location.pathname.startsWith('/stocks'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Profile */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:block text-xs font-medium text-slate-200">{user.name}</span>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
