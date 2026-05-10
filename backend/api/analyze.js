const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { analyzeWithZeitgeist } = require('../lib/zeitgeist')

const app = express()

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
  const { topic, sources } = req.body || {}

  if (typeof topic !== 'string' || topic.trim().length === 0 || topic.trim().length > 200) {
    res.status(400).json({ success: false, error: 'Invalid topic' })
    return
  }

  if (!Array.isArray(sources) || sources.length < 5) {
    res.status(400).json({ success: false, error: 'At least 5 sources are required' })
    return
  }

  try {
    const analysis = await analyzeWithZeitgeist(topic.trim(), sources)
    res.json({
      success: true,
      topic: topic.trim(),
      analyzedAt: new Date().toISOString(),
      ...analysis
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed'
    })
  }
})

module.exports = app
