const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/ml', require('./routes/mlRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Stock & Financial Market Analytics API',
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Backend Server] Express server running on port ${PORT}`);
});
