const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio, analyzePortfolio } = require('../controllers/portfolioController');

router.get('/', getPortfolio);
router.post('/', updatePortfolio);
router.put('/', updatePortfolio);
router.get('/analyze', analyzePortfolio);

module.exports = router;
