const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3001)

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'precursor-backend',
    now: new Date().toISOString()
  })
})

app.use('/api/scan', require('./scan'))
app.use('/api/analyze', require('./analyze'))
app.use('/api/prophecy', require('./prophecy'))
app.use('/api/run', require('./run'))

app.listen(port, () => {
  console.log(`PRECURSOR backend listening on http://localhost:${port}`)
})
