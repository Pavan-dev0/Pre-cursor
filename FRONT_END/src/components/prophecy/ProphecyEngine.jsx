import { motion } from 'framer-motion'
import ProphecyCard from './ProphecyCard'
import { fadeUpVariants, staggerContainer, transitions, viewportOnce, withDelay } from '../../lib/motion'
import { useAdaptiveSection } from '../../lib/adaptive.jsx'

export default function ProphecyEngine({ prophecies = [], sourcesCount = 0, notice = '' }) {
  const { ref, isActive, wasVisited } = useAdaptiveSection('prophecy')

  return (
    <motion.div
      ref={ref}
      className={`narrative-section narrative-section-prophecy ${isActive ? 'is-active' : ''} ${wasVisited ? 'was-visited' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.02)}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '72px 48px 76px',
      }}
    >
      {/* Header */}
      <motion.div variants={fadeUpVariants(18, transitions.reveal)} style={{ textAlign: 'center', marginBottom: 34 }}>
        <div
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 'clamp(40px, 5vw, 64px)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          WHAT HAPPENS NEXT
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}
        >
          Precursor Prophecy Engine — pattern-matched from {sourcesCount} live sources
        </div>
      </motion.div>

      {/* Cards row — gap IS the divider */}
      <motion.div
        variants={fadeUpVariants(18, withDelay(transitions.reveal, 0.04))}
        style={{ display: 'flex', gap: 1 }}
      >
        {prophecies.length > 0 ? (
          prophecies.map((p, i) => (
            <ProphecyCard key={i} prophecy={p} delay={i * 0.15} />
          ))
        ) : (
          <div
            className="interactive-panel ambient-panel"
            style={{
              flex: 1,
              padding: 32,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)'
            }}
          >
            {notice || 'Prophecy Engine temporarily unavailable'}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
