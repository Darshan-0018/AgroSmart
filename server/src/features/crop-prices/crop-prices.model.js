const mongoose = require('mongoose');

const cropPriceSchema = new mongoose.Schema({
  state: { type: String, required: true, index: true },
  district: { type: String, default: '' },
  market: { type: String, default: '' },
  commodity: { type: String, required: true, index: true },
  variety: { type: String, default: '' },
  arrival_date: { type: String, default: '' },
  min_price: { type: Number, default: 0 },
  max_price: { type: Number, default: 0 },
  modal_price: { type: Number, default: 0 },
  fetched_at: { type: Date, default: Date.now },
});

// TTL index — auto-delete after 24 hours
cropPriceSchema.index({ fetched_at: 1 }, { expireAfterSeconds: 86400 });
cropPriceSchema.index({ state: 1, commodity: 1 });

module.exports = mongoose.model('CropPrice', cropPriceSchema);
