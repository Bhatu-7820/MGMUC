/**
 * MGMU IICT Internal RAG Service
 *
 * Provides entity-scoped, intent-ranked retrieval from the internal verified
 * knowledge base (MongoDB / memoryStore).
 * Serves as Level 4 (Verified Internal Knowledge Base) in the source hierarchy.
 */

const { retrieveVerifiedKnowledge } = require('./retrieval.service');
const logger = require('../utils/logger');

/**
 * Retrieves internal verified knowledge for a query.
 *
 * @param {string} question - User question
 * @param {Object} classification - Query classification with intents and entities
 * @param {Array} contextHistory - Prior conversation messages
 * @returns {Promise<Object>} Retrieval result with sources and tier
 */
async function retrieveInternalKnowledge(question, classification, contextHistory = []) {
  try {
    const result = await retrieveVerifiedKnowledge(question, classification, contextHistory);
    return {
      tier: result.tier,
      sources: result.sources.map(s => ({
        ...s,
        level: 4, // Level 4: Verified Internal Knowledge Base
        authorityScore: s.authorityLevel || 70,
        academicYear: s.academicYear || '2026-27'
      })),
      retrievalDebug: result.retrievalDebug
    };
  } catch (error) {
    logger.error(`[RAG_SERVICE] Retrieval error: ${error.message}`);
    return {
      tier: 'ERROR',
      sources: [],
      error: error.message
    };
  }
}

module.exports = {
  retrieveInternalKnowledge
};
