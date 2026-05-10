function formatScanDate(value) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    }).format(new Date(value))
  } catch {
    return value
  }
}

function ensureArray(items) {
  return Array.isArray(items) ? items : []
}

function withSectionFallback(items, fallback) {
  return ensureArray(items).length > 0 ? items : fallback
}

function compactWords(text) {
  return String(text || '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function titleCase(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

function deriveTitle(signal, fallbackTopic, index) {
  const candidates = compactWords(signal.text)
    .filter((word) => word.length > 3)
    .slice(0, 3)

  if (candidates.length > 0) {
    return titleCase(candidates.join(' '))
  }

  return `${fallbackTopic} Thesis ${index + 1}`
}

function buildTheses(topic, analysis) {
  const velocitySeed = analysis.velocityData || []
  const theses = (analysis.silenceSignals || []).slice(0, 3).map((signal, index) => {
    const velocity = velocitySeed[index % Math.max(velocitySeed.length, 1)] || { width: 52, sources: 5 }
    const confidence = Math.max(62, Math.min(88, Math.round(velocity.width)))
    const price = Math.max(60, Math.min(94, Math.round((confidence + velocity.sources * 2) / 1.15)))

    return {
      title: deriveTitle(signal, topic, index),
      gap: signal.text,
      price,
      confidence,
      stakers: Math.max(12, velocity.sources * 3 + index * 4),
      daysAgo: index + 1
    }
  })

  while (theses.length < 3) {
    theses.push({
      title: `${topic} Thesis ${theses.length + 1}`,
      gap: 'Insufficient web signal for this section.',
      price: 65,
      confidence: 65,
      stakers: 12,
      daysAgo: theses.length + 1
    })
  }

  return theses
}

function buildProfile(topic, analysis, prophecies, sourceCount) {
  const consensus = analysis.consensus || []
  const avgConsensus = consensus.length > 0
    ? consensus.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / consensus.length
    : 72
  const avgProphecy = prophecies.length > 0
    ? prophecies.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / prophecies.length
    : avgConsensus
  const avgVelocity = (analysis.velocityData || []).length > 0
    ? analysis.velocityData.reduce((sum, item) => sum + Number(item.width || 0), 0) / analysis.velocityData.length
    : 60

  const score = Math.round(avgConsensus * 0.45 + avgProphecy * 0.35 + avgVelocity * 0.2)
  const initials = compactWords(topic).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('').slice(0, 2) || 'PR'

  return {
    initials,
    name: `${topic}`,
    role: 'Live market intelligence scan',
    score,
    percentile: `${sourceCount} live sources synthesized`,
    thesesStaked: buildTheses(topic, analysis).length,
    accuracy: Math.round(avgConsensus),
    resolved: prophecies.length,
    notableCall: prophecies[0]?.statement || analysis.summary
  }
}

function padProphecies(items) {
  const prophecies = ensureArray(items).map((item) => ({
    confidence: Number(item.confidence || 65),
    statement: String(item.statement || '').trim(),
    evidence: String(item.evidence || '').trim(),
    sources: String(item.sources || 'N/A').trim(),
    timeframe: String(item.timeframe || '').trim(),
    precursorType: String(item.precursorType || '').trim()
  }))

  while (prophecies.length < 3) {
    prophecies.push({
      confidence: 65,
      statement: 'Insufficient signal for third prediction.',
      evidence: 'More data sources needed.',
      sources: 'N/A',
      timeframe: '',
      precursorType: ''
    })
  }

  return prophecies.slice(0, 3)
}

export function buildReportData(result) {
  const topic = result?.topic || 'Unknown Topic'
  const analysis = result?.analysis || {}
  const prophecies = padProphecies(result?.prophecies)
  const theses = buildTheses(topic, analysis)
  const profile = buildProfile(topic, analysis, prophecies, result?.sourcesSucceeded || 0)

  return {
    topic,
    scannedAt: formatScanDate(result?.scannedAt),
    sourcesCount: result?.sourcesSucceeded || 0,
    sourcesAttempted: result?.sourcesAttempted || 0,
    summary: String(analysis.summary || '').trim() || 'Insufficient web signal for this section.',
    consensus: withSectionFallback(analysis.consensus, [
      { id: '01', claim: 'Insufficient web signal for this section.', sources: 0, confidence: 0 }
    ]),
    contradictions: withSectionFallback(analysis.contradictions, [
      {
        left: { claim: 'Insufficient web signal for this section.', source: 'N/A' },
        right: { claim: 'Insufficient web signal for this section.', source: 'N/A' }
      }
    ]),
    silenceSignals: withSectionFallback(analysis.silenceSignals, [
      { text: 'Insufficient web signal for this section.', adjacent: [] }
    ]),
    velocityData: withSectionFallback(analysis.velocityData, [
      { topic: 'Insufficient web signal for this section.', width: 30, sources: 0 }
    ]),
    culturalDNA: withSectionFallback(analysis.culturalDNA, [
      { text: 'Insufficient web signal for this section.', highlight: false }
    ]),
    prophecies,
    theses,
    profile,
    notice: null
  }
}
