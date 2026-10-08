/**
 * MGMU IICT Answer Orchestration Service
 *
 * Coordinates the full AI answering pipeline:
 *   1. Multi-part question handling
 *   2. Fused evidence prompting (Groq/Gemini)
 *   3. Fallback provider fallback
 *   4. Post-generation Claim-by-Claim Validation
 *   5. Tone and truthfulness enforcement
 *   6. Source citations & metadata assembly
 */

const { generateWithPrimaryAI } = require('./ai/primaryProvider');
const { generateFallbackResponse } = require('./ai/fallbackProvider');
const {
  extractFactualClaims,
  validateClaimsAgainstEvidence,
  sanitizeAndEnforceTruthfulness
} = require('./claimValidationService');
const { buildFusedEvidencePromptBlock } = require('./sourceVerificationService');
const logger = require('../utils/logger');

/**
 * Splits multi-part questions into individual sub-queries if applicable.
 */
function decomposeMultiPartQuery(query, classification) {
  const intents = classification.intents || [classification.category];
  const entities = classification.entities || [];

  if (intents.length <= 1 && entities.length <= 1) {
    return [query];
  }

  // If query explicitly connects multiple parts with 'and', 'also', or commas
  return [query]; // Handled unified in prompt with per-intent evidence
}

/**
 * Builds the official source citation footer for an answer.
 */
function buildSourceCitationFooter(sources = [], academicYear = '2026-27', retrievedDate) {
  if (!sources || sources.length === 0) return '';

  const citations = [];
  const seen = new Set();

  sources.slice(0, 4).forEach(s => {
    const key = s.sourceUrl || s.title;
    if (!seen.has(key)) {
      seen.add(key);
      const urlText = s.sourceUrl ? ` ([Official Link](${s.sourceUrl}))` : '';
      citations.push(`- **${s.title}**${urlText} — ${s.source || 'MGM University'} (A.Y. ${s.academicYear || academicYear})`);
    }
  });

  return `\n\n**Verified Sources** (Retrieved: ${retrievedDate || 'October 2026'}):\n${citations.join('\n')}\n\n*Information is based on verified MGMU/IICT official sources for Academic Year ${academicYear}.*`;
}

/**
 * Generates and validates an authoritative answer from fused evidence.
 *
 * @param {string} question - User question
 * @param {Object} fusedResult - Fused evidence package from sourceVerificationService
 * @param {Object} classification - Classification with intents and entities
 * @param {Array} contextHistory - Prior chat turns
 * @returns {Promise<Object>} Final answer result object
 */
async function generateVerifiedAnswer(question, fusedResult, classification, contextHistory = []) {
  const { fusedSources, retrievedAt, primaryAcademicYear, isLiveWebVerified, webFailed } = fusedResult;

  logger.info(`[ANSWER_SVC] Generating answer for query: "${question}" with ${fusedSources.length} sources`);

  if (!fusedSources || fusedSources.length === 0) {
    return {
      text: "I couldn't find verified official information about this in MGM University IICT's records. To ensure you receive accurate details, please check directly with the MGMU Admission Cell at +91 240-6481000 or visit https://admissions.mgmu.ac.in/.",
      confidence: 'LOW',
      isGrounded: false,
      sources: [],
      provider: 'knowledge-boundary',
      isLiveWebVerified: false,
      retrievedAt,
      academicYear: primaryAcademicYear
    };
  }

  // ── Step 1: Attempt generation with Primary AI ─────────────────────────────
  let rawAnswer = null;
  let provider = 'groq';

  try {
    // Generate with Primary LLM (Groq / Gemini)
    rawAnswer = await generateWithPrimaryAI(question, fusedSources, classification, contextHistory);
  } catch (err) {
    logger.warn(`[ANSWER_SVC] Primary AI error: ${err.message}`);
  }

  // ── Step 2: Fallback provider if primary LLM unavailable ───────────────────
  if (!rawAnswer) {
    logger.info('[ANSWER_SVC] Using verified deterministic fallback provider');
    provider = 'fallback-deterministic';
    rawAnswer = generateFallbackResponse(question, fusedSources, classification);
  }

  // ── Step 3: Claim-by-Claim Validation ──────────────────────────────────────
  const extractedClaims = extractFactualClaims(rawAnswer);
  const claimValidation = validateClaimsAgainstEvidence(extractedClaims, fusedSources);

  logger.info(`[ANSWER_SVC] Claim validation: isValid=${claimValidation.isValid}, unsupported=${claimValidation.unsupportedClaims.length}`);

  // ── Step 4: Sanitize tone and enforce truthfulness ─────────────────────────
  let finalAnswer = sanitizeAndEnforceTruthfulness(rawAnswer, claimValidation, fusedResult);

  // Clean up any stray "Sources used:" or "Verified Sources" text from raw LLM output
  finalAnswer = finalAnswer
    .replace(/\n+\*\*Sources used:\*\*[\s\S]*$/i, '')
    .replace(/\n+\*\*Verified Sources\*\*[\s\S]*$/i, '')
    .trim();

  // Determine confidence
  let confidence = 'HIGH';
  if (!isLiveWebVerified && webFailed) {
    confidence = 'MEDIUM';
  } else if (!claimValidation.isValid) {
    confidence = 'MEDIUM';
  }

  return {
    text: finalAnswer,
    confidence,
    isGrounded: true,
    sources: fusedSources,
    provider,
    isLiveWebVerified,
    retrievedAt,
    academicYear: primaryAcademicYear,
    validationDetails: {
      claimsValidated: claimValidation.claimsFound,
      unsupportedClaimsCount: claimValidation.unsupportedClaims.length
    }
  };
}

module.exports = {
  decomposeMultiPartQuery,
  generateVerifiedAnswer,
  buildSourceCitationFooter
};
