const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { generateURLs } = require('../lib/urlGenerator')
const { anakinScrapeMany } = require('../lib/anakin')
const { getDemoSources } = require('../lib/demoData')

const app = express()
app.set('trust proxy', 1)

const allowedOrigins = new Set([
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean))

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Origin not allowed by CORS'))
  }
}))
app.use(express.json({ limit: '1mb' }))
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
}))

function countWords(markdown) {
  return String(markdown || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
}

app.post('/', async (req, res) => {
  const { topic } = req.body || {}

  if (typeof topic !== 'string' || topic.trim().length === 0 || topic.trim().length > 200) {
    res.status(400).json({
      success: false,
      error: 'Topic must be a non-empty string up to 200 characters'
    })
    return
  }

  if (
    process.env.DEMO_MODE === 'true' ||
    req.body.demoMode === true ||
    req.query.demo === 'true'
  ) {
    return res.json({
      success: true,
      topic: topic.trim(),
      sourcesAttempted: 24,
      sourcesSucceeded: 19,
      demo: true,
      sources: getDemoSources(topic.trim()),
      scannedAt: new Date().toISOString()
    })
  }

  try {
    const generatedSources = generateURLs(topic)
    const scrapedSources = await anakinScrapeMany(generatedSources)
    const authFailure = scrapedSources.find((item) => item.status === 401)

    if (authFailure) {
      res.status(500).json({
        success: false,
        error: 'API authentication failed'
      })
      return
    }

    const usableSources = scrapedSources
      .filter((item) => item.success && item.markdown.length > 200)
      .map((item) => ({
        url: item.url,
        sourceType: item.sourceType,
        label: item.label,
        markdown: item.markdown.slice(0, 3000),
        wordCount: countWords(item.markdown)
      }))

    if (usableSources.length < 5) {
      res.status(422).json({
        success: false,
        error: 'Insufficient data collected',
        topic: topic.trim(),
        sourcesAttempted: generatedSources.length,
        sourcesSucceeded: usableSources.length
      })
      return
    }

    res.json({
      success: true,
      topic: topic.trim(),
      sourcesAttempted: generatedSources.length,
      sourcesSucceeded: usableSources.length,
      sources: usableSources,
      sourcePlan: generatedSources.map(({ url, sourceType, label }) => ({ url, sourceType, label })),
      partialFailure: usableSources.length < generatedSources.length,
      scannedAt: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Scan failed'
    })
  }
})

module.exports = app
