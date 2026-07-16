const cropPricesService = require('./crop-prices.service');

// GET /api/crop-prices/search
exports.search = async (req, res) => {
  try {
    const { state, commodity, district } = req.query;
    const result = await cropPricesService.getOrFetchPrices({ state, commodity, district });

    res.json({
      success: true,
      source: result.source,
      count: result.data.length,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop prices',
      error: error.message,
    });
  }
};

// GET /api/crop-prices/states
exports.getStates = (req, res) => {
  res.json({
    success: true,
    data: cropPricesService.getStates(),
  });
};

// GET /api/crop-prices/commodities
exports.getCommodities = (req, res) => {
  res.json({
    success: true,
    data: cropPricesService.getCommodities(),
  });
};

// GET /api/crop-prices/trends
exports.getTrends = async (req, res) => {
  try {
    const { commodity, state } = req.query;

    if (!commodity) {
      return res.status(400).json({
        success: false,
        message: 'Commodity is required',
      });
    }

    // Fetch data for multiple states for comparison
    const states = state
      ? [state]
      : ['Maharashtra', 'Punjab', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu'];

    const trendData = [];
    for (const s of states) {
      const result = await cropPricesService.getOrFetchPrices({
        state: s,
        commodity,
      });
      if (result.data.length > 0) {
        trendData.push({
          state: s,
          prices: result.data.map(d => ({
            market: d.market || d.district,
            min_price: d.min_price,
            max_price: d.max_price,
            modal_price: d.modal_price,
            date: d.arrival_date,
          })),
        });
      }
    }

    res.json({
      success: true,
      commodity,
      data: trendData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trend data',
      error: error.message,
    });
  }
};

// GET /api/crop-prices/compare
exports.compare = async (req, res) => {
  try {
    const { commodities, state } = req.query;

    if (!commodities) {
      return res.status(400).json({
        success: false,
        message: 'Commodities list is required (comma-separated)',
      });
    }

    const commodityList = commodities.split(',').map(c => c.trim());
    const comparisonData = [];

    for (const commodity of commodityList) {
      const result = await cropPricesService.getOrFetchPrices({
        state: state || '',
        commodity,
      });

      if (result.data.length > 0) {
        const avgPrice = result.data.reduce((sum, d) => sum + d.modal_price, 0) / result.data.length;
        comparisonData.push({
          commodity,
          avgPrice: Math.round(avgPrice),
          minPrice: Math.min(...result.data.map(d => d.min_price)),
          maxPrice: Math.max(...result.data.map(d => d.max_price)),
          markets: result.data.length,
        });
      }
    }

    res.json({
      success: true,
      data: comparisonData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to compare crop prices',
      error: error.message,
    });
  }
};
