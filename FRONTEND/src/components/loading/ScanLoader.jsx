import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TerminalFeed from './TerminalFeed'
import SourceCounter from './SourceCounter'
import { terminalLines } from '../../data/mockData'

export default function ScanLoader({ setView }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)

  const checkedCount = Math.floor((visibleCount / terminalLines.length) * 6)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= terminalLines.length) {
          clearInterval(interval)
          return v
        }
        return v + 1
      })
    }, 180)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (visibleCount >= terminalLines.length && !done) {
      setDone(true)
      setTimeout(() => setView('report'), 800)
    }
  }, [visibleCount, done, setView])

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
        <SourceCounter checkedCount={checkedCount} />
      </div>
    </motion.div>
  )
}
