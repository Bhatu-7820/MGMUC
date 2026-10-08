const express = require('express');
const router = express.Router();
const chatRoutes = require('./chat');
const knowledgeRoutes = require('./knowledge');
const conversationRoutes = require('./conversations');
const { getDBStatus } = require('../config/db');

router.use('/chat', chatRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/conversations', conversationRoutes);

// Health check & API System Status Endpoint
router.get('/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    system: 'MGMU IICT College Information Chatbot API',
    version: '1.0.0',
    database: dbStatus,
    primaryApiConfigured: Boolean(process.env.PRIMARY_API_URL),
    fallbackApiConfigured: Boolean(process.env.FALLBACK_API_URL),
    aiProviderConfigured: Boolean(process.env.AI_API_KEY)
  });
});

module.exports = router;
