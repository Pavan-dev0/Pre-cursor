import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useInView } from '../../hooks/useInView'
import { transitions, withDelay } from '../../lib/motion'
import { useAdaptiveSignificance, useAdaptiveSurface } from '../../lib/adaptive.jsx'

export default function ProphecyCard({ prophecy, delay = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })
  const count = useCountUp(prophecy.confidence, inView, 1000)
  const { displayText } = useScrambleText(prophecy.statement, inView, 700)
  const { surfaceProps, isDwelled } = useAdaptiveSurface({ intensity: 0.09, dwellDelay: 320 })
  const significanceStyle = useAdaptiveSignificance({
    significance: prophecy.confidence / 100,
    confidence: prophecy.confidence / 100,
    volatility: 0.28,
    revealBias: delay,
  })

  return (
    <motion.div
      ref={ref}
      className={`interactive-panel ambient-panel interactive-panel-accent significance-surface ${isDwelled ? 'is-dwelled' : ''}`}
      data-volatility={prophecy.confidence >= 80 ? 'high' : 'steady'}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -2 }}
      transition={withDelay(transitions.reveal, delay)}
      {...surfaceProps}
      style={{
        '--card-confidence': (prophecy.confidence / 100).toFixed(3),
        ...significanceStyle,
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent)',
        padding: 32,
        flex: 1,
        minWidth: 0,
        willChange: 'transform, box-shadow',
      }}
    >
      {/* Confidence score */}
      <div className="font-display metric-value" style={{ fontWeight: 800, fontSize: 64, color: 'var(--accent)', lineHeight: 1 }}>
        {count}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 1,
          background: 'rgba(108,99,255,0.15)',
          width: '100%',
          marginTop: 8,
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: inView ? `${prophecy.confidence}%` : '0%' }}
          transition={withDelay(transitions.medium, 0.22)}
          style={{ height: 1, background: 'var(--accent)', position: 'absolute', top: 0, left: 0 }}
        />
      </div>

      {/* Statement (scramble text) */}
      <div
        className="font-display"
        style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5, marginTop: 24, minHeight: 80 }}
      >
        {displayText}
      </div>

      {/* Evidence */}
      <div
        className="font-body significance-caption"
        style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 16 }}
      >
        {prophecy.evidence}
      </div>

      {/* Sources */}
      <div className="font-mono mono-meta significance-caption" style={{ fontSize: 10, marginTop: 16 }}>
        <span style={{ color: 'var(--accent)' }}>Sources: </span>
        <span style={{ color: 'var(--text-muted)' }}>{prophecy.sources}</span>
      </div>
    </motion.div>
  )
}
