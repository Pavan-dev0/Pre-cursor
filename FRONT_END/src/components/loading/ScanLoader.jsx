import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import TerminalFeed from './TerminalFeed'
import SourceCounter from './SourceCounter'

const SOURCE_TYPE_COUNT = 6
const MIN_MS = 6000
const LINE_INTERVAL_MS = Math.round(MIN_MS / 19)

const buildTerminalLines = (topic) => [
  '→ Anakin: initializing universal scraper...',
  `→ Anakin: fetching reddit.com/r/india [scanning ${topic}]`,
  '→ Anakin: fetching news.ycombinator.com',
  '→ Anakin: fetching wellfound.com/jobs',
  '→ Anakin: fetching naukri.com',
  '→ Anakin: fetching yourstory.com',
  '→ Anakin: fetching inc42.com',
  '→ Anakin: fetching producthunt.com',
  '→ Anakin: fetching techcrunch.com',
  '→ 8 sources collected. Filtering signal-rich content...',
  '→ Zeitgeist Engine: extracting atomic signals...',
  '→ Running contradiction detection across sources...',
  '→ Mapping silence patterns — what the web is NOT saying...',
  '→ Detecting velocity anomalies...',
  '→ Extracting cultural DNA from language patterns...',
  '→ Prophecy Engine: analyzing precursor signatures...',
  '→ Pattern-matching against historical signals...',
  '→ Generating thesis cards...',
  '→ PRECURSOR REPORT READY.',
]

export default function ScanLoader({ stage, sourceCountTarget, topic }) {
  const lines = useMemo(() => buildTerminalLines(topic), [topic])
  const [visibleCount, setVisibleCount] = useState(1)
  const startRef = useRef(Date.now())

  const checkedCount = Math.min(
    SOURCE_TYPE_COUNT,
    Math.floor((visibleCount / Math.max(lines.length, 1)) * SOURCE_TYPE_COUNT)
  )

  useEffect(() => {
    startRef.current = Date.now()
    setVisibleCount(1)
  }, [topic])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const nextCount = Math.min(lines.length, Math.floor(elapsed / LINE_INTERVAL_MS) + 1)
      setVisibleCount(nextCount)
    }, LINE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [lines.length])

  const stageLabel = {
    scanning: 'SCANNING',
    analyzing: 'ANALYZING',
    prophecy: 'PROPHECY',
    complete: 'FINALIZING',
    idle: 'INITIALIZING'
  }[stage] || 'INITIALIZING'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        padding: '80px 48px',
        gap: 80,
      }}
    >
      <div style={{ flex: '0 0 58%' }}>
        <div className="font-mono mono-meta" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 20 }}>
          STAGE · {stageLabel}
        </div>
        <TerminalFeed
          lines={lines.slice(0, visibleCount)}
          showCursor={visibleCount >= lines.length && stage !== 'complete'}
        />
      </div>

      <div style={{ flex: 1 }}>
        <SourceCounter
          checkedCount={checkedCount}
          trigger={visibleCount > 0}
          duration={1800}
          sourceCountTarget={sourceCountTarget}
        />
      </div>
    </motion.div>
  )
}
