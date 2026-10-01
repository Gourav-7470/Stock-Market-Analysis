const express = require('express');
const router = express.Router();
const {
  search,
  getQuote,
  getHistory,
  getIndicators,
  getRisk,
  compareStocks
} = require('../controllers/stockController');

router.get('/search', search);
router.get('/compare', compareStocks);
router.get('/:symbol', getQuote);
router.get('/:symbol/history', getHistory);
router.get('/:symbol/indicators', getIndicators);
router.get('/:symbol/risk', getRisk);

module.exports = router;
