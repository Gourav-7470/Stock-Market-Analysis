const mongoose = require('mongoose');

const analysisHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  analysisType: {
    type: String,
    required: true,
    enum: ['TECHNICAL', 'RISK', 'FORECAST', 'SENTIMENT', 'BACKTEST', 'REGIME', 'ANOMALY']
  },
  parameters: {
    type: Object,
    default: {}
  },
  summaryResult: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema);
