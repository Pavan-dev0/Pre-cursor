const axios = require('axios')

const ANAKIN_BASE = 'https://api.anakin.io'
const MAX_CONCURRENT = 10

const getKey = () => {
  const key = process.env.ANAKIN_API_KEY
  if (!key) throw new Error('ANAKIN_API_KEY not set in environment')
  return key
}

async function anakinScrape(url) {
  const key = getKey()

  try {
    const response = await axios.post(
      `${ANAKIN_BASE}/v1/url-scraper`,
      {
        url,
        format: 'markdown',
        useBrowser: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`
        },
        timeout: 30000,
        validateStatus: () => true
      }
    )

    if (response.data?.jobId || response.data?.id) {
      const jobResult = await pollForResult(response.data.jobId || response.data.id, key)
      return { url, ...jobResult, status: response.status }
    }

    if (response.status === 200 && response.data) {
      const markdown =
        response.data.markdown ||
        response.data.content ||
        response.data.result ||
        response.data.text ||
        ''
      return { url, markdown, success: markdown.length > 0, status: response.status }
    }

    console.error(`Anakin ${response.status} for ${url}:`, response.data)
    return {
      url,
      markdown: '',
      success: false,
      error: `HTTP ${response.status}`,
      status: response.status
    }
  } catch (err) {
    console.error(`Anakin network error for ${url}:`, err.message)
    return { url, markdown: '', success: false, error: err.message, status: 500 }
  }
}

async function pollForResult(jobId, key, maxAttempts = 20, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs))

    try {
      const pollUrls = [
        `${ANAKIN_BASE}/v1/url-scraper/${jobId}`,
        `${ANAKIN_BASE}/scrape/${jobId}`,
        `${ANAKIN_BASE}/v1/jobs/${jobId}`,
        `${ANAKIN_BASE}/v1/scrape/${jobId}`
      ]

      for (const pollUrl of pollUrls) {
        const res = await axios.get(pollUrl, {
          headers: { Authorization: `Bearer ${key}` },
          timeout: 10000,
          validateStatus: () => true
        })

        if (res.status !== 200) {
          continue
        }

        const status = res.data?.status
        if (status === 'completed' || status === 'done' || status === 'success') {
          const markdown =
            res.data?.result?.markdown ||
            res.data?.markdown ||
            res.data?.content ||
            res.data?.data?.markdown ||
            ''
          return { markdown, success: true }
        }

        if (status === 'failed' || status === 'error') {
          return { markdown: '', success: false, error: 'Job failed' }
        }

        break
      }
    } catch (err) {
      console.error('Poll error:', err.message)
    }
  }

  return { markdown: '', success: false, error: 'Polling timeout' }
}

async function anakinScrapeMany(urlObjects) {
  const results = await Promise.allSettled(
    urlObjects.map(async (item) => {
      const result = await anakinScrape(item.url)
      return { ...item, ...result }
    })
  )

  return results.map((result, index) =>
    result.status === 'fulfilled'
      ? result.value
      : {
          ...urlObjects[index],
          markdown: '',
          success: false,
          error: result.reason?.message
        }
  )
}

module.exports = { anakinScrape, anakinScrapeMany }
