const express = require('express');
const router = express.Router();
const { getWatchlist, addSymbol, removeSymbol } = require('../controllers/watchlistController');

router.get('/', getWatchlist);
router.post('/', addSymbol);
router.delete('/:symbol', removeSymbol);

module.exports = router;
