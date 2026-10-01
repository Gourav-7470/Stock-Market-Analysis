const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  allocation: { type: Number, default: 0 }, // percentage (0-100)
  quantity: { type: Number, default: 0 },
  avgBuyPrice: { type: Number, default: 0 }
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    default: 'My Core Portfolio'
  },
  initialCapital: {
    type: Number,
    default: 1000000
  },
  assets: [assetSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
