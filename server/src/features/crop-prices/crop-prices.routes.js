const express = require('express');
const router = express.Router();
const cropPricesController = require('./crop-prices.controller');

// Public routes (no auth required for price data)
router.get('/search', cropPricesController.search);
router.get('/states', cropPricesController.getStates);
router.get('/commodities', cropPricesController.getCommodities);
router.get('/trends', cropPricesController.getTrends);
router.get('/compare', cropPricesController.compare);

module.exports = router;
