function normalizeTopic(topic) {
  return String(topic || '').trim().replace(/\s+/g, ' ')
}

function extractMeaningfulWords(topic) {
  const stopWords = new Set([
    'a', 'an', 'and', 'for', 'from', 'in', 'of', 'on', 'the', 'to', 'with',
    'ecosystem', 'india', 'indian', 'bangalore', 'market'
  ])

  return normalizeTopic(topic)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !stopWords.has(word))
    .slice(0, 3)
}

function toSlug(words) {
  return words.join('-') || 'startup'
}

function toKeywords(words) {
  return words.join(' ') || 'startup'
}

function toQueryTopic(topic, fallback) {
  return encodeURIComponent(normalizeTopic(topic) || fallback)
}

function buildURL(url, sourceType, label) {
  return { url, sourceType, label }
}

function generateURLs(topic) {
  const normalizedTopic = normalizeTopic(topic)
  const words = extractMeaningfulWords(normalizedTopic)
  const keywordString = toKeywords(words)
  const keywords = encodeURIComponent(keywordString)
  const urls = [
    { url: `https://www.reddit.com/r/india/search/?q=${keywords}&sort=top&t=month`, sourceType: 'forum', label: 'Reddit r/india' },
    { url: `https://news.ycombinator.com/search?q=${keywords}`, sourceType: 'forum', label: 'Hacker News' },
    { url: `https://wellfound.com/jobs?q=${keywords}`, sourceType: 'jobs', label: 'Wellfound Jobs' },
    { url: `https://www.naukri.com/jobs-in-bangalore?q=${keywords}`, sourceType: 'jobs', label: 'Naukri' },
    { url: `https://yourstory.com/search?q=${keywords}`, sourceType: 'news', label: 'YourStory' },
    { url: `https://inc42.com/?s=${keywords}`, sourceType: 'news', label: 'Inc42' },
    { url: `https://www.producthunt.com/search?q=${keywords}`, sourceType: 'launches', label: 'Product Hunt' },
    { url: `https://techcrunch.com/search/${keywords}/`, sourceType: 'news', label: 'TechCrunch' }
  ]

  return urls.map(({ url, sourceType, label }) => buildURL(url, sourceType, label))
}

module.exports = {
  generateURLs
}
