import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TerminalFeed from './TerminalFeed'
import SourceCounter from './SourceCounter'
import { terminalLines } from '../../data/mockData'

const LOADER_TOTAL_MS = 6000
const REPORT_TRANSITION_DELAY_MS = 800
const TERMINAL_REVEAL_MS = LOADER_TOTAL_MS - REPORT_TRANSITION_DELAY_MS
const SOURCE_TYPE_COUNT = 6

export default function ScanLoader({ setView }) {
  const [visibleCount, setVisibleCount] = useState(0)

  const checkedCount = Math.min(
    SOURCE_TYPE_COUNT,
    Math.floor((visibleCount / terminalLines.length) * SOURCE_TYPE_COUNT)
  )

  useEffect(() => {
    const lineIntervalMs = TERMINAL_REVEAL_MS / terminalLines.length
    let lineIndex = 0

    const intervalId = setInterval(() => {
      lineIndex += 1
      setVisibleCount(Math.min(lineIndex, terminalLines.length))

      if (lineIndex >= terminalLines.length) {
        clearInterval(intervalId)
      }
    }, lineIntervalMs)

    const finalizeId = setTimeout(() => {
      setVisibleCount(terminalLines.length)
      clearInterval(intervalId)
    }, TERMINAL_REVEAL_MS)

    const reportId = setTimeout(() => {
      setVisibleCount(terminalLines.length)
      setView('report')
    }, LOADER_TOTAL_MS)

    return () => {
      clearInterval(intervalId)
      clearTimeout(finalizeId)
      clearTimeout(reportId)
    }
  }, [setView])

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
        <TerminalFeed lines={terminalLines.slice(0, visibleCount)} />
      </div>

      <div style={{ flex: 1 }}>
        <SourceCounter checkedCount={checkedCount} trigger duration={TERMINAL_REVEAL_MS} />
      </div>
    </motion.div>
  )
}
