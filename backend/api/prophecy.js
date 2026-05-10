const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { generateProphecies } = require('../lib/prophecyEngine')

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
  const { topic, analysis } = req.body || {}

  if (typeof topic !== 'string' || topic.trim().length === 0 || topic.trim().length > 200) {
    res.status(400).json({ success: false, error: 'Invalid topic' })
    return
  }

  if (!analysis || typeof analysis !== 'object') {
    res.status(400).json({ success: false, error: 'Analysis payload is required' })
    return
  }

  try {
    const prophecies = await generateProphecies(topic.trim(), analysis)
    res.json({
      success: true,
      topic: topic.trim(),
      generatedAt: new Date().toISOString(),
      prophecies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Prophecy generation failed'
    })
  }
})

module.exports = app
