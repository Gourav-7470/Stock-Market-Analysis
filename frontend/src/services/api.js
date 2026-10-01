import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchStocks = async (query) => {
  const res = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const getQuote = async (symbol) => {
  const res = await api.get(`/stocks/${symbol}`);
  return res.data;
};

export const getHistory = async (symbol, period = '1Y') => {
  const res = await api.get(`/stocks/${symbol}/history?period=${period}`);
  return res.data;
};

export const getIndicators = async (symbol) => {
  const res = await api.get(`/stocks/${symbol}/indicators`);
  return res.data;
};

export const getRisk = async (symbol) => {
  const res = await api.get(`/stocks/${symbol}/risk`);
  return res.data;
};

export const compareStocks = async (symbolsList) => {
  const syms = Array.isArray(symbolsList) ? symbolsList.join(',') : symbolsList;
  const res = await api.get(`/stocks/compare?symbols=${encodeURIComponent(syms)}`);
  return res.data;
};

export const getMarketOverview = async () => {
  const res = await api.get('/market/overview');
  return res.data;
};

export const getPortfolio = async () => {
  const res = await api.get('/portfolio');
  return res.data;
};

export const updatePortfolio = async (data) => {
  const res = await api.post('/portfolio', data);
  return res.data;
};

export const analyzePortfolio = async () => {
  const res = await api.get('/portfolio/analyze');
  return res.data;
};

export const getWatchlist = async () => {
  const res = await api.get('/watchlist');
  return res.data;
};

export const addWatchlist = async (symbol) => {
  const res = await api.post('/watchlist', { symbol });
  return res.data;
};

export const removeWatchlist = async (symbol) => {
  const res = await api.delete(`/watchlist/${symbol}`);
  return res.data;
};

export const getForecast = async (symbol, model = 'xgboost', horizon = 5) => {
  const res = await api.post('/ml/forecast', { symbol, model, horizon });
  return res.data;
};

export const getSentiment = async (symbol) => {
  const res = await api.post('/ml/sentiment', { symbol });
  return res.data;
};

export const runBacktest = async (symbol, strategy = 'sma_crossover', initialCapital = 100000) => {
  const res = await api.post('/ml/backtest', { symbol, strategy, initialCapital });
  return res.data;
};

export const getRegimes = async (symbol) => {
  const res = await api.post('/ml/regime', { symbol });
  return res.data;
};

export const getAnomalies = async (symbol) => {
  const res = await api.post('/ml/anomalies', { symbol });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export default api;
