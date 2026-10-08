/**
 * MGMU IICT AI Orchestration Service
 *
 * Pipeline:
 *   1. Try primary AI provider (external LLM with evidence package)
 *   2. If unavailable, use grounded fallback engine
 *   3. Validate response (anti-hallucination guardrails)
 *   4. Completeness check (did we answer all parts of the question?)
 *   5. Return final validated response
 */

const { generateWithPrimaryAI } = require('./primaryProvider');
const { generateGroundedResponse } = require('./fallbackProvider');
const { validateResponse, SAFE_UNAVAILABLE_RESPONSE } = require('./responseValidator');
const logger = require('../../utils/logger');

// ─── Completeness Check ───────────────────────────────────────────────────────
/**
 * Checks if the generated response addresses ALL detected intents.
 * If any intent is missing, appends a note about what's unavailable.
 *
 * @param {string} responseText - The generated response
 * @param {Array}  sources      - Retrieved sources
 * @param {Object} classification - Contains intents and entities
 * @returns {string} - Potentially augmented response
 */
const performCompletenessCheck = (responseText, sources, classification) => {
  const { intents = [], entities = [] } = classification;

  const actionableIntents = intents.filter(i =>
    !['OFF_TOPIC', 'AMBIGUOUS', 'GENERAL', 'COURSES'].includes(i)
  );

  if (actionableIntents.length <= 1) return responseText; // Single intent — no multi-check needed

  const missingIntents = [];

  for (const intent of actionableIntents) {
    // Check if this intent's content area appears in the response
    const intentSignals = {
      FEES:        ['fee', 'tuition', '₹', 'per year', 'annual fee'],
      ELIGIBILITY: ['eligibility', 'eligible', 'qualification', 'minimum', 'pcm', 'cet'],
      ADMISSION:   ['admission', 'apply', 'process', 'portal', 'counseling', 'registration'],
      FACULTY:     ['faculty', 'hod', 'professor', 'teacher', 'director', 'dean'],
      PLACEMENT:   ['placement', 'company', 'salary', 'package', 'tpo'],
      SCHOLARSHIP: ['scholarship', 'ebc', 'mahadbt', 'concession'],
      HOSTEL:      ['hostel', 'accommodation', 'mess'],
      DOCUMENTS:   ['document', 'certificate', 'marksheet'],
      EXAM:        ['exam', 'examination', 'timetable', 'result'],
      FACILITIES:  ['library', 'lab', 'sports', 'gym', 'canteen', 'wifi', 'campus'],
      CONTACT:     ['contact', 'phone', 'email', 'address']
    };

    const signals = intentSignals[intent] || [];
    const responseLower = responseText.toLowerCase();
    const hasContent = signals.some(s => responseLower.includes(s));

    if (!hasContent) {
      // Check if sources contain info for this intent
      const intentCategories = {
        FEES:        ['FEES', 'COURSES'],
        ELIGIBILITY: ['COURSES', 'ADMISSION'],
        ADMISSION:   ['ADMISSION'],
        FACULTY:     ['FACULTY'],
        PLACEMENT:   ['PLACEMENT'],
        SCHOLARSHIP: ['SCHOLARSHIP'],
        HOSTEL:      ['HOSTEL', 'FACILITIES'],
        DOCUMENTS:   ['DOCUMENTS'],
        EXAM:        ['EXAM'],
        FACILITIES:  ['FACILITIES'],
        CONTACT:     ['CONTACT']
      };

      const targetCats = intentCategories[intent] || [];
      const hasSource = sources.some(s => targetCats.includes(s.category));

      if (!hasSource) {
        missingIntents.push(intent);
      }
    }
  }

  if (missingIntents.length > 0) {
    const missingLabels = missingIntents.map(i => {
      const labels = {
        FEES: 'fee structure', ELIGIBILITY: 'eligibility criteria',
        ADMISSION: 'admission process', FACULTY: 'faculty details',
        PLACEMENT: 'placement information', SCHOLARSHIP: 'scholarship details',
        HOSTEL: 'hostel information', DOCUMENTS: 'required documents',
        EXAM: 'examination details', FACILITIES: 'campus facilities',
        CONTACT: 'contact information'
      };
      return labels[i] || i.toLowerCase();
    });

    const entityRef = entities.length > 0 ? ` for ${entities.join(' / ')}` : '';
    responseText += `\n\n> **Note:** I found the information above, but the current knowledge base doesn't have verified details about ${missingLabels.join(', ')}${entityRef}. I don't want to guess on those.`;
  }

  return responseText;
};

// ─── Main AI Orchestration ────────────────────────────────────────────────────
/**
 * Orchestrates AI response generation:
 *   1. Primary AI (external LLM)
 *   2. Grounded fallback (template from sources)
 *   3. Safe unavailable message
 *
 * @param {string} query            - User question
 * @param {Array}  sources          - Retrieved verified knowledge sources
 * @param {Object} classification   - {category, intents, entities, ...}
 * @param {Array}  contextHistory   - Recent conversation messages
 * @returns {Object} {text, provider, confidence, isGrounded, sources}
 */
const processAiResponse = async (query, sources, classification, contextHistory = []) => {
  let rawResponseText = null;
  let providerUsed = 'GROUNDED_ENGINE';

  // ── Step 1: Validate that we have sources ─────────────────────────────────
  if (!sources || sources.length === 0) {
    logger.info('[AI_ORCH] No verified sources — returning safe unavailable response');
    return {
      text: SAFE_UNAVAILABLE_RESPONSE,
      provider: 'SAFE_FALLBACK',
      confidence: 'UNVERIFIED',
      isGrounded: false,
      sources: []
    };
  }

  // ── Step 2: Try Primary AI Provider ──────────────────────────────────────
  if (process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY) {
    try {
      rawResponseText = await generateWithPrimaryAI(query, sources, classification, contextHistory);
      if (rawResponseText) {
        providerUsed = 'PRIMARY_AI_PROVIDER';
        logger.info('[AI_ORCH] Primary AI provider succeeded');
      }
    } catch (err) {
      logger.warn(`[AI_ORCH] Primary AI provider threw: ${err.message}`);
    }
  }

  // ── Step 3: Grounded Fallback ─────────────────────────────────────────────
  if (!rawResponseText) {
    rawResponseText = generateGroundedResponse(query, sources, classification);
    if (rawResponseText) {
      providerUsed = 'GROUNDED_ENGINE';
      logger.info('[AI_ORCH] Grounded engine generated response');
    }
  }

  // ── Step 4: Final safe fallback ───────────────────────────────────────────
  if (!rawResponseText) {
    logger.warn('[AI_ORCH] Both providers failed — returning safe unavailable response');
    return {
      text: SAFE_UNAVAILABLE_RESPONSE,
      provider: 'SAFE_FALLBACK',
      confidence: 'UNVERIFIED',
      isGrounded: false,
      sources: []
    };
  }

  // ── Step 5: Anti-hallucination Validation ─────────────────────────────────
  const validationResult = validateResponse(rawResponseText, sources, classification);

  if (!validationResult.isValid) {
    logger.warn(`[AI_ORCH] Response failed validation: ${validationResult.reason || 'unknown reason'}`);
    // Try grounded engine as safer alternative
    const groundedFallback = generateGroundedResponse(query, sources, classification);
    if (groundedFallback) {
      const groundedValidation = validateResponse(groundedFallback, sources, classification);
      if (groundedValidation.isValid) {
        return {
          text: performCompletenessCheck(groundedFallback, sources, classification),
          provider: 'GROUNDED_ENGINE',
          confidence: 'MEDIUM',
          isGrounded: true,
          sources
        };
      }
    }
    return {
      text: SAFE_UNAVAILABLE_RESPONSE,
      provider: 'SAFE_FALLBACK',
      confidence: 'UNVERIFIED',
      isGrounded: false,
      sources: []
    };
  }

  // ── Step 6: Completeness Check ────────────────────────────────────────────
  const completeText = performCompletenessCheck(validationResult.text, sources, classification);

  return {
    text: completeText,
    provider: providerUsed,
    confidence: validationResult.confidence || 'HIGH',
    isGrounded: validationResult.isGrounded,
    sources
  };
};

module.exports = {
  processAiResponse
};
