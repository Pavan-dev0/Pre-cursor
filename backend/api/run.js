const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { generateURLs } = require('../lib/urlGenerator')
const { anakinScrapeMany } = require('../lib/anakin')
const { analyzeWithZeitgeist } = require('../lib/zeitgeist')
const { generateProphecies } = require('../lib/prophecyEngine')
const { getDemoSources } = require('../lib/demoData')

const cache = new Map()
const CACHE_TTL = 60 * 60 * 1000

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
app.use(express.json({ limit: '3mb' }))
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false
}))

app.post('/', async (req, res) => {
  const { topic, demoMode } = req.body || {}
  if (!topic) return res.status(400).json({ error: 'topic is required' })

  const cacheKey = topic.toLowerCase().trim()
  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)
    if (Date.now() - entry.timestamp < CACHE_TTL) {
      console.log('✅ Cache hit:', topic)
      return res.json({ ...entry.data, cached: true })
    }
  }

  try {
    let sources
    if (demoMode || process.env.DEMO_MODE === 'true') {
      sources = getDemoSources(topic)
    } else {
      const urls = generateURLs(topic)
      const scraped = await anakinScrapeMany(urls)
      sources = scraped
        .filter((source) => source.success && source.markdown?.length > 200)
        .map((source) => ({ ...source, markdown: source.markdown.substring(0, 3000) }))
    }

    if (sources.length < 3) {
      return res.status(422).json({
        success: false,
        error: 'Insufficient data. Try a more specific topic.'
      })
    }

    const analysis = await analyzeWithZeitgeist(topic, sources)
    const prophecyResult = await generateProphecies(topic, analysis)

    const data = {
      success: true,
      topic,
      sourcesAttempted: sources.length,
      sourcesSucceeded: sources.length,
      sources,
      analysis,
      prophecies: prophecyResult.prophecies || prophecyResult,
      scannedAt: new Date().toISOString()
    }

    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    return res.json(data)
  } catch (err) {
    console.error('/api/run error:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = app
