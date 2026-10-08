/**
 * MGMU IICT Grounded Fallback Response Generator
 *
 * This is used ONLY when no AI API key is configured or the AI call fails.
 * It generates a response directly from retrieved, verified knowledge sources.
 *
 * CRITICAL RULES:
 * - NEVER hardcode any fees, figures, names, or facts.
 * - ONLY use data from the `sources` array passed in.
 * - If a source doesn't contain what was asked, say so explicitly.
 */

const logger = require('../../utils/logger');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formats a list of sources into readable citation lines.
 */
const formatSourceCitations = (sources) => {
  if (!sources || sources.length === 0) return '';
  const lines = sources.map(s => `• ${s.title}${s.lastUpdated ? ` (${s.lastUpdated})` : ''}`);
  return `\n\n**Sources used:**\n${lines.join('\n')}`;
};

/**
 * Determines if a source is relevant to a specific intent.
 */
const isSourceRelevantToIntent = (source, intent) => {
  const category = (source.category || '').toUpperCase();
  const content = (source.content || '').toLowerCase();
  const title = (source.title || '').toLowerCase();

  const intentCategoryMap = {
    FEES:        ['FEES', 'COURSES'],
    ELIGIBILITY: ['COURSES', 'ADMISSION'],
    ADMISSION:   ['ADMISSION', 'DOCUMENTS', 'COURSES'],
    FACULTY:     ['FACULTY'],
    COURSES:     ['COURSES', 'GENERAL'],
    PLACEMENT:   ['PLACEMENT'],
    SCHOLARSHIP: ['SCHOLARSHIP'],
    HOSTEL:      ['HOSTEL', 'FACILITIES'],
    FACILITIES:  ['FACILITIES'],
    DOCUMENTS:   ['DOCUMENTS', 'ADMISSION'],
    EXAM:        ['EXAM'],
    CONTACT:     ['CONTACT'],
    GENERAL:     ['GENERAL', 'COURSES', 'CONTACT']
  };

  const targetCategories = intentCategoryMap[intent] || ['GENERAL'];
  if (targetCategories.includes(category)) return true;

  // Also check content keywords for intent
  const intentKeywords = {
    FEES:        ['fee', 'tuition', 'cost', '₹', 'annual fee'],
    ELIGIBILITY: ['eligibility', 'eligible', 'qualification', 'minimum', 'pcm', 'cet'],
    FACULTY:     ['faculty', 'hod', 'professor', 'teacher', 'director', 'dean'],
    PLACEMENT:   ['placement', 'company', 'salary', 'package', 'tpo'],
    SCHOLARSHIP: ['scholarship', 'ebc', 'mahadbt', 'concession'],
    HOSTEL:      ['hostel', 'accommodation', 'mess'],
    DOCUMENTS:   ['document', 'certificate', 'marksheet'],
    EXAM:        ['exam', 'examination', 'timetable', 'result']
  };

  const keywords = intentKeywords[intent] || [];
  return keywords.some(kw => content.includes(kw) || title.includes(kw));
};

// ─── Entity-Scoped Content Extraction ────────────────────────────────────────
/**
 * From a source's content, extracts the lines that are most relevant to a
 * specific entity (e.g., "B.Tech CSE") and an intent (e.g., FEES).
 * This prevents mixing B.Tech CSE data with MCA data.
 */
const extractEntityContent = (source, entity, intent) => {
  if (!entity) return source.content;

  const content = source.content || '';
  const lines = content.split('\n');
  const entityLower = entity.toLowerCase();

  // Simple heuristic: score each line by entity and intent relevance
  const intentKeywords = {
    FEES:        ['fee', 'tuition', '₹', 'per year', 'annual'],
    ELIGIBILITY: ['eligibility', 'eligible', 'qualification', 'minimum', 'pcm', 'cet', 'jee'],
    COURSES:     ['intake', 'duration', 'curriculum', 'syllabus', 'semester', 'credit'],
    FACULTY:     ['professor', 'hod', 'dr.', 'expert', 'experience'],
    PLACEMENT:   ['lpa', 'package', 'company', 'placement', 'tcs', 'infosys'],
    SCHOLARSHIP: ['scholarship', 'waiver', 'ebc', 'mahadbt', 'concession']
  };

  const relevantLines = lines.filter(line => {
    const lineLower = line.toLowerCase();
    const hasEntity = lineLower.includes(entityLower) ||
      (entityLower.includes('cse') && lineLower.includes('computer science')) ||
      (entityLower.includes('mca') && lineLower.includes('computer applications')) ||
      (entityLower.includes('bca') && lineLower.includes('computer applications')) ||
      (entityLower.includes('b.tech') && lineLower.includes('btech'));

    const intentKws = intentKeywords[intent] || [];
    const hasIntent = intentKws.some(kw => lineLower.includes(kw));

    return hasEntity || hasIntent;
  });

  // If we extracted entity-specific lines, use them; else fall back to full content
  return relevantLines.length > 2 ? relevantLines.join('\n') : content;
};

// ─── Main Grounded Response Generator ────────────────────────────────────────
/**
 * Generates a grounded response from verified sources WITHOUT an LLM.
 *
 * @param {string} query - The user's original question
 * @param {Array}  sources - Retrieved verified knowledge source objects
 * @param {Object} classification - Query classification (intents, entities, category)
 * @returns {string|null} - Formatted response string, or null if nothing useful found
 */
const generateGroundedResponse = (query, sources, classification) => {
  if (!sources || sources.length === 0) {
    logger.warn('[GROUNDED] No sources provided — cannot generate grounded response');
    return null;
  }

  const intents = classification.intents || [classification.category];
  const entities = classification.entities || [];
  const primaryIntent = classification.category || 'GENERAL';

  logger.info(`[GROUNDED] Generating for intents: [${intents.join(', ')}], entities: [${entities.join(', ')}]`);

  // Filter sources to those that are actually relevant
  const relevantSources = sources.filter(s =>
    intents.some(intent => isSourceRelevantToIntent(s, intent))
  );

  // Fall back to all sources if filtering was too aggressive
  const usedSources = relevantSources.length > 0 ? relevantSources : sources;

  if (usedSources.length === 0) {
    logger.warn('[GROUNDED] No relevant sources after filtering');
    return null;
  }

  // ── Build the response ────────────────────────────────────────────────────
  let outputText = '';

  // Group by intent if multiple intents
  if (intents.length > 1 && intents.filter(i => !['OFF_TOPIC', 'AMBIGUOUS', 'GENERAL'].includes(i)).length > 1) {
    const activeIntents = intents.filter(i => !['OFF_TOPIC', 'AMBIGUOUS', 'GENERAL', 'COURSES'].includes(i));

    for (const intent of activeIntents) {
      const intentSources = usedSources.filter(s => isSourceRelevantToIntent(s, intent));
      if (intentSources.length === 0) {
        outputText += `\n**${formatIntentLabel(intent)}:** I couldn't find verified information about this in the available MGMU IICT sources.\n`;
        continue;
      }

      outputText += `\n**${formatIntentLabel(intent)}:**\n`;
      for (const s of intentSources.slice(0, 2)) {
        const content = entities.length > 0
          ? extractEntityContent(s, entities[0], intent)
          : s.content;
        outputText += `${content}\n`;
      }
    }
  } else {
    // Single intent — output ONLY the targeted entity content, without appending extra sources
    const primarySource = usedSources[0];
    const targetEntity = entities.length > 0 ? entities[0] : null;
    outputText = extractEntityContent(primarySource, targetEntity, primaryIntent);
  }

  if (!outputText || outputText.trim().length === 0) {
    return null;
  }

  return outputText.trim();
};

// ─── Intent Label Formatter ───────────────────────────────────────────────────
const formatIntentLabel = (intent) => {
  const labels = {
    FEES:        'Fee Structure',
    ELIGIBILITY: 'Eligibility',
    ADMISSION:   'Admission Process',
    FACULTY:     'Faculty',
    COURSES:     'Program Details',
    PLACEMENT:   'Placements',
    SCHOLARSHIP: 'Scholarships',
    HOSTEL:      'Hostel & Accommodation',
    FACILITIES:  'Campus Facilities',
    DOCUMENTS:   'Required Documents',
    EXAM:        'Examination System',
    CONTACT:     'Contact Information',
    GENERAL:     'General Information'
  };
  return labels[intent] || intent;
};

module.exports = {
  generateGroundedResponse
};
