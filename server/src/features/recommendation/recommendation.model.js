const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  inputs: {
    N: { type: Number, required: true },
    P: { type: Number, required: true },
    K: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    ph: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    state: { type: String, default: '' },
    season: { type: String, default: '' },
  },
  prediction: {
    type: String,
    required: true,
  },
  recommendations: [{
    crop: String,
    confidence: Number,
    season: String,
    water_requirement: String,
    icon: String,
    description: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for querying user's history
recommendationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
