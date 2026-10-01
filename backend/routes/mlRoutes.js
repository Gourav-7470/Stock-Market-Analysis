const express = require('express');
const router = express.Router();
const {
  getForecast,
  getSentiment,
  runBacktest,
  getRegimes,
  getAnomalies
} = require('../controllers/mlController');

router.post('/forecast', getForecast);
router.post('/sentiment', getSentiment);
router.post('/backtest', runBacktest);
router.post('/regime', getRegimes);
router.post('/anomalies', getAnomalies);

module.exports = router;
