const axios = require('axios');
const Recommendation = require('./recommendation.model');
const config = require('../../config/env');

// POST /api/recommendations/predict
exports.predict = async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall, state, season } = req.body;

    // Call ML service
    const mlResponse = await axios.post(`${config.mlServiceUrl}/predict`, {
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall),
    });

    const mlData = mlResponse.data;

    // Save to history
    const recommendation = await Recommendation.create({
      userId: req.user.id,
      inputs: { N, P, K, temperature, humidity, ph, rainfall, state, season },
      prediction: mlData.prediction,
      recommendations: mlData.recommendations,
    });

    res.json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.error || 'ML service error',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to get prediction. Make sure the ML service is running.',
      error: error.message,
    });
  }
};

// GET /api/recommendations/history
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [recommendations, total] = await Promise.all([
      Recommendation.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Recommendation.countDocuments({ userId: req.user.id }),
    ]);

    res.json({
      success: true,
      data: recommendations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get history',
      error: error.message,
    });
  }
};

// GET /api/recommendations/stats
exports.getStats = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const stats = await Recommendation.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: '$prediction',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const totalRecommendations = await Recommendation.countDocuments({ userId: req.user.id });

    const recentRecommendations = await Recommendation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalRecommendations,
        cropDistribution: stats,
        recentRecommendations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message,
    });
  }
};

// DELETE /api/recommendations/:id
exports.deleteRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found',
      });
    }

    res.json({
      success: true,
      message: 'Recommendation deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete recommendation',
      error: error.message,
    });
  }
};
