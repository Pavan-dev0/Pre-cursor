import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import { transitions, withDelay } from '../../lib/motion'
import { useAdaptiveSignificance, useAdaptiveSurface } from '../../lib/adaptive.jsx'

export default function ThesisCard({ thesis, index = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })
  const { surfaceProps, isDwelled } = useAdaptiveSurface({ intensity: 0.08, dwellDelay: 280 })
  const significanceStyle = useAdaptiveSignificance({
    significance: thesis.confidence / 100,
    confidence: thesis.confidence / 100,
    volatility: clampVolatility(1 - thesis.daysAgo / 30),
    revealBias: index / 10,
  })

  return (
    <motion.div
      ref={ref}
      className={`interactive-panel ambient-panel significance-surface ${isDwelled ? 'is-dwelled' : ''}`}
      data-volatility={thesis.daysAgo <= 10 ? 'high' : 'steady'}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -2 }}
      transition={withDelay(transitions.reveal, index * 0.08)}
      {...surfaceProps}
      style={{
        '--card-confidence': (thesis.confidence / 100).toFixed(3),
        ...significanceStyle,
        background: 'var(--bg-surface)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: 28,
        borderRadius: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        willChange: 'transform, box-shadow',
      }}
    >
      <div>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          className="font-display"
          style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', flex: 1, marginRight: 16 }}
        >
          {thesis.title}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="font-display metric-value" style={{ fontWeight: 800, fontSize: 28, color: 'var(--accent)' }}>
            {thesis.price}
          </div>
          <div className="font-mono mono-meta" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
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
      <div className="font-mono mono-meta significance-caption" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 20, marginBottom: 6 }}>
        Web confidence
      </div>
      <div style={{ height: 2, background: 'rgba(108,99,255,0.15)', width: '100%' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: inView ? `${thesis.confidence}%` : '0%' }}
          transition={withDelay(transitions.medium, 0.18)}
          style={{ height: 2, background: 'var(--accent)' }}
        />
      </div>

      {/* Stats */}
      <div className="font-mono mono-meta significance-caption" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
        {thesis.stakers} stakers · Opened {thesis.daysAgo} days ago
      </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <motion.button
          {...surfaceProps}
          whileHover={{
            scale: 1.01,
            backgroundColor: '#6C63FF',
            color: '#ffffff',
            boxShadow: 'var(--glow-accent-soft)',
          }}
          whileTap={{ scale: 0.985 }}
          transition={transitions.standard}
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 12,
            padding: '10px 20px',
            border: '1px solid #6C63FF',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            borderRadius: 0,
            background: 'transparent',
            color: '#6C63FF',
            willChange: 'transform, box-shadow, background-color',
          }}
        >
          STAKE HIGH ↑
        </motion.button>

        <motion.button
          {...surfaceProps}
          whileHover={{
            scale: 1.01,
            borderColor: 'rgba(255,255,255,0.28)',
            color: '#F0EFF8',
            backgroundColor: 'rgba(255,255,255,0.02)',
          }}
          whileTap={{ scale: 0.985 }}
          transition={transitions.standard}
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
            color: '#444455',
            borderColor: 'rgba(255,255,255,0.12)',
            willChange: 'transform, border-color, color',
          }}
        >
          STAKE LOW ↓
        </motion.button>
      </div>
    </motion.div>
  )
}

function clampVolatility(value) {
  return Math.min(1, Math.max(0.18, value))
}
