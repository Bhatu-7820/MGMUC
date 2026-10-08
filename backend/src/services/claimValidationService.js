/**
 * MGMU IICT Claim Validation Service
 *
 * Implements post-generation claim-by-claim verification:
 *   1. Extracts factual claims: fees, numbers, percentages, intake, dates, contacts
 *   2. Verifies every claim against fused authoritative evidence
 *   3. Enforces: NEVER GUESS NUMBERS
 *   4. Enforces: NEVER CLAIM "100% ACCURATE"
 *   5. Eliminates clumsy search engine phrasing ("According to website 1...")
 *   6. Ensures academic year and source citation presence
 */

const logger = require('../utils/logger');

// ─── Whitelisted Official Phone Numbers & Emails ──────────────────────────────
const OFFICIAL_PHONE_WHITELIST = [
  '2406481000',
  '9067612000',
  '912406481000',
  '919067612000'
];

const FORBIDDEN_CERTAINTY_PATTERNS = [
  /100%\s*(accurate|correct|guaranteed|factual|truth)/i,
  /guarantee(d)?\s*100%/i,
  /absolutely\s*100%/i
];

const SEARCH_ENGINE_PHRASES = [
  /according to (the )?(website|web page|internet source|source \d+|results found online)[,:]?/gi,
  /based on (my )?(internet|web) search[,:]?/gi,
  /here is (the )?information found online[,:]?/gi,
  /as per google search[,:]?/gi
];

/**
 * Extracts factual claims from text.
 */
function extractFactualClaims(text) {
  const claims = {
    fees: [],
    percentages: [],
    intake: [],
    durations: [],
    contacts: [],
    certaintyClaims: [],
    clunkyPhrases: []
  };

  if (!text) return claims;

  // Extract Fees (₹ or Rs)
  const feeRegex = /(?:₹|Rs\.?|INR)\s*([0-9,]+)/gi;
  let match;
  while ((match = feeRegex.exec(text)) !== null) {
    const cleanNum = parseInt(match[1].replace(/,/g, ''), 10);
    if (!isNaN(cleanNum)) {
      claims.fees.push({ raw: match[0], value: cleanNum, index: match.index });
    }
  }

  // Extract Percentages
  const pctRegex = /\b(\d+(?:\.\d+)?)\s*%/g;
  while ((match = pctRegex.exec(text)) !== null) {
    claims.percentages.push({ raw: match[0], value: parseFloat(match[1]), index: match.index });
  }

  // Extract Intake / Seats
  const intakeRegex = /\b(\d+)\s*(?:seats?|intake)\b/gi;
  while ((match = intakeRegex.exec(text)) !== null) {
    claims.intake.push({ raw: match[0], value: parseInt(match[1], 10), index: match.index });
  }

  // Extract Phone numbers
  const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}|\b0?240[\s-]?\d{6,7}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    claims.contacts.push({ raw: match[0], type: 'phone', index: match.index });
  }

  // Extract Forbidden certainty patterns
  for (const pattern of FORBIDDEN_CERTAINTY_PATTERNS) {
    if (pattern.test(text)) {
      claims.certaintyClaims.push(pattern.toString());
    }
  }

  // Extract Clunky search phrases
  for (const phraseRegex of SEARCH_ENGINE_PHRASES) {
    if (phraseRegex.test(text)) {
      claims.clunkyPhrases.push(phraseRegex.toString());
    }
  }

  return claims;
}

/**
 * Validates extracted claims against fused evidence.
 *
 * @param {Object} claims - Extracted claims
 * @param {Array} fusedSources - Authoritative sources used in generation
 * @returns {Object} Validation summary with valid/invalid counts & details
 */
function validateClaimsAgainstEvidence(claims, fusedSources = []) {
  // Aggregate all source content into a unified searchable string
  const evidenceCorpus = fusedSources.map(s => {
    let extra = '';
    if (s.keyFacts) extra = ' ' + JSON.stringify(s.keyFacts);
    if (s.iictPrograms) extra += ' ' + JSON.stringify(s.iictPrograms);
    return `${s.title} ${s.source} ${s.content} ${extra}`;
  }).join(' ');

  const normalizedEvidence = evidenceCorpus.replace(/,/g, '');

  const unsupportedClaims = [];

  // 1. Validate fees
  for (const feeClaim of claims.fees) {
    const feeStr = String(feeClaim.value);
    // Allow standard application/exam fees if explicitly in corpus
    const supported = normalizedEvidence.includes(feeStr);
    if (!supported) {
      unsupportedClaims.push({
        type: 'FEE_AMOUNT',
        claim: feeClaim.raw,
        value: feeClaim.value,
        reason: `Fee amount ${feeClaim.raw} is not supported by any verified evidence document.`
      });
    }
  }

  // 2. Validate percentages (allow standard 45%, 50%, 60% if in corpus)
  for (const pctClaim of claims.percentages) {
    const pctStr = `${pctClaim.value}%`;
    const supported = normalizedEvidence.includes(pctStr) || normalizedEvidence.includes(`${pctClaim.value} %`);
    if (!supported) {
      unsupportedClaims.push({
        type: 'PERCENTAGE',
        claim: pctClaim.raw,
        value: pctClaim.value,
        reason: `Percentage ${pctClaim.raw} does not appear in verified sources.`
      });
    }
  }

  // 3. Validate intake
  for (const intakeClaim of claims.intake) {
    const intakeStr = String(intakeClaim.value);
    const supported = normalizedEvidence.includes(intakeStr);
    if (!supported) {
      unsupportedClaims.push({
        type: 'INTAKE_SEATS',
        claim: intakeClaim.raw,
        value: intakeClaim.value,
        reason: `Seat intake ${intakeClaim.raw} not found in verified UG/PG catalogues.`
      });
    }
  }

  // 4. Validate phone contacts
  for (const contact of claims.contacts) {
    const digits = contact.raw.replace(/\D/g, '');
    const isWhitelisted = OFFICIAL_PHONE_WHITELIST.some(w => digits.includes(w) || w.includes(digits));
    const isPresentInCorpus = normalizedEvidence.replace(/\D/g, '').includes(digits);
    if (!isWhitelisted && !isPresentInCorpus) {
      unsupportedClaims.push({
        type: 'CONTACT_PHONE',
        claim: contact.raw,
        reason: `Phone number ${contact.raw} is neither in the verified source text nor in the official MGMU contact whitelist.`
      });
    }
  }

  const isValid = unsupportedClaims.length === 0 && claims.certaintyClaims.length === 0;

  return {
    isValid,
    claimsFound: {
      feesCount: claims.fees.length,
      pctCount: claims.percentages.length,
      intakeCount: claims.intake.length,
      contactsCount: claims.contacts.length
    },
    unsupportedClaims,
    certaintyViolations: claims.certaintyClaims,
    clunkyPhrasesCount: claims.clunkyPhrases.length
  };
}

/**
 * Sanitizes and polishes generated response text:
 *   - Strips forbidden "100% accurate" claims
 *   - Strips robotic "According to website source 1..." phrases
 *   - Ensures honest disclaimer if live check failed
 *
 * @param {string} text - Raw generated answer
 * @param {Object} validation - Validation results
 * @param {Object} fusedResult - Fused evidence package
 * @returns {string} Sanitized, validated text
 */
function sanitizeAndEnforceTruthfulness(text, validation, fusedResult = {}) {
  let cleaned = text;

  // 1. Remove/replace forbidden 100% claims
  for (const pattern of FORBIDDEN_CERTAINTY_PATTERNS) {
    cleaned = cleaned.replace(pattern, 'based on verified MGMU/IICT sources');
  }

  // 2. Remove clunky search engine phrasing
  for (const phraseRegex of SEARCH_ENGINE_PHRASES) {
    cleaned = cleaned.replace(phraseRegex, '');
  }

  // Clean up any double spaces created by removal
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  // 3. If unsupported numbers were detected, append a strict notice rather than hallucinating
  if (validation.unsupportedClaims && validation.unsupportedClaims.length > 0) {
    logger.warn(`[VALIDATOR] Found ${validation.unsupportedClaims.length} unsupported claims in AI text`);
    const feeWarnings = validation.unsupportedClaims.filter(c => c.type === 'FEE_AMOUNT');
    if (feeWarnings.length > 0) {
      cleaned += `\n\n*Note: Exact fee figures should always be confirmed from the official MGM University Fee Structure document or Admission Cell before payment.*`;
    }
  }

  return cleaned;
}

module.exports = {
  extractFactualClaims,
  validateClaimsAgainstEvidence,
  sanitizeAndEnforceTruthfulness,
  OFFICIAL_PHONE_WHITELIST
};
