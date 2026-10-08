/**
 * MGMU IICT Query Classification & Multi-Intent Entity Extraction Engine
 *
 * Produces a structured decomposition of the user's query into:
 *   - primary category (dominant intent)
 *   - ALL intents present (multi-intent support)
 *   - ALL entities mentioned (programs, departments, etc.)
 *   - whether the query is ambiguous or off-topic
 */

// ─── Intent Patterns ──────────────────────────────────────────────────────────
const INTENT_PATTERNS = {
  FEES: [
    /\bfee\b/i, /\bfees\b/i, /\btuition\b/i, /\bcost\b/i, /\bcharge\b/i,
    /\bpayment\b/i, /\binstallment\b/i, /how\s+much.*cost/i, /\bprice\b/i,
    /fee\s+structure/i, /annual\s+fee/i, /semester\s+fee/i
  ],
  ADMISSION: [
    /\badmission\b/i, /\bapply\b/i, /\bentrance\b/i, /\bcut\s*off\b/i,
    /how\s+to\s+join/i, /\bcounseling\b/i, /\bmerits?\s*list\b/i,
    /\bregistration\b/i, /admission\s+process/i, /how\s+to\s+apply/i,
    /how\s+can\s+i\s+(get|join|enroll)/i
  ],
  ELIGIBILITY: [
    /\beligibility\b/i, /\beligible\b/i, /\bqualification\b/i,
    /\brequirement[s]?\b/i, /who\s+can\s+apply/i, /minimum\s+marks/i,
    /minimum\s+percentage/i, /\bpcm\b/i, /\bcet\b/i, /\bjee\b/i,
    /\bmht-?cet\b/i, /what\s+(are|is)\s+the\s+criteria/i,
    /criteria\s+for\s+admission/i
  ],
  FACULTY: [
    /\bfaculty\b/i, /\bteacher[s]?\b/i, /\bprofessor[s]?\b/i, /\bhod\b/i,
    /\bdean\b/i, /\bprincipal\b/i, /\bdirector\b/i, /\bstaff\b/i,
    /who\s+teaches/i, /\bdr\.\b/i, /\bprof\.\b/i,
    /head\s+of\s+department/i, /teaching\s+staff/i
  ],
  COURSES: [
    /\bcourse[s]?\b/i, /\bprogram[s]?\b/i, /\bbranch[es]?\b/i,
    /\bspecialization[s]?\b/i, /\bdegree[s]?\b/i, /\bstream[s]?\b/i,
    /\bsyllabus\b/i, /\bcurriculum\b/i, /what\s+(courses?|programs?)\s+(are\s+)?(available|offered)/i,
    /which\s+(branches?|programs?|courses?)/i, /list\s+of\s+(courses?|programs?)/i,
    /tell\s+me\s+about\b/i
  ],
  DEPARTMENT: [
    /\bdepartment\b/i, /\bcse\s+dept\b/i, /\bit\s+dept\b/i
  ],
  PLACEMENT: [
    /\bplacement[s]?\b/i, /\bjob[s]?\b/i, /\brecruit\b/i, /\bcompany\b/i,
    /\bpackage\b/i, /\bsalary\b/i, /\bhighest\s+package\b/i,
    /\baverage\s+(salary|package)\b/i, /\btpo\b/i, /\bcareer\b/i,
    /\binternship[s]?\b/i, /placed\s+(students?|graduates?)/i
  ],
  SCHOLARSHIP: [
    /\bscholarship[s]?\b/i, /\bebc\b/i, /\bmahadbt\b/i, /financial\s+aid/i,
    /\bconcession\b/i, /\bwaiver\b/i, /\bfee\s+waiver\b/i,
    /government\s+scholarship/i
  ],
  HOSTEL: [
    /\bhostel\b/i, /\baccommodation\b/i, /\broom\b/i, /\bstay\b/i,
    /\bmess\b/i, /\bresidence\b/i, /\bdormitory\b/i
  ],
  FACILITIES: [
    /\bfacilit(y|ies)\b/i, /\blibrary\b/i, /\blab[s]?\b/i,
    /\bsports?\b/i, /\bgym\b/i, /\bcanteen\b/i, /\bwifi\b/i,
    /\binternet\b/i, /\btransport\b/i, /\bbus\b/i, /\bcampus\b/i,
    /\binfrastructure\b/i, /\bcomputer\s+lab\b/i
  ],
  DOCUMENTS: [
    /\bdocument[s]?\b/i, /\bcertificate[s]?\b/i, /\bmarksheet[s]?\b/i,
    /\bleaving\s+certificate\b/i, /\bdomicile\b/i, /\bcaste\b/i,
    /\bpapers?\s+required\b/i, /documents?\s+needed/i, /what\s+to\s+bring/i
  ],
  EXAM: [
    /\bexam[s]?\b/i, /\bexamination[s]?\b/i, /\btimetable\b/i,
    /\bschedule\b/i, /\bresult[s]?\b/i, /\bmarks?\b/i, /\bgrade[s]?\b/i,
    /\bcredit[s]?\b/i, /\bmid\s*sem\b/i, /\bend\s*sem\b/i
  ],
  CONTACT: [
    /\bcontact\b/i, /\bphone\b/i, /\bemail\b/i, /\baddress\b/i,
    /\blocation\b/i, /\bwhere\s+(is|can)\b/i, /\breach\b/i,
    /\boffice\b/i, /\btiming[s]?\b/i, /\bnumber\b/i
  ],
  GREETING: [
    /^(hi|hello|hey|heyy|heya|howdy|greetings|namaste)\b/i,
    /^(good\s+(morning|afternoon|evening|day))\b/i,
    /^(hi|hello|hey)\s+(there|assistant|bot|mgmu)?\b/i
  ],
  THANKS: [
    /^(thanks|thank\s+you|thx|tq|many\s+thanks|thank\s+you\s+so\s+much)\b/i
  ],
  BOT_IDENTITY: [
    /^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|introduce\s+yourself|tell\s+me\s+about\s+yourself)\b/i
  ]
};

// Priority weights — higher = more specific, preferred
const INTENT_PRIORITY = {
  GREETING: 15,
  THANKS: 15,
  BOT_IDENTITY: 15,
  FEES: 10,
  ELIGIBILITY: 10,
  ADMISSION: 9,
  FACULTY: 9,
  SCHOLARSHIP: 8,
  PLACEMENT: 8,
  HOSTEL: 8,
  DOCUMENTS: 7,
  EXAM: 7,
  FACILITIES: 6,
  COURSES: 5,
  DEPARTMENT: 4,
  CONTACT: 4
};

// ─── Program Entity Patterns ──────────────────────────────────────────────────
const PROGRAM_ENTITIES = [
  { name: 'B.Tech CSE',            pattern: /b\.?tech\s*cse|b\.?tech\s*computer\s*science|btech\s*cs/i },
  { name: 'B.Tech IT',             pattern: /b\.?tech\s*it\b|b\.?tech\s*information\s*technology/i },
  { name: 'B.Tech AI & DS',        pattern: /b\.?tech\s*ai|b\.?tech\s*artificial\s*intelligence|b\.?tech\s*data\s*science|ai\s*&?\s*ds/i },
  { name: 'B.Tech Software Engg',  pattern: /b\.?tech\s*software|software\s*engineering/i },
  { name: 'MCA',                   pattern: /\bmca\b|master\s+of\s+computer\s+applications/i },
  { name: 'BCA',                   pattern: /\bbca\b|bachelor\s+of\s+computer\s+applications/i },
  { name: 'M.Tech CSE',            pattern: /m\.?tech\s*cse?|m\.?tech\s*computer\s*science/i },
  { name: 'Ph.D.',                 pattern: /\bph\.?d\.?\b|doctor\s+of\s+philosophy/i },
  // Generic program groupings
  { name: 'B.Tech',                pattern: /\bb\.?tech\b(?!\s*(cse|it|ai|software|computer|information|artificial))/i },
  { name: 'Hostel',                pattern: /\bhostel\b|\baccommodation\b|\bmess\b/ },
  { name: 'Scholarships',          pattern: /\bscholarship[s]?\b|\bebc\b|\bmahadbt\b/ }
];

// ─── Off-topic Patterns ──────────────────────────────────────────────────────
const OFF_TOPIC_PATTERNS = [
  /\bcricket\b/i, /\bmovie[s]?\b/i, /\bweather\b/i, /\brecipe[s]?\b/i,
  /\bpolitics\b/i, /\bpresident\s+of\b/i, /\bbitcoin\b/i, /\bcrypto\b/i,
  /\bjoke[s]?\b/i, /\bflight\s+ticket\b/i, /\bsong[s]?\b/i,
  /\bactor[s]?\b/i, /\bactress\b/i, /\bvideo\s+game\b/i, /\bcurrency\b/i,
  /\beurope?\b/i, /\busd\b/i, /\bexchange\s+rate\b/i, /\bstock\s+market\b/i,
  /\bshare\s+market\b/i
];

// ─── Ambiguous Patterns (no program mentioned) ────────────────────────────────
const TRULY_AMBIGUOUS = [
  { pattern: /^(what\s+is\s+the\s+)?fee\??$/i,         hint: 'fee' },
  { pattern: /^eligibility\??$/i,                       hint: 'eligibility' },
  { pattern: /^cutoff\??$/i,                            hint: 'cutoff' },
  { pattern: /^admission\??$/i,                         hint: 'admission' },
  { pattern: /^syllabus\??$/i,                          hint: 'syllabus' },
  { pattern: /^(what\s+)?courses\??$/i,                 hint: 'courses' }
];

// ─── Main Classification Function ────────────────────────────────────────────
/**
 * Classifies a query into structured intents and entities.
 *
 * @returns {Object} {
 *   category: string,           // dominant intent
 *   intents: string[],          // ALL detected intents
 *   entities: string[],         // detected program entities
 *   isAmbiguous: boolean,
 *   isOffTopic: boolean,
 *   ambiguityHint: string|null, // what the user seems to be asking about
 *   confidence: number
 * }
 */
const classifyQuery = (query = '') => {
  const cleanQuery = query.trim();

  // Off-topic check
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(cleanQuery)) {
      return {
        category: 'OFF_TOPIC',
        intents: ['OFF_TOPIC'],
        entities: [],
        isAmbiguous: false,
        isOffTopic: true,
        ambiguityHint: null,
        confidence: 1.0
      };
    }
  }

  // Check truly ambiguous (no program + no specific intent)
  const hasAnyProgram = PROGRAM_ENTITIES.some(ep => ep.pattern.test(cleanQuery));
  if (!hasAnyProgram) {
    for (const { pattern, hint } of TRULY_AMBIGUOUS) {
      if (pattern.test(cleanQuery)) {
        return {
          category: 'AMBIGUOUS',
          intents: ['AMBIGUOUS'],
          entities: [],
          isAmbiguous: true,
          isOffTopic: false,
          ambiguityHint: hint,
          confidence: 0.9
        };
      }
    }
  }

  // ── Extract ALL entities ──────────────────────────────────────────────────
  const entities = [];
  for (const ep of PROGRAM_ENTITIES) {
    if (ep.pattern.test(cleanQuery)) {
      // Avoid adding generic "B.Tech" if a specific variant already matched
      if (ep.name === 'B.Tech') {
        const specificBtech = ['B.Tech CSE', 'B.Tech IT', 'B.Tech AI & DS', 'B.Tech Software Engg'];
        const alreadyHasSpecific = specificBtech.some(s => entities.includes(s));
        if (alreadyHasSpecific) continue;
      }
      entities.push(ep.name);
    }
  }

  // ── Detect ALL intents ────────────────────────────────────────────────────
  const detectedIntents = [];
  const intentScores = {};

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(cleanQuery)) {
        score += (INTENT_PRIORITY[intent] || 1);
      }
    }
    if (score > 0) {
      detectedIntents.push(intent);
      intentScores[intent] = score;
    }
  }

  // Determine primary category (highest priority score)
  let primaryCategory = 'GENERAL';
  let maxScore = 0;
  for (const [intent, score] of Object.entries(intentScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryCategory = intent;
    }
  }

  // If a substantive actionable intent exists alongside a greeting, prioritize the substantive one
  const conversationalIntents = ['GREETING', 'THANKS', 'BOT_IDENTITY'];
  const substantiveIntents = detectedIntents.filter(i => !conversationalIntents.includes(i));
  if (substantiveIntents.length > 0) {
    let maxSubScore = 0;
    for (const intent of substantiveIntents) {
      if ((intentScores[intent] || 0) > maxSubScore) {
        maxSubScore = intentScores[intent];
        primaryCategory = intent;
      }
    }
  }

  // If no intents detected but we have entities, default to COURSES (general info)
  if (detectedIntents.length === 0) {
    if (entities.length > 0) {
      detectedIntents.push('COURSES');
      primaryCategory = 'COURSES';
    } else {
      primaryCategory = 'GENERAL';
      detectedIntents.push('GENERAL');
    }
  }

  const confidence = maxScore > 0 ? Math.min(1.0, maxScore * 0.05 + 0.5) : 0.3;

  return {
    category: primaryCategory,
    intents: detectedIntents,
    entities,
    isAmbiguous: false,
    isOffTopic: false,
    ambiguityHint: null,
    confidence
  };
};

module.exports = {
  classifyQuery
};
