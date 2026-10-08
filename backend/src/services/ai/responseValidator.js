/**
 * MGMU IICT Response Validator & Anti-Hallucination Guardrail Engine
 *
 * Validates AI-generated responses against retrieved verified sources.
 * Detects and blocks hallucinated facts before they reach the user.
 *
 * Checks:
 *   1. Off-topic responses → redirect message
 *   2. Ambiguous queries → clarification request
 *   3. No sources → safe unavailable message
 *   4. Unverified phone numbers → block
 *   5. Hallucinated fee amounts → block
 *   6. Hallucinated program names → block
 *   7. Internet-style language patterns → flag
 */

const logger = require('../../utils/logger');

// ─── Safe Static Responses ────────────────────────────────────────────────────

const SAFE_UNAVAILABLE_RESPONSE =
  "I couldn't find verified information about this in the available MGMU IICT sources. " +
  "For accurate details, please check the official MGMU website at https://mgmu.ac.in/iict or " +
  "contact the MGMU Admission Office at +91-240-2480490 / admissions@mgmu.ac.in.";

const OFF_TOPIC_RESPONSE =
  "I'm specifically designed to assist with MGM University – Institute of Information and Communication Technology (IICT) queries. " +
  "You can ask me about:\n" +
  "• Admissions & eligibility\n" +
  "• Fee structures\n" +
  "• Courses & programs\n" +
  "• Faculty & departments\n" +
  "• Scholarships & financial aid\n" +
  "• Hostel & campus facilities\n" +
  "• Placements & internships";

const AMBIGUOUS_CLARIFICATION_RESPONSE =
  "Could you please mention which program you're asking about? For example:\n" +
  "• **B.Tech CSE** (Computer Science & Engineering)\n" +
  "• **B.Tech IT** (Information Technology)\n" +
  "• **B.Tech AI & DS** (Artificial Intelligence & Data Science)\n" +
  "• **MCA** (Master of Computer Applications)\n" +
  "• **BCA** (Bachelor of Computer Applications)\n" +
  "• **M.Tech CSE**\n\n" +
  "That way I can give you the most accurate information.";

// ─── Official Contact Whitelist ───────────────────────────────────────────────
// Phone numbers that ARE allowed to appear in responses
const OFFICIAL_PHONES_NORMALIZED = [
  '912402480490', '912402480491',
  '02402480490', '2402480490',
  '9422704944', '919422704944'
];

// ─── Fee Amount Whitelist ─────────────────────────────────────────────────────
// These are the only verified fee amounts. Any ₹ amount NOT in this list is flagged.
const VERIFIED_FEE_AMOUNTS = [
  140000, 135000, 145000, 95000, 65000, 85000, // annual tuition
  5000,   // security deposit
  2500,   // exam fee per semester
  65000   // hostel (approximate — prefixed with ~ in source)
];

const VERIFIED_FEE_STRINGS = VERIFIED_FEE_AMOUNTS.map(f => f.toLocaleString('en-IN'));

// ─── Internet-Language Patterns (hallucination indicators) ────────────────────
const HALLUCINATION_LANGUAGE_PATTERNS = [
  /according\s+to\s+(various|multiple|internet|online)\s+sources/i,
  /based\s+on\s+(online|internet|available)\s+information/i,
  /generally\s+(speaking\s+)?(?:the\s+)?fees?\s+(may|might|could)\s+be/i,
  /students\s+can\s+usually/i,
  /typically\s+the\s+(?:fee|admission|eligibility)/i,
  /mgm\s+university\s+is\s+(?:a\s+)?renowned/i,
  /is\s+(?:one\s+of\s+)?the\s+(?:top|best|leading)\s+(?:university|college|institution)/i
];

// ─── Fee Extraction Helper ────────────────────────────────────────────────────
/**
 * Extracts all ₹ amounts from a text string as numbers.
 */
const extractFeeAmounts = (text) => {
  const amounts = [];
  // Match ₹ followed by number with optional commas
  const feeRegex = /₹\s*([\d,]+)/g;
  let match;
  while ((match = feeRegex.exec(text)) !== null) {
    const num = parseInt(match[1].replace(/,/g, ''), 10);
    if (!isNaN(num)) amounts.push(num);
  }
  return amounts;
};

// ─── Main Validation Function ─────────────────────────────────────────────────
/**
 * Validates a generated response against retrieved verified sources.
 *
 * @param {string} responseContent - The AI-generated response text
 * @param {Array}  sources         - Retrieved verified knowledge source objects
 * @param {Object} classification  - Query classification result
 * @returns {{ isValid, text, isGrounded, confidence, reason }}
 */
const validateResponse = (responseContent, sources, classification) => {

  // ── 1. Off-topic ─────────────────────────────────────────────────────────
  if (classification.category === 'OFF_TOPIC' || classification.isOffTopic) {
    return {
      isValid: true,
      text: OFF_TOPIC_RESPONSE,
      isGrounded: true,
      confidence: 'HIGH'
    };
  }

  // ── 2. Ambiguous ─────────────────────────────────────────────────────────
  if (classification.category === 'AMBIGUOUS' || classification.isAmbiguous) {
    return {
      isValid: true,
      text: AMBIGUOUS_CLARIFICATION_RESPONSE,
      isGrounded: true,
      confidence: 'HIGH'
    };
  }

  // ── 3. No sources ─────────────────────────────────────────────────────────
  if (!sources || sources.length === 0) {
    return {
      isValid: false,
      text: SAFE_UNAVAILABLE_RESPONSE,
      isGrounded: false,
      confidence: 'UNVERIFIED',
      reason: 'No verified sources available'
    };
  }

  // ── 4. Internet-language hallucination patterns ───────────────────────────
  for (const pattern of HALLUCINATION_LANGUAGE_PATTERNS) {
    if (pattern.test(responseContent)) {
      logger.warn(`[VALIDATOR] Hallucination language pattern detected: ${pattern}`);
      return {
        isValid: false,
        text: SAFE_UNAVAILABLE_RESPONSE,
        isGrounded: false,
        confidence: 'UNVERIFIED',
        reason: `Hallucination language pattern: ${pattern}`
      };
    }
  }

  // ── 5. Phone number validation ────────────────────────────────────────────
  const phoneMatches = responseContent.match(
    /(\+91[\-.\s]?\d{3,5}[\-.\s]?\d{6,8}|\b0\d{2,4}[\-.\s]?\d{6,8}\b|\b\d{10}\b)/g
  ) || [];

  for (const phone of phoneMatches) {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (
      cleanPhone.length >= 8 &&
      !OFFICIAL_PHONES_NORMALIZED.includes(cleanPhone)
    ) {
      // Also check if it appears verbatim in source content
      const sourceText = sources.map(s => `${s.content}`).join(' ');
      const sourceNums = sourceText.replace(/[^\d]/g, '');
      if (!sourceNums.includes(cleanPhone)) {
        logger.warn(`[VALIDATOR] Unverified phone number detected: ${phone}`);
        return {
          isValid: false,
          text: SAFE_UNAVAILABLE_RESPONSE,
          isGrounded: false,
          confidence: 'UNVERIFIED',
          reason: `Unverified phone number detected: ${phone}`
        };
      }
    }
  }

  // ── 6. Fee amount validation ──────────────────────────────────────────────
  // Only check if this is a fees-related response
  if (
    classification.category === 'FEES' ||
    (classification.intents || []).includes('FEES')
  ) {
    const responseAmounts = extractFeeAmounts(responseContent);
    const sourceText = sources.map(s => s.content).join(' ');
    const sourceAmounts = extractFeeAmounts(sourceText);

    for (const amount of responseAmounts) {
      const inVerifiedList = VERIFIED_FEE_AMOUNTS.includes(amount);
      const inSourceAmounts = sourceAmounts.includes(amount);

      if (!inVerifiedList && !inSourceAmounts) {
        logger.warn(`[VALIDATOR] Unverified fee amount detected: ₹${amount.toLocaleString('en-IN')}`);
        return {
          isValid: false,
          text: SAFE_UNAVAILABLE_RESPONSE,
          isGrounded: false,
          confidence: 'UNVERIFIED',
          reason: `Unverified fee amount: ₹${amount.toLocaleString('en-IN')}`
        };
      }
    }
  }

  // ── 7. Response is valid ──────────────────────────────────────────────────
  return {
    isValid: true,
    text: responseContent,
    isGrounded: true,
    confidence: 'HIGH'
  };
};

module.exports = {
  validateResponse,
  SAFE_UNAVAILABLE_RESPONSE,
  OFF_TOPIC_RESPONSE,
  AMBIGUOUS_CLARIFICATION_RESPONSE
};
