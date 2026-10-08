/**
 * MGMU IICT Chat Controller
 *
 * Orchestrates the verified, live, web-aware answering pipeline:
 *   1. Understand question & context history
 *   2. Determine intent & entities (classifier.service)
 *   3. Determine whether fresh information is required (webSearchService)
 *   4. Retrieve verified internal knowledge (ragService)
 *   5. Search & verify official MGMU/IICT web sources (webSearchService)
 *   6. Evidence fusion & conflict resolution (sourceVerificationService)
 *   7. AI answer generation with claim-by-claim validation (answerService)
 *   8. Return final answer + sources + academic year + retrieved date
 */

const { classifyQuery } = require('../services/classifier.service');
const { retrieveInternalKnowledge } = require('../services/ragService');
const { isFreshDataRequired, searchAndVerifyWeb } = require('../services/webSearchService');
const { fuseEvidence } = require('../services/sourceVerificationService');
const { generateVerifiedAnswer } = require('../services/answerService');
const Conversation = require('../models/Conversation');
const { getDBStatus, memoryStore } = require('../config/db');
const logger = require('../utils/logger');

// ─── Main Chat Handler ────────────────────────────────────────────────────────
const handleChatMessage = async (req, res, next) => {
  const pipelineDebug = {};

  try {
    const question = req.body.sanitizedQuestion || req.body.question;
    const conversationId = req.body.conversationId;
    const isDebugMode = req.body.debug === true || process.env.DEBUG_MODE === 'true';

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question cannot be empty.' });
    }

    logger.info(`[CHAT] Received query: "${question}"`);
    pipelineDebug.userQuery = question;

    // ── Step 1: Load conversation history ────────────────────────────────────
    let contextHistory = [];
    const dbStatus = getDBStatus();

    if (conversationId) {
      if (dbStatus.connected) {
        try {
          const existingConv = await Conversation.findById(conversationId);
          if (existingConv && existingConv.messages) contextHistory = existingConv.messages;
        } catch (err) {
          logger.warn(`[CHAT] Failed to load conversation: ${err.message}`);
        }
      } else {
        const existingConv = memoryStore.conversations.find(c => c.id === conversationId);
        if (existingConv && existingConv.messages) contextHistory = existingConv.messages;
      }
    }

    pipelineDebug.contextHistoryLength = contextHistory.length;

    // ── Step 2: Query Understanding & Entity Extraction ───────────────────────
    const classification = classifyQuery(question);
    logger.info(`[CHAT] Classification: category=${classification.category}, intents=[${classification.intents.join(', ')}], entities=[${classification.entities.join(', ')}]`);
    pipelineDebug.classification = classification;

    // ── Step 2.1: Conversational Greetings & Small Talk Interceptor ────────────
    if (['GREETING', 'THANKS', 'BOT_IDENTITY'].includes(classification.category)) {
      let directText = '';
      if (classification.category === 'GREETING') {
        directText = "Hello! I am your MGMU IICT AI Assistant. How can I help you today? You can ask me about admissions, degree programs, fees, eligibility, faculty, or campus facilities.";
      } else if (classification.category === 'THANKS') {
        directText = "You're welcome! Feel free to ask if you need any other information about MGM University IICT.";
      } else if (classification.category === 'BOT_IDENTITY') {
        directText = "I am the MGMU IICT AI Assistant, designed to assist students and parents with verified information about MGM University's Institute of Information and Communication Technology (IICT). How can I assist you?";
      }

      let updatedConversationId = conversationId;
      const userMessage = {
        sender: 'user',
        text: question,
        category: classification.category
      };
      const assistantMessage = {
        sender: 'assistant',
        text: directText,
        sources: [],
        category: classification.category,
        confidence: 1.0
      };

      if (dbStatus.connected) {
        try {
          let conv;
          if (conversationId) conv = await Conversation.findById(conversationId);
          if (!conv) {
            conv = new Conversation({
              title: question.slice(0, 40),
              category: classification.category,
              messages: []
            });
          }
          conv.messages.push(userMessage);
          conv.messages.push(assistantMessage);
          await conv.save();
          updatedConversationId = conv._id.toString();
        } catch (err) {
          logger.warn(`[CHAT] Failed to persist greeting: ${err.message}`);
        }
      } else {
        let conv = memoryStore.conversations.find(c => c.id === conversationId);
        if (!conv) {
          conv = {
            id: `conv_${Date.now()}`,
            title: question.slice(0, 40),
            category: classification.category,
            messages: []
          };
          memoryStore.conversations.push(conv);
        }
        conv.messages.push(userMessage);
        conv.messages.push(assistantMessage);
        updatedConversationId = conv.id;
      }

      return res.status(200).json({
        success: true,
        data: {
          question,
          answer: directText,
          intent: classification.category,
          intents: classification.intents,
          entities: [],
          confidence: 1.0,
          provider: 'conversational-direct',
          tier: 'CONVERSATIONAL',
          isGrounded: true,
          isLiveWebVerified: false,
          academicYear: '2026-27',
          retrievedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          sources: [],
          conversationId: updatedConversationId,
          disclaimer: "Answers are based on verified MGMU/IICT official sources."
        }
      });
    }

    // ── Step 3: Freshness / Dynamic Detection ─────────────────────────────────
    const freshnessCheck = isFreshDataRequired(classification, question);
    logger.info(`[CHAT] Freshness check: required=${freshnessCheck.required}, reasons=${freshnessCheck.reasons.join('; ')}`);
    pipelineDebug.freshnessCheck = freshnessCheck;

    // ── Step 4: Search Verified Internal Knowledge Base (RAG) ─────────────────
    const ragResult = await retrieveInternalKnowledge(question, classification, contextHistory);
    logger.info(`[CHAT] Internal RAG tier: ${ragResult.tier}, internal sources: ${ragResult.sources.length}`);
    pipelineDebug.internalRag = {
      tier: ragResult.tier,
      sourcesCount: ragResult.sources.length,
      titles: ragResult.sources.map(s => s.title)
    };

    // ── Step 5: Live Official Web Search & Verification (When Needed) ─────────
    let webVerificationResult = null;
    if (freshnessCheck.required) {
      logger.info(`[CHAT] Dynamic query detected — performing live official web verification`);
      webVerificationResult = await searchAndVerifyWeb(question, classification);
      logger.info(`[CHAT] Web verification status: ${webVerificationResult.verificationStatus}, sources found: ${webVerificationResult.sources.length}`);
      pipelineDebug.webVerification = {
        required: true,
        success: webVerificationResult.success,
        status: webVerificationResult.verificationStatus,
        sourcesFound: webVerificationResult.sources.length,
        errors: webVerificationResult.errors
      };
    } else {
      pipelineDebug.webVerification = {
        required: false,
        reason: 'Static/conceptual query — verified internal knowledge base used'
      };
    }

    // ── Step 6: Evidence Fusion, Source Hierarchy & Conflict Detection ────────
    const fusedResult = fuseEvidence(
      ragResult.sources,
      webVerificationResult,
      freshnessCheck.required
    );
    logger.info(`[CHAT] Fused sources count: ${fusedResult.fusedSources.length}, conflicts detected: ${fusedResult.conflicts.length}`);
    pipelineDebug.evidenceFusion = {
      totalFusedSources: fusedResult.fusedSources.length,
      isLiveWebVerified: fusedResult.isLiveWebVerified,
      webFailed: fusedResult.webFailed,
      academicYear: fusedResult.primaryAcademicYear,
      conflicts: fusedResult.conflicts
    };

    // ── Step 7: AI Answer Generation & Claim-by-Claim Validation ──────────────
    const answerResult = await generateVerifiedAnswer(
      question,
      fusedResult,
      classification,
      contextHistory
    );
    logger.info(`[CHAT] Answer generated: provider=${answerResult.provider}, confidence=${answerResult.confidence}, liveVerified=${answerResult.isLiveWebVerified}`);
    pipelineDebug.answerResult = {
      provider: answerResult.provider,
      confidence: answerResult.confidence,
      isLiveWebVerified: answerResult.isLiveWebVerified,
      validation: answerResult.validationDetails
    };

    // ── Step 8: Conversation Persistence ─────────────────────────────────────
    let updatedConversationId = conversationId;
    const userMessage = {
      sender: 'user',
      text: question,
      category: classification.category
    };
    const assistantMessage = {
      sender: 'assistant',
      text: answerResult.text,
      sources: (answerResult.sources || []).map(s => ({
        title: s.title,
        source: s.source,
        sourceUrl: s.sourceUrl,
        level: s.level,
        authorityScore: s.authorityScore,
        academicYear: s.academicYear || fusedResult.primaryAcademicYear,
        retrievedAt: s.retrievedAt,
        verified: s.verified !== false,
        lastUpdated: s.lastUpdated || s.retrievedAt
      })),
      category: classification.category,
      confidence: answerResult.confidence
    };

    if (dbStatus.connected) {
      try {
        let conv;
        if (conversationId) {
          conv = await Conversation.findById(conversationId);
        }
        if (!conv) {
          conv = new Conversation({
            title: question.slice(0, 40) + (question.length > 40 ? '...' : ''),
            category: classification.category,
            messages: []
          });
        }
        conv.messages.push(userMessage);
        conv.messages.push(assistantMessage);
        await conv.save();
        updatedConversationId = conv._id.toString();
      } catch (err) {
        logger.warn(`[CHAT] Failed to persist conversation in MongoDB: ${err.message}`);
      }
    } else {
      let conv = memoryStore.conversations.find(c => c.id === conversationId);
      if (!conv) {
        conv = {
          id: `conv_${Date.now()}`,
          title: question.slice(0, 40) + (question.length > 40 ? '...' : ''),
          category: classification.category,
          messages: []
        };
        memoryStore.conversations.push(conv);
      }
      conv.messages.push(userMessage);
      conv.messages.push(assistantMessage);
      updatedConversationId = conv.id;
    }

    // ── Step 9: Build & return final response ────────────────────────────────
    const responseData = {
      success: true,
      data: {
        question,
        answer: answerResult.text,
        intent: classification.category,
        intents: classification.intents,
        entities: classification.entities || [],
        confidence: answerResult.confidence,
        provider: answerResult.provider,
        tier: ragResult.tier,
        isGrounded: answerResult.isGrounded,
        isLiveWebVerified: answerResult.isLiveWebVerified,
        academicYear: answerResult.academicYear,
        retrievedAt: answerResult.retrievedAt,
        sources: (answerResult.sources || []).map(s => ({
          title: s.title,
          source: s.source,
          sourceUrl: s.sourceUrl || 'https://mgmu.ac.in/iict',
          level: s.level,
          authorityScore: s.authorityScore,
          academicYear: s.academicYear || fusedResult.primaryAcademicYear,
          retrievedAt: s.retrievedAt,
          verified: s.verified !== false,
          lastUpdated: s.lastUpdated || s.retrievedAt
        })),
        conversationId: updatedConversationId,
        disclaimer: "Answers are based on verified MGMU/IICT official sources and may depend on the latest official updates."
      }
    };

    if (isDebugMode) {
      responseData.data._debug = pipelineDebug;
    }

    return res.status(200).json(responseData);

  } catch (error) {
    logger.error(`[CHAT] Unhandled error: ${error.message}`);
    next(error);
  }
};

// ─── Debug Audit Endpoint ─────────────────────────────────────────────────────
const handleDebugQuery = async (req, res, next) => {
  try {
    const question = req.body.question || req.query.q || '';
    if (!question.trim()) {
      return res.status(400).json({ success: false, error: 'Provide a question.' });
    }

    const classification = classifyQuery(question);
    const freshnessCheck = isFreshDataRequired(classification, question);
    const ragResult = await retrieveInternalKnowledge(question, classification, []);

    let webVerificationResult = null;
    if (freshnessCheck.required) {
      webVerificationResult = await searchAndVerifyWeb(question, classification);
    }

    const fusedResult = fuseEvidence(ragResult.sources, webVerificationResult, freshnessCheck.required);

    return res.status(200).json({
      success: true,
      debug: {
        userQuery: question,
        stage1_classification: classification,
        stage2_freshnessCheck: freshnessCheck,
        stage3_internalRag: {
          tier: ragResult.tier,
          sourcesCount: ragResult.sources.length,
          titles: ragResult.sources.map(s => s.title)
        },
        stage4_webVerification: webVerificationResult,
        stage5_evidenceFusion: {
          totalFusedSources: fusedResult.fusedSources.length,
          isLiveWebVerified: fusedResult.isLiveWebVerified,
          webFailed: fusedResult.webFailed,
          conflicts: fusedResult.conflicts,
          sources: fusedResult.fusedSources.map(s => ({
            title: s.title,
            level: s.level,
            authorityScore: s.authorityScore,
            academicYear: s.academicYear,
            sourceUrl: s.sourceUrl,
            retrievedAt: s.retrievedAt
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleChatMessage,
  handleDebugQuery
};
