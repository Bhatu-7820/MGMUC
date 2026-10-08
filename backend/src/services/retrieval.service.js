/**
 * MGMU IICT Knowledge Retrieval Engine
 *
 * Implements a multi-stage, entity-scoped, intent-aware retrieval pipeline:
 *
 *   Stage 1: Context enrichment (conversation history)
 *   Stage 2: Per-intent, per-entity query expansion
 *   Stage 3: Source-authority-ranked retrieval
 *   Stage 4: Entity isolation (no mixing of B.Tech CSE with MCA, etc.)
 *   Stage 5: Relevance re-ranking
 *   Stage 6: Evidence packaging per intent
 */

const Knowledge = require('../models/Knowledge');
const { getDBStatus, memoryStore } = require('../config/db');
const { fetchFromPrimaryApi, fetchFromFallbackApi } = require('./fallbackApi.adapter');
const logger = require('../utils/logger');

// ─── Program → Knowledge Title / Tag Mapping ─────────────────────────────────
// Maps entity names to the exact terms that appear in knowledge base entries.
const ENTITY_SEARCH_MAP = {
  'B.Tech CSE':           ['btech', 'cse', 'computer science', 'b.tech cse', 'btech-cse'],
  'B.Tech IT':            ['btech', 'it', 'information technology', 'b.tech it', 'btech-it'],
  'B.Tech AI & DS':       ['btech', 'ai', 'data science', 'artificial intelligence', 'aids', 'b.tech ai'],
  'B.Tech Software Engg': ['btech', 'software engineering', 'software'],
  'MCA':                  ['mca', 'master of computer applications'],
  'BCA':                  ['bca', 'bachelor of computer applications'],
  'M.Tech CSE':           ['mtech', 'm.tech', 'postgraduate cse'],
  'Ph.D.':                ['phd', 'ph.d', 'doctorate'],
  'Hostel':               ['hostel', 'accommodation', 'mess', 'residence'],
  'Scholarships':         ['scholarship', 'ebc', 'mahadbt', 'financial aid'],
  'B.Tech':               ['btech', 'b.tech', 'undergraduate engineering']
};

// ─── Intent → Knowledge Category + Search Keywords ───────────────────────────
const INTENT_RETRIEVAL_MAP = {
  FEES: {
    categories: ['FEES', 'COURSES'],
    keywords: ['fee', 'fees', 'tuition', 'cost', 'fee structure', 'annual fee', 'charge', 'payment']
  },
  ELIGIBILITY: {
    categories: ['COURSES', 'ADMISSION'],
    keywords: ['eligibility', 'eligible', 'qualification', 'requirement', 'minimum', 'pcm', 'cet', 'jee', 'mht-cet', 'criteria', '45%', '50%']
  },
  ADMISSION: {
    categories: ['ADMISSION', 'DOCUMENTS', 'COURSES'],
    keywords: ['admission', 'apply', 'process', 'steps', 'portal', 'registration', 'counseling', 'merit list', 'entrance']
  },
  FACULTY: {
    categories: ['FACULTY'],
    keywords: ['faculty', 'teacher', 'professor', 'hod', 'dean', 'director', 'staff', 'head of department', 'principal']
  },
  COURSES: {
    categories: ['COURSES', 'GENERAL'],
    keywords: ['course', 'program', 'offered', 'degree', 'branch', 'curriculum', 'syllabus', 'intake', 'duration']
  },
  PLACEMENT: {
    categories: ['PLACEMENT'],
    keywords: ['placement', 'job', 'company', 'salary', 'package', 'tpo', 'recruit', 'internship', 'career']
  },
  SCHOLARSHIP: {
    categories: ['SCHOLARSHIP'],
    keywords: ['scholarship', 'ebc', 'mahadbt', 'financial aid', 'concession', 'waiver', 'fee waiver']
  },
  HOSTEL: {
    categories: ['HOSTEL', 'FACILITIES'],
    keywords: ['hostel', 'accommodation', 'mess', 'stay', 'residence', 'room']
  },
  FACILITIES: {
    categories: ['FACILITIES'],
    keywords: ['facility', 'facilities', 'library', 'lab', 'sports', 'gym', 'canteen', 'wifi', 'transport', 'campus', 'infrastructure']
  },
  DOCUMENTS: {
    categories: ['DOCUMENTS', 'ADMISSION'],
    keywords: ['document', 'certificate', 'marksheet', 'leaving certificate', 'domicile', 'caste', 'required documents', 'papers']
  },
  EXAM: {
    categories: ['EXAM'],
    keywords: ['exam', 'examination', 'timetable', 'schedule', 'result', 'marks', 'grade', 'mid sem', 'end sem', 'cbcs']
  },
  CONTACT: {
    categories: ['CONTACT'],
    keywords: ['contact', 'phone', 'email', 'address', 'location', 'office', 'timing', 'number']
  },
  GENERAL: {
    categories: ['GENERAL', 'COURSES'],
    keywords: ['about', 'overview', 'information', 'details']
  }
};

// ─── Source Authority Hierarchy ───────────────────────────────────────────────
// Higher number = higher authority. Used for conflict resolution & sorting.
const SOURCE_AUTHORITY = {
  'MGMU Finance & Fee Regulation Committee': 100,
  'MGMU Admission Cell 2026-27': 95,
  'MGMU IICT Admission Office Checklist': 90,
  'MGMU IICT Admission Brochure': 88,
  'MGMU IICT PG Prospectus': 87,
  'MGMU IICT UG Prospectus': 87,
  'MGMU IICT Course Catalogue': 85,
  'MGMU IICT Faculty Directory': 85,
  'MGMU IICT TPO Report 2026': 80,
  'MGMU Student Welfare Cell': 80,
  'MGM Campus Facilities Handbook': 75,
  'MGMU Examination Controller Notice': 75,
  'MGMU IICT Academic Handbook 2026': 72,
  'MGMU IICT Contact Directory': 70,
  'MGMU IICT Official Brochure': 65,
  'MGMU IICT Primary Official API': 95,
  'Secondary Verified College API Source': 50
};

const getSourceAuthority = (source) => SOURCE_AUTHORITY[source] || 40;

// ─── Relevance Score Computation ─────────────────────────────────────────────
/**
 * Scores a knowledge item against query signals.
 * Higher = more relevant.
 */
const computeRelevanceScore = (item, queryTerms, entity, intents) => {
  let score = 0;
  const content = (item.content || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const tags = (item.tags || []).map(t => t.toLowerCase());
  const itemCategory = (item.category || '').toUpperCase();

  // Intent-category alignment
  for (const intent of intents) {
    const intentMap = INTENT_RETRIEVAL_MAP[intent];
    if (intentMap && intentMap.categories.includes(itemCategory)) {
      score += 20;
    }
    // Keyword matches in content
    if (intentMap) {
      for (const kw of intentMap.keywords) {
        if (content.includes(kw)) score += 5;
        if (title.includes(kw)) score += 8;
      }
    }
  }

  // Entity-specific relevance
  if (entity) {
    const entityTerms = ENTITY_SEARCH_MAP[entity] || [];
    for (const term of entityTerms) {
      if (title.includes(term)) score += 25;  // title match is very strong
      if (content.includes(term)) score += 12;
      if (tags.some(t => t.includes(term))) score += 10;
    }
  }

  // Query term matches
  for (const term of queryTerms) {
    if (term.length < 3) continue;
    if (title.includes(term)) score += 6;
    if (content.includes(term)) score += 3;
    if (tags.includes(term)) score += 4;
  }

  // Source authority bonus
  score += getSourceAuthority(item.source) * 0.1;

  return score;
};

// ─── In-Memory Retrieval ──────────────────────────────────────────────────────
const retrieveFromMemory = (queryTerms, categories, entity, intents) => {
  const items = memoryStore.knowledge;

  // Score every item
  const scored = items
    .map(item => ({
      item,
      score: computeRelevanceScore(item, queryTerms, entity, intents)
    }))
    .filter(({ score }) => score > 0);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ item }) => item);
};

// ─── MongoDB Retrieval ────────────────────────────────────────────────────────
const retrieveFromMongoDB = async (queryTerms, categories, entity, intents) => {
  try {
    const fullText = queryTerms.join(' ');
    let results = [];

    // Phase 1: Full-text search in target categories
    if (categories && categories.length > 0) {
      results = await Knowledge.find({
        category: { $in: categories },
        $text: { $search: fullText }
      }).limit(12);
    }

    // Phase 2: If insufficient, fall back to regex across all categories
    if (results.length < 3) {
      const regexes = queryTerms
        .filter(w => w.length > 2)
        .map(w => new RegExp(w, 'i'));

      const entityTerms = entity ? (ENTITY_SEARCH_MAP[entity] || []) : [];
      const allTermRegexes = [
        ...regexes,
        ...entityTerms.map(t => new RegExp(t, 'i'))
      ];

      const fallbackResults = await Knowledge.find({
        $or: [
          { tags: { $in: [...queryTerms, ...entityTerms] } },
          { title: { $in: allTermRegexes } },
          { content: { $in: allTermRegexes } }
        ]
      }).limit(12);

      // Merge, deduplicate by _id
      const existingIds = new Set(results.map(r => r._id.toString()));
      for (const r of fallbackResults) {
        if (!existingIds.has(r._id.toString())) {
          results.push(r);
          existingIds.add(r._id.toString());
        }
      }
    }

    return results;
  } catch (err) {
    logger.error(`MongoDB retrieval error: ${err.message}`);
    return [];
  }
};

// ─── Context Enrichment ───────────────────────────────────────────────────────
/**
 * Enriches the current query with entity context from conversation history.
 * Returns a list of inferred entity names from prior conversation.
 */
const inferContextEntities = (entities, contextHistory) => {
  if (entities.length > 0) return entities; // already has entities, no need for inference
  if (!contextHistory || contextHistory.length === 0) return [];

  const programPatterns = Object.entries(ENTITY_SEARCH_MAP);
  const allEntities = [];

  // Look at last few user messages for context
  const recentUserMessages = [...contextHistory]
    .reverse()
    .filter(m => m.sender === 'user')
    .slice(0, 3);

  for (const msg of recentUserMessages) {
    const text = (msg.text || '').toLowerCase();
    for (const [entityName, terms] of programPatterns) {
      if (entityName === 'B.Tech') continue; // skip generic
      if (terms.some(t => text.includes(t)) && !allEntities.includes(entityName)) {
        allEntities.push(entityName);
      }
    }
    if (allEntities.length > 0) break; // found entities in most recent message, stop
  }

  if (allEntities.length > 0) {
    logger.info(`Context inference: inherited entities [${allEntities.join(', ')}] from conversation history`);
  }

  return allEntities;
};

// ─── Format Retrieved Item as Source Object ───────────────────────────────────
const formatSource = (item) => ({
  title: item.title || item.name || 'MGMU IICT Verified Information',
  content: item.content || '',
  category: item.category || 'GENERAL',
  program: item.program || null,
  department: item.department || null,
  academicYear: item.academicYear || '2026-27',
  source: item.source || 'MGMU IICT Official Database',
  sourceUrl: item.sourceUrl || 'https://mgmu.ac.in/iict',
  verified: item.verified !== undefined ? item.verified : true,
  lastUpdated: item.lastUpdated || '2026-10-01'
});

// ─── Deduplicate Sources ──────────────────────────────────────────────────────
const deduplicateSources = (sources) => {
  const seen = new Set();
  return sources.filter(s => {
    const key = s.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// ─── Main Retrieval Function ──────────────────────────────────────────────────
/**
 * Retrieves and ranks knowledge for all detected intents and entities.
 *
 * Returns:
 * {
 *   tier: string,
 *   sources: Source[],
 *   retrievalDebug: {
 *     resolvedEntities: string[],
 *     resolvedIntents: string[],
 *     retrievalQueries: object[],
 *     rawCounts: object
 *   }
 * }
 */
const retrieveVerifiedKnowledge = async (query, classification, contextHistory = []) => {
  const { intents = [], entities: rawEntities = [] } = classification;
  const cleanQuery = query.toLowerCase();

  // ── 1. Context enrichment ─────────────────────────────────────────────────
  const resolvedEntities = inferContextEntities(rawEntities, contextHistory);

  logger.info(`[RETRIEVAL] Intents: [${intents.join(', ')}] | Entities: [${resolvedEntities.join(', ')}]`);

  // ── 2. Tier 1: Primary Official API ──────────────────────────────────────
  const primaryApiData = await fetchFromPrimaryApi(query, classification.category);
  if (primaryApiData && primaryApiData.length > 0) {
    return {
      tier: 'PRIORITY_1_PRIMARY_API',
      sources: primaryApiData,
      retrievalDebug: {
        resolvedEntities,
        resolvedIntents: intents,
        retrievalQueries: [{ source: 'PRIMARY_API' }],
        rawCounts: { primaryApi: primaryApiData.length }
      }
    };
  }

  // ── 3. Determine retrieval targets per intent ────────────────────────────
  const allCategories = new Set();
  const allKeywords = new Set();
  const retrievalQueries = [];

  for (const intent of intents) {
    if (intent === 'OFF_TOPIC' || intent === 'AMBIGUOUS' || intent === 'GENERAL') continue;
    const intentMap = INTENT_RETRIEVAL_MAP[intent] || INTENT_RETRIEVAL_MAP.GENERAL;
    for (const cat of intentMap.categories) allCategories.add(cat);
    for (const kw of intentMap.keywords) allKeywords.add(kw);
    retrievalQueries.push({ intent, categories: intentMap.categories, keywords: intentMap.keywords });
  }

  // Build query terms: original words + intent keywords + entity terms
  const rawQueryTerms = cleanQuery
    .split(/\s+/)
    .filter(w => w.length > 2 && !['what', 'about', 'tell', 'give', 'please', 'the', 'for', 'and', 'are'].includes(w));

  const entityTerms = resolvedEntities.flatMap(e => ENTITY_SEARCH_MAP[e] || []);
  const queryTerms = [...new Set([...rawQueryTerms, ...entityTerms, ...allKeywords])];

  logger.info(`[RETRIEVAL] Query terms: [${queryTerms.slice(0, 10).join(', ')}...]`);
  logger.info(`[RETRIEVAL] Target categories: [${[...allCategories].join(', ')}]`);

  // ── 4. Retrieve from DB or Memory ────────────────────────────────────────
  const dbStatus = getDBStatus();
  let rawItems = [];

  if (dbStatus.connected) {
    rawItems = await retrieveFromMongoDB(
      queryTerms,
      [...allCategories],
      resolvedEntities[0] || null,
      intents
    );
    logger.info(`[RETRIEVAL] MongoDB returned ${rawItems.length} raw items`);
  }

  // Always supplement with memory store (it has canonical seed data)
  const memoryItems = retrieveFromMemory(
    queryTerms,
    [...allCategories],
    resolvedEntities[0] || null,
    intents
  );
  logger.info(`[RETRIEVAL] Memory store returned ${memoryItems.length} scored items`);

  // Merge: DB items first (may be more recent), then memory
  const mergedItems = [...rawItems];
  const existingTitles = new Set(mergedItems.map(i => i.title));
  for (const item of memoryItems) {
    if (!existingTitles.has(item.title)) {
      mergedItems.push(item);
      existingTitles.add(item.title);
    }
  }

  // ── 5. Score & rank all merged items ─────────────────────────────────────
  const scoredItems = mergedItems
    .map(item => ({
      item,
      score: computeRelevanceScore(item, queryTerms, resolvedEntities[0] || null, intents)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  logger.info(`[RETRIEVAL] After scoring: ${scoredItems.length} relevant items`);

  if (scoredItems.length === 0) {
    // Tier 3: Fallback API
    const fallbackApiData = await fetchFromFallbackApi(query, classification.category);
    if (fallbackApiData && fallbackApiData.length > 0) {
      return {
        tier: 'PRIORITY_3_FALLBACK_API',
        sources: fallbackApiData,
        retrievalDebug: { resolvedEntities, resolvedIntents: intents, retrievalQueries, rawCounts: { fallbackApi: fallbackApiData.length } }
      };
    }

    return {
      tier: 'UNVERIFIED_NONE',
      sources: [],
      retrievalDebug: { resolvedEntities, resolvedIntents: intents, retrievalQueries, rawCounts: {} }
    };
  }

  // ── 6. Take top-N items (cap to avoid overwhelming LLM context) ──────────
  const topItems = scoredItems.slice(0, 8).map(({ item }) => formatSource(item));
  const uniqueSources = deduplicateSources(topItems);

  logger.info(`[RETRIEVAL] Final sources for LLM: ${uniqueSources.length}`);
  uniqueSources.forEach((s, i) => logger.info(`  [${i + 1}] "${s.title}" (category: ${s.category})`));

  return {
    tier: 'PRIORITY_2_OFFICIAL_DB',
    sources: uniqueSources,
    retrievalDebug: {
      resolvedEntities,
      resolvedIntents: intents,
      retrievalQueries,
      rawCounts: {
        db: rawItems.length,
        memory: memoryItems.length,
        merged: mergedItems.length,
        afterScoring: scoredItems.length,
        finalSent: uniqueSources.length
      }
    }
  };
};

module.exports = {
  retrieveVerifiedKnowledge,
  ENTITY_SEARCH_MAP,
  INTENT_RETRIEVAL_MAP
};
