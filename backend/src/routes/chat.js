const express = require('express');
const router = express.Router();
const { handleChatMessage, handleDebugQuery } = require('../controllers/chatController');
const { chatRateLimiter } = require('../middleware/rateLimiter');
const { sanitizeChatInput } = require('../middleware/validator');

// Main chat endpoint
router.post('/', chatRateLimiter, sanitizeChatInput, handleChatMessage);

// Debug/audit endpoint — shows full pipeline trace for a query
// Pass { question: "..." } or use ?q=... query param
router.post('/debug', handleDebugQuery);
router.get('/debug', handleDebugQuery);

module.exports = router;
