const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

const SYSTEM_PROMPT = `You are the Precursor Prophecy Engine. You identify precursor patterns —
early signals in current web data that historically preceded major market
events. You do not predict with ML models. You pattern-match current
signals against known precursor signatures: confidence inversions,
vocabulary emergence, cross-domain bleed, silence-after-noise.
You are precise, evidence-based, and never sensationalist.
Respond in valid JSON only.`

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

function extractJSONArray(text) {
  const trimmed = String(text || '').trim()

  try {
    return JSON.parse(trimmed)
  } catch {}

  const start = trimmed.indexOf('[')
  const end = trimmed.lastIndexOf(']')
  if (start !== -1 && end !== -1 && end > start) {
    return JSON.parse(trimmed.slice(start, end + 1))
  }

  throw new Error('Unable to parse prophecy JSON response')
}

function validateProphecies(items) {
  if (!Array.isArray(items) || items.length !== 3) {
    throw new Error('Prophecy engine must return exactly 3 items')
  }

  return items.map((item) => ({
    confidence: Number(item.confidence || 0),
    statement: String(item.statement || '').trim(),
    evidence: String(item.evidence || '').trim(),
    sources: String(item.sources || '').trim(),
    timeframe: String(item.timeframe || '').trim(),
    precursorType: String(item.precursorType || '').trim()
  }))
}

function buildPrompt(topic, analysis) {
  return `Based on this Zeitgeist analysis of ${topic}:

CONSENSUS: ${JSON.stringify(analysis.consensus)}
CONTRADICTIONS: ${JSON.stringify(analysis.contradictions)}
SILENCE SIGNALS: ${JSON.stringify(analysis.silenceSignals)}
VELOCITY DATA: ${JSON.stringify(analysis.velocityData)}
CULTURAL DNA SUMMARY: ${analysis.summary}

Generate exactly 3 prophecy cards as JSON:
[
  {
    "confidence": number_60_to_90,
    "statement": "specific, falsifiable prediction about what will happen in this market within 30-90 days",
    "evidence": "2-3 sentence explanation of which precursor signals support this prediction and why they are historically significant",
    "sources": "comma-separated list of source types that provided the signals",
    "timeframe": "30 days | 45 days | 60 days | 90 days",
    "precursorType": "confidence_inversion | vocabulary_emergence | cross_domain_bleed | silence_after_noise"
  }
]

Rules:
- Statements must be specific and falsifiable (not vague)
- Keep each statement under 30 words
- Evidence must cite actual patterns from the analysis
- Keep evidence to 2 concise sentences
- Confidence scores: differentiated (not all similar values)
- One prediction per precursor type preferred
- Base everything on the actual analysis data, never hallucinate`
}

async function generateProphecies(topic, zeitgeistAnalysis) {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT
  })

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: buildPrompt(topic, zeitgeistAnalysis)
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingBudget: 0
      }
    }
  })

  return validateProphecies(extractJSONArray(result.response.text()))
}

module.exports = {
  generateProphecies
}
