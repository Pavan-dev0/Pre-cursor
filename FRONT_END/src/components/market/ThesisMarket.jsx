import { motion } from 'framer-motion'
import ThesisCard from './ThesisCard'
import { fadeUpVariants, staggerContainer, transitions, viewportOnce, withDelay } from '../../lib/motion'
import { useAdaptiveSection } from '../../lib/adaptive.jsx'

export default function ThesisMarket({ theses = [] }) {
  const { ref, isActive, wasVisited } = useAdaptiveSection('market')

  return (
    <motion.div
      ref={ref}
      className={`narrative-section narrative-section-market ${isActive ? 'is-active' : ''} ${wasVisited ? 'was-visited' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.08, 0.02)}
      style={{ padding: '72px 48px 76px', borderTop: '1px solid var(--border-subtle)' }}
    >
      {/* Header */}
      <motion.div variants={fadeUpVariants(18, transitions.reveal)} style={{ marginBottom: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            className="font-display"
            style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text-primary)' }}
          >
            LIVE THESIS MARKET
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '4px 10px',
              letterSpacing: '0.08em',
              borderRadius: 0,
            }}
          >
            BETA
          </div>
        </div>
        <div
          className="font-body"
          style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 10, maxWidth: 520 }}
        >
          Stake your conviction on which gaps become billion-dollar companies.
        </div>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={fadeUpVariants(18, withDelay(transitions.reveal, 0.04))}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, alignItems: 'stretch' }}
      >
        {theses.map((t, i) => (
          <ThesisCard key={i} thesis={t} index={i} />
        ))}
      </motion.div>
    </motion.div>
  )
}
