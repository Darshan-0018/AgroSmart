const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const recommendationController = require('./recommendation.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');

// All recommendation routes require authentication
router.use(protect);

// POST /api/recommendations/predict
router.post(
  '/predict',
  [
    body('N').isNumeric().withMessage('Nitrogen (N) must be a number'),
    body('P').isNumeric().withMessage('Phosphorus (P) must be a number'),
    body('K').isNumeric().withMessage('Potassium (K) must be a number'),
    body('temperature').isNumeric().withMessage('Temperature must be a number'),
    body('humidity').isNumeric().withMessage('Humidity must be a number'),
    body('ph').isNumeric().withMessage('pH must be a number'),
    body('rainfall').isNumeric().withMessage('Rainfall must be a number'),
  ],
  validate,
  recommendationController.predict
);

// GET /api/recommendations/history
router.get('/history', recommendationController.getHistory);

// GET /api/recommendations/stats
router.get('/stats', recommendationController.getStats);

// DELETE /api/recommendations/:id
router.delete('/:id', recommendationController.deleteRecommendation);

module.exports = router;
