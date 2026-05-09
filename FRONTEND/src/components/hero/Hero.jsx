import { useState } from 'react'
import { motion } from 'framer-motion'
import Ticker from '../layout/Ticker'
import SourceChips from './SourceChips'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero({ setView }) {
  const [inputVal, setInputVal] = useState('Bangalore B2B SaaS Ecosystem, May 2026')

  const handleScan = () => {
    if (inputVal.trim()) setView('loading')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleScan()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div className="grain-overlay" />

      {/* Ghost number */}
      <div
        style={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          textAlign: 'right',
        }}
      >
        <div
          className="font-display"
          style={{ fontWeight: 800, fontSize: 200, color: 'rgba(255,255,255,0.03)', lineHeight: 1 }}
        >
          247
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.15em', marginTop: 8 }}
        >
          LIVE THESES
        </div>
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 'calc(100vh - 60px)',
          padding: '80px 48px 40px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>
          {/* Overline */}
          <motion.div variants={itemVariants}>
            <span className="font-mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.25em' }}>
              INTELLIGENCE · MARKET · ACTION
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} style={{ marginTop: 20 }}>
            <div
              className="font-display"
              style={{
                fontWeight: 800,
                fontSize: 'clamp(48px, 6vw, 80px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
              }}
            >
              <div style={{ color: 'var(--text-primary)' }}>THE SIGNAL</div>
              <div style={{ color: 'var(--text-primary)' }}>BEFORE</div>
              <div style={{ color: 'var(--accent)' }}>THE STORM.</div>
            </div>
          </motion.div>

          {/* Body */}
          <motion.p
            variants={itemVariants}
            className="font-body"
            style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              maxWidth: 460,
              lineHeight: 1.75,
              marginTop: 28,
              fontStyle: 'italic',
            }}
          >
            Precursor scrapes the live web, finds the gaps nobody is building for, and lets the world's sharpest minds
            stake conviction on what becomes the next billion-dollar company.
          </motion.p>

          {/* Input row */}
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: 0, marginTop: 32, maxWidth: 560 }}>
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKey}
              className="font-mono"
              placeholder="Enter industry or city..."
              style={{
                fontSize: 14,
                background: 'var(--bg-surface)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRight: 'none',
                height: 52,
                padding: '0 20px',
                flex: 1,
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 200ms',
                borderRadius: 0,
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
            <button
              onClick={handleScan}
              className="font-display"
              style={{
                fontWeight: 800,
                fontSize: 13,
                background: 'var(--accent)',
                color: 'white',
                height: 52,
                padding: '0 28px',
                border: 0,
                cursor: 'pointer',
                letterSpacing: '0.08em',
                transition: 'background 150ms',
                borderRadius: 0,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(108,99,255,0.85)')}
              onMouseLeave={(e) => (e.target.style.background = 'var(--accent)')}
            >
              SCAN →
            </button>
          </motion.div>

          {/* Source chips */}
          <motion.div variants={itemVariants}>
            <SourceChips />
          </motion.div>
        </div>
      </motion.div>

      {/* Ticker at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Ticker />
      </div>
    </div>
  )
}
