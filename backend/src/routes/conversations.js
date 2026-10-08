const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversationById,
  deleteConversation,
  renameConversation
} = require('../controllers/conversationController');

router.get('/', getConversations);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);
router.patch('/:id', renameConversation);

module.exports = router;
