const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  sources: [{
    title: String,
    source: String,
    sourceUrl: String,
    verified: Boolean,
    lastUpdated: String
  }],
  category: { type: String },
  confidence: { type: String, enum: ['HIGH', 'MEDIUM', 'FALLBACK', 'UNVERIFIED'] },
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  category: { type: String, default: 'GENERAL' },
  userIp: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
