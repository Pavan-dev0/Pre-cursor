import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

export default function ThesisCard({ thesis, index = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })
  const [hoverHigh, setHoverHigh] = useState(false)
  const [hoverLow, setHoverLow] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 28,
        borderRadius: 0,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          className="font-display"
          style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', flex: 1, marginRight: 16 }}
        >
          {thesis.title}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 28, color: 'var(--accent)' }}>
            {thesis.price}
          </div>
          <div className="font-mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
            MARKET PRICE
          </div>
        </div>
      </div>

      {/* Gap text */}
      <div
        className="font-body"
        style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginTop: 16,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {thesis.gap}
      </div>

      {/* Confidence bar */}
      <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 20, marginBottom: 6 }}>
        Web confidence
      </div>
      <div style={{ height: 2, background: 'rgba(108,99,255,0.15)', width: '100%' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: inView ? `${thesis.confidence}%` : '0%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ height: 2, background: 'var(--accent)' }}
        />
      </div>

      {/* Stats */}
      <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
        {thesis.stakers} stakers · Opened {thesis.daysAgo} days ago
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <motion.button
          onMouseEnter={() => setHoverHigh(true)}
          onMouseLeave={() => setHoverHigh(false)}
          animate={{
            backgroundColor: hoverHigh ? '#6C63FF' : 'transparent',
            color: hoverHigh ? '#ffffff' : '#6C63FF',
          }}
          whileTap={{ scale: 0.97 }}
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 12,
            padding: '10px 20px',
            border: '1px solid #6C63FF',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            borderRadius: 0,
          }}
        >
          STAKE HIGH ↑
        </motion.button>

        <motion.button
          onMouseEnter={() => setHoverLow(true)}
          onMouseLeave={() => setHoverLow(false)}
          animate={{
            borderColor: hoverLow ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
            color: hoverLow ? '#F0EFF8' : '#444455',
          }}
          whileTap={{ scale: 0.97 }}
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 12,
            padding: '10px 20px',
            border: '1px solid',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            borderRadius: 0,
            background: 'transparent',
          }}
        >
          STAKE LOW ↓
        </motion.button>
      </div>
    </motion.div>
  )
}
