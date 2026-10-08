/**
 * MGMU IICT Primary AI Provider
 *
 * Builds a structured evidence package from retrieved sources, then sends it
 * to the LLM with a strict grounding system prompt.
 *
 * The LLM receives:
 *   - A strict system prompt forbidding hallucination
 *   - Structured EVIDENCE (pre-extracted facts with source labels)
 *   - The conversation context (recent history)
 *   - The user's exact question
 *
 * The LLM must answer ONLY from the evidence. It cannot add general knowledge.
 */

const axios = require('axios');
const logger = require('../../utils/logger');

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the official MGMU IICT AI Assistant — a knowledgeable assistant for MGM University's Institute of Information and Communication Technology (IICT), located in Chhatrapati Sambhajinagar, Maharashtra.

## YOUR CORE RULES (MANDATORY — NEVER VIOLATE)

1. **ONLY use the VERIFIED EVIDENCE provided below.** Never use general knowledge, internet information, or assumptions.
2. **Never invent or estimate** fees, faculty names, eligibility percentages, entrance exams, dates, phone numbers, email addresses, hostel charges, placement figures, or any other facts.
3. **If a fact is not in the evidence, say so explicitly.** Use phrasing like: "I couldn't find verified information about [X] in the available MGMU IICT sources."
4. **Never combine information from different programs.** B.Tech CSE fees must NEVER be described as MCA fees. Each entity's information must stay separate.
5. **Prefer the most authoritative source** when multiple sources exist. If two sources disagree, note the conflict and do not silently choose one.
6. **Address EVERY part of the user's question.** If the user asks about fees AND eligibility, answer both. If you can only answer one, clearly state which part you could not find information for.
7. **Academic year matters.** If the evidence is from a specific year, state it. Prefer the most recent verified source.
8. **Never add a contact number, email, or URL unless it appears verbatim in the provided evidence.**
9. **ANSWER ONLY WHAT IS ASKED (CRITICAL — NO UNREQUESTED EXTRA INFO).**
   - Provide ONLY the specific information requested. Do NOT volunteer unasked details.
   - If the user asks about fees, state ONLY the fees. Do NOT append eligibility, syllabus, or hostel fees unless requested.
   - If the user asks about eligibility, state ONLY the eligibility criteria.
   - If the user asks who is the HOD or Director, state ONLY their name and designation.
   - If the user greets you ("hi", "hello"), respond with a brief, friendly greeting and ask how you can help. Do NOT dump college overviews or program catalogs.
   - Keep answers direct, concise, and focused on the exact query. Avoid marketing fluff.

## RESPONSE STYLE

- Speak naturally and helpfully, like a knowledgeable university assistant.
- Use **bold** for key figures (fees, dates, percentages).
- Keep answers concise and direct for simple questions; do not add unrelated facts.
- Do not start responses with generic filler phrases like "Sure!" or "Great question!"
- Do not end responses with marketing language about MGMU being "the best."

## WHEN INFORMATION IS MISSING

Say: "I found verified information for [X], but the current knowledge base doesn't have confirmed details about [Y]. I don't want to guess."

Do NOT say "generally," "typically," "usually," "approximately," or similar hedging words unless you explicitly state you are estimating and clearly flag it as unverified.

## CONCISENESS & CLEAN OUTPUT

- Focus directly on answering the user's specific question accurately and concisely.
- Do NOT append boilerplate source lists or "Sources used:" blocks to your text; the application UI displays verified sources automatically in the dedicated Source Badge.
- Provide only what was asked.`;

// ─── LLM Model Configuration ──────────────────────────────────────────────────
const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b'
];

const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
];

// ─── Evidence Package Builder ─────────────────────────────────────────────────
/**
 * Converts retrieved source objects into a clean, structured evidence block.
 * Each evidence item is clearly labeled with its source and category.
 * This prevents the LLM from interpreting raw PDF-style chunks incorrectly.
 */
const buildEvidenceBlock = (sources, classification) => {
  if (!sources || sources.length === 0) return null;

  const { intents = [], entities = [] } = classification;

  let block = `## VERIFIED EVIDENCE FROM MGMU IICT KNOWLEDGE BASE\n\n`;
  block += `**Query Analysis:**\n`;
  block += `- Detected intents: ${intents.join(', ') || 'GENERAL'}\n`;
  block += `- Programs/entities mentioned: ${entities.length > 0 ? entities.join(', ') : 'Not specified'}\n\n`;
  block += `---\n\n`;

  sources.forEach((s, i) => {
    block += `### EVIDENCE ${i + 1}: ${s.title}\n`;
    block += `- **Category:** ${s.category}\n`;
    block += `- **Source:** ${s.source}\n`;
    block += `- **Verified:** ${s.verified ? 'Yes' : 'Unverified'}\n`;
    if (s.academicYear) block += `- **Academic Year:** ${s.academicYear}\n`;
    if (s.lastUpdated) block += `- **Last Updated:** ${s.lastUpdated}\n`;
    block += `\n**Content:**\n${s.content}\n`;
    block += `\n---\n\n`;
  });

  return block;
};

// ─── Conversation History Formatter ──────────────────────────────────────────
const buildConversationContext = (contextHistory = []) => {
  if (!contextHistory || contextHistory.length === 0) return null;

  const recent = contextHistory.slice(-6); // last 3 exchanges
  return recent
    .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n');
};

// ─── Generate via Groq ────────────────────────────────────────────────────────
const generateWithGroq = async (apiKey, messages) => {
  const groqUrl = process.env.AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

  for (const model of GROQ_MODELS) {
    try {
      const response = await axios.post(
        groqUrl,
        {
          model,
          messages,
          temperature: 0.05,   // Very low — we want deterministic, factual output
          max_tokens: 1200,
          top_p: 0.95
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 12000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        logger.info(`[AI] Successfully generated response via Groq model: ${model}`);
        return content;
      }
    } catch (error) {
      logger.warn(`[AI] Groq model ${model} failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  return null;
};

// ─── Generate via Gemini ──────────────────────────────────────────────────────
const generateWithGemini = async (apiKey, systemPrompt, userContent) => {
  for (const apiUrl of GEMINI_ENDPOINTS) {
    try {
      const response = await axios.post(
        `${apiUrl}?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
          }],
          generationConfig: {
            temperature: 0.05,
            maxOutputTokens: 1200,
            topP: 0.95
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        logger.info(`[AI] Successfully generated response via Gemini`);
        return content;
      }
    } catch (error) {
      logger.warn(`[AI] Gemini endpoint failed: ${error.message}`);
    }
  }
  return null;
};

// ─── Main Generation Function ─────────────────────────────────────────────────
/**
 * Generates an AI response using a structured evidence package.
 *
 * @param {string} query - The user's question
 * @param {Array} sources - Retrieved & ranked knowledge sources
 * @param {Object} classification - Query classification result
 * @param {Array} contextHistory - Conversation history
 * @returns {string|null} - Generated response text, or null on failure
 */
const generateWithPrimaryAI = async (query, sources, classification, contextHistory = []) => {
  const apiKey = process.env.AI_API_KEY;
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();

  if (!apiKey) {
    logger.info('[AI] No AI_API_KEY provided. Bypassing external LLM call.');
    return null;
  }

  if (!sources || sources.length === 0) {
    logger.info('[AI] No verified sources available. Bypassing LLM call.');
    return null;
  }

  // Build structured evidence block
  const evidenceBlock = buildEvidenceBlock(sources, classification);
  if (!evidenceBlock) return null;

  // Build conversation context
  const conversationContext = buildConversationContext(contextHistory);

  // Build user message
  let userMessage = evidenceBlock + '\n';
  if (conversationContext) {
    userMessage += `## RECENT CONVERSATION CONTEXT\n${conversationContext}\n\n`;
  }
  userMessage += `## USER'S CURRENT QUESTION\n${query}\n\n`;
  userMessage += `## YOUR TASK\nAnswer ONLY what the user explicitly asked in their question. DO NOT include unrequested extra information (e.g. if they asked about fees, do NOT add eligibility, syllabus, or hostel details). Answer directly, accurately, and concisely from the verified evidence above. Follow all system rules strictly.`;

  // Use Groq
  if (provider === 'groq' || apiKey.startsWith('gsk_')) {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ];
    const result = await generateWithGroq(apiKey, messages);
    if (result) return result;
  }

  // Fallback to Gemini
  return await generateWithGemini(apiKey, SYSTEM_PROMPT, userMessage);
};

module.exports = {
  generateWithPrimaryAI,
  buildEvidenceBlock
};
