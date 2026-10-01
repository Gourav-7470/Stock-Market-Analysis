const mlClientService = require('../services/mlClientService');

const getForecast = async (req, res, next) => {
  try {
    const { symbol, model, horizon } = req.body;
    const sym = symbol || 'RELIANCE';
    const forecast = await mlClientService.getForecast(sym, model, horizon);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
};

const getSentiment = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    const sym = symbol || 'RELIANCE';
    const sentiment = await mlClientService.getSentiment(sym);
    res.json(sentiment);
  } catch (error) {
    next(error);
  }
};

const runBacktest = async (req, res, next) => {
  try {
    const { symbol, strategy, initialCapital } = req.body;
    const sym = symbol || 'RELIANCE';
    const result = await mlClientService.runBacktest(sym, strategy, initialCapital);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getRegimes = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    const result = await mlClientService.getRegimes(symbol || 'RELIANCE');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getAnomalies = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    const result = await mlClientService.getAnomalies(symbol || 'RELIANCE');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getForecast,
  getSentiment,
  runBacktest,
  getRegimes,
  getAnomalies
};
