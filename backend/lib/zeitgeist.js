const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

const SYSTEM_PROMPT = `You are the Zeitgeist Engine — a cross-source intelligence analyzer.
You read scraped web content from multiple source types simultaneously
and extract emergent intelligence that exists BETWEEN sources, not within
any single one. You never summarize. You find patterns, contradictions,
silences, and signals that no individual source contains.
Always respond in valid JSON only. No markdown. No preamble.`

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

function extractJSON(text) {
  const trimmed = String(text || '').trim()

  if (!trimmed) {
    throw new Error('Empty model response')
  }

  try {
    return JSON.parse(trimmed)
  } catch {}

  const objectStart = trimmed.indexOf('{')
  const objectEnd = trimmed.lastIndexOf('}')
  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return JSON.parse(trimmed.slice(objectStart, objectEnd + 1))
  }

  throw new Error('Unable to parse model JSON response')
}

function validateZeitgeistShape(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('Zeitgeist response is not an object')
  }

  const {
    consensus,
    contradictions,
    silenceSignals,
    velocityData,
    culturalDNA,
    summary
  } = result

  if (!Array.isArray(consensus) || consensus.length !== 3) {
    throw new Error('Consensus must contain exactly 3 items')
  }

  if (!Array.isArray(contradictions) || contradictions.length !== 2) {
    throw new Error('Contradictions must contain exactly 2 items')
  }

  if (!Array.isArray(silenceSignals) || silenceSignals.length !== 3) {
    throw new Error('Silence signals must contain exactly 3 items')
  }

  if (!Array.isArray(velocityData) || velocityData.length !== 4) {
    throw new Error('Velocity data must contain exactly 4 items')
  }

  if (!Array.isArray(culturalDNA) || culturalDNA.length < 8 || culturalDNA.length > 12) {
    throw new Error('Cultural DNA must contain 8-12 segments')
  }

  if (typeof summary !== 'string' || summary.trim().length === 0) {
    throw new Error('Summary is required')
  }

  return {
    consensus: consensus.map((item, index) => ({
      id: String(item.id || `${index + 1}`.padStart(2, '0')),
      claim: String(item.claim || '').trim(),
      sources: Number(item.sources || 0),
      confidence: Number(item.confidence || 0)
    })),
    contradictions: contradictions.map((item) => ({
      left: {
        claim: String(item.left?.claim || '').trim(),
        source: String(item.left?.source || '').trim()
      },
      right: {
        claim: String(item.right?.claim || '').trim(),
        source: String(item.right?.source || '').trim()
      }
    })),
    silenceSignals: silenceSignals.map((item) => ({
      text: String(item.text || '').trim(),
      adjacent: Array.isArray(item.adjacent) ? item.adjacent.map((value) => String(value)) : []
    })),
    velocityData: velocityData
      .map((item) => ({
        topic: String(item.topic || '').trim(),
        width: Number(item.width || 0),
        sources: Number(item.sources || 0)
      }))
      .sort((a, b) => b.width - a.width),
    culturalDNA: culturalDNA.map((item) => ({
      text: String(item.text || '').trim(),
      highlight: Boolean(item.highlight)
    })),
    summary: String(summary).trim()
  }
}

function buildPrompt(topic, sources) {
  const sourceBlocks = sources
    .map((source) => `=== SOURCE: ${source.label} (${source.sourceType}) ===\n${source.markdown}`)
    .join('\n\n')

  return `Analyze this web intelligence collected about: ${topic}

SOURCES SCRAPED (${sources.length} total):
${sourceBlocks}

Extract and return ONLY this JSON structure:
{
  "consensus": [
    {
      "id": "01",
      "claim": "one specific, non-obvious insight that multiple sources confirm",
      "sources": number_of_sources_supporting_this,
      "confidence": number_0_to_100
    }
  ],
  "contradictions": [
    {
      "left": {
        "claim": "what official/media sources say",
        "source": "source name and type"
      },
      "right": {
        "claim": "what ground-level/anonymous sources reveal",
        "source": "source name and type"
      }
    }
  ],
  "silenceSignals": [
    {
      "text": "specific gap — what the internet is NOT discussing despite adjacent demand",
      "adjacent": ["market where this IS being discussed"]
    }
  ],
  "velocityData": [
    {
      "topic": "emerging keyword or concept",
      "width": number_0_to_100_representing_spread,
      "sources": number_of_sources_it_appeared_in
    }
  ],
  "culturalDNA": [
    { "text": "paragraph text segment", "highlight": boolean }
  ],
  "summary": "2 sentence overview of the ecosystem state"
}

Rules:
- consensus: exactly 3 items, each a genuinely non-obvious insight
- Keep each consensus claim under 35 words
- contradictions: exactly 2 items, must cite real source types
- Keep each contradiction claim under 25 words
- silenceSignals: exactly 3 items, must be specific and actionable
- Keep each silence signal text under 30 words
- velocityData: exactly 4 items, sort by width descending
- culturalDNA: 8-12 segments alternating highlight:true/false
- Keep each culturalDNA text segment under 28 words
- Keep the summary under 45 words total
- All claims must be grounded in the actual scraped content
- Never hallucinate sources or statistics`
}

async function requestZeitgeist(topic, sources) {
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
            text: buildPrompt(topic, sources)
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 6000,
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingBudget: 0
      }
    }
  })

  return result.response.text()
}

async function analyzeWithZeitgeist(topic, sources) {
  let lastError

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const rawText = await requestZeitgeist(topic, sources)
      const parsed = extractJSON(rawText)
      return validateZeitgeistShape(parsed)
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(`Zeitgeist analysis failed: ${lastError?.message || 'unknown error'}`)
}

module.exports = {
  analyzeWithZeitgeist
}
