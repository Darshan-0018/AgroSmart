const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/env');
const { errorHandler } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./features/auth/auth.routes');
const recommendationRoutes = require('./features/recommendation/recommendation.routes');
const cropPricesRoutes = require('./features/crop-prices/crop-prices.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/crop-prices', cropPricesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🤖 ML Service: ${config.mlServiceUrl}`);
  console.log(`🌐 Client URL: ${config.clientUrl}\n`);
});
