import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'
import { fadeUpVariants, transitions, viewportOnce, withDelay } from '../../lib/motion'
import { useAdaptiveSection, useAdaptiveSignificance, useAdaptiveSurface } from '../../lib/adaptive.jsx'

export default function PrecursorScore({ profile }) {
  const { ref: sectionRef, isActive, wasVisited } = useAdaptiveSection('score')
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: '0px 0px -10% 0px' })
  const score = useCountUp(profile.score, inView, 1500)
  const { surfaceProps, isDwelled } = useAdaptiveSurface({ intensity: 0.1, dwellDelay: 320 })
  const significanceStyle = useAdaptiveSignificance({
    significance: profile.score / 100,
    confidence: profile.accuracy / 100,
    volatility: 0.18,
    revealBias: 0.16,
  })

  return (
    <motion.div
      ref={(node) => {
        ref(node)
        sectionRef(node)
      }}
      className={`narrative-section narrative-section-score ${isActive ? 'is-active' : ''} ${wasVisited ? 'was-visited' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpVariants(22, transitions.reveal)}
      style={{ padding: '72px 48px 76px', borderTop: '1px solid var(--border-subtle)' }}
    >
      <motion.div
        className="font-display"
        variants={fadeUpVariants(16, transitions.reveal)}
        style={{
          fontWeight: 800,
          fontSize: 'clamp(32px, 4vw, 48px)',
          color: 'var(--text-primary)',
          marginBottom: 40,
          maxWidth: 680,
        }}
      >
        YOUR JUDGMENT, QUANTIFIED.
      </motion.div>

      <div style={{ display: 'flex', gap: 56, alignItems: 'stretch' }}>
        {/* Profile card */}
        <motion.div
          className={`interactive-panel ambient-panel significance-surface ${isDwelled ? 'is-dwelled' : ''}`}
          data-volatility="steady"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          whileHover={{ y: -2 }}
          transition={transitions.reveal}
          {...surfaceProps}
          style={{
            '--card-confidence': (profile.score / 100).toFixed(3),
            ...significanceStyle,
            flex: '0 0 38%',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.10)',
            padding: 32,
            borderRadius: 0,
            willChange: 'transform, box-shadow',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="font-display" style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>
              {profile.initials}
            </span>
          </div>

          <div className="font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginTop: 16 }}>
            {profile.name}
          </div>
          <div className="font-body" style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {profile.role}
          </div>

          <div className="font-display metric-value" style={{ fontWeight: 800, fontSize: 72, color: 'var(--accent)', marginTop: 20, lineHeight: 1 }}>
            {score}
          </div>
          <div className="font-mono mono-meta significance-caption" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            PRECURSOR SCORE
          </div>
          <div className="font-mono mono-meta significance-caption" style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {profile.percentile}
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '20px 0' }} />

          <div className="font-mono mono-meta significance-caption" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {profile.thesesStaked} theses surfaced · {profile.accuracy}% signal confidence · {profile.resolved} prophecies generated
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <div className="pulse-dot" />
            <div className="font-body" style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              {profile.notableCall}
            </div>
          </div>
        </motion.div>

        {/* Right text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={withDelay(transitions.reveal, 0.08)}
          style={{ flex: 1, paddingTop: 6, maxWidth: 640 }}
        >
          <div className="font-body" style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            Your Precursor Score is the only credential that cannot be faked. It is built entirely from whether your
            convictions about the future turned out to be right — weighted by how early you called it, how contrarian
            it was, and how credible your domain expertise made your stake.
          </div>
          <div
            className="font-body"
            style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 32 }}
          >
            Better than followers. Better than a resume. It is your judgment, on the record.
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
