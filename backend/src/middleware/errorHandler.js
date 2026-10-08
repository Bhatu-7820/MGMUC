const logger = require('../utils/logger');

const globalErrorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack, path: req.path });

  // Return user-friendly response without leaking internal server secrets
  res.status(err.status || 500).json({
    success: false,
    message: "I'm unable to retrieve the requested information right now. Please try again or check the official MGMU IICT website."
  });
};

module.exports = {
  globalErrorHandler
};
