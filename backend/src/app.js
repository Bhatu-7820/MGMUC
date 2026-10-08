const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const logger = require('./utils/logger');
const apiRoutes = require('./routes/api');
const { globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allows Vite dev server assets
}));

const path = require('path');

// CORS Configuration
const allowedOrigin = process.env.CORS_ORIGIN;
if (allowedOrigin && allowedOrigin !== '*') {
  const origins = allowedOrigin.includes(',') 
    ? allowedOrigin.split(',').map((o) => o.trim()) 
    : allowedOrigin;
  app.use(cors({ origin: origins, credentials: true }));
} else {
  app.use(cors({ origin: true, credentials: true }));
}

// Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Logging
app.use(morgan('short', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// API Routes
app.use('/api', apiRoutes);

// Static Assets & Production SPA Routing
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Root Welcome Health Check in development
  app.get('/', (req, res) => {
    res.json({
      name: 'MGMU IICT AI Chatbot API Server',
      status: 'Running',
      documentation: '/api/health'
    });
  });
}

// Global Error Handling Middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    const dbInfo = getDBStatus();
    logger.info(`=======================================================`);
    logger.info(`🚀 MGMU IICT Server running on port ${PORT}`);
    logger.info(`⚙️  Data Mode: ${dbInfo.mode}`);
    logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`=======================================================`);
  });
});

module.exports = app;
