const Conversation = require('../models/Conversation');
const { getDBStatus, memoryStore } = require('../config/db');

const getConversations = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const convs = await Conversation.find().sort({ updatedAt: -1 }).select('-messages');
      return res.json({ success: true, data: convs });
    }
    return res.json({
      success: true,
      data: memoryStore.conversations.map(c => ({ _id: c.id, title: c.title, category: c.category, updatedAt: new Date() }))
    });
  } catch (err) {
    next(err);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const conv = await Conversation.findById(id);
      if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });
      return res.json({ success: true, data: conv });
    }
    const conv = memoryStore.conversations.find(c => c.id === id);
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });
    return res.json({ success: true, data: conv });
  } catch (err) {
    next(err);
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      await Conversation.findByIdAndDelete(id);
    } else {
      memoryStore.conversations = memoryStore.conversations.filter(c => c.id !== id);
    }
    return res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const renameConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const updated = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
      return res.json({ success: true, data: updated });
    }
    const conv = memoryStore.conversations.find(c => c.id === id);
    if (conv) conv.title = title;
    return res.json({ success: true, data: conv });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
  renameConversation
};
