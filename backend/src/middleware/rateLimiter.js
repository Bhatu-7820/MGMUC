const rateLimit = require('express-rate-limit');

const chatRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded. You have sent too many requests to MGMU IICT Chatbot. Please try again after 15 minutes."
  }
});

module.exports = {
  chatRateLimiter
};
