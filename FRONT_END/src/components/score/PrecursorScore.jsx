import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'
import { profileData } from '../../data/mockData'

export default function PrecursorScore() {
  const { ref, inView } = useInView(0.2)
  const score = useCountUp(profileData.score, inView, 1500)

  return (
    <div ref={ref} style={{ padding: '80px 48px', borderTop: '1px solid var(--border-subtle)' }}>
      <div
        className="font-display"
        style={{
          fontWeight: 800,
          fontSize: 'clamp(32px, 4vw, 48px)',
          color: 'var(--text-primary)',
          marginBottom: 56,
        }}
      >
        YOUR JUDGMENT, QUANTIFIED.
      </div>

      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            flex: '0 0 40%',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.10)',
            padding: 32,
            borderRadius: 0,
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
              {profileData.initials}
            </span>
          </div>

          <div className="font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginTop: 16 }}>
            {profileData.name}
          </div>
          <div className="font-body" style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {profileData.role}
          </div>

          <div className="font-display" style={{ fontWeight: 800, fontSize: 72, color: 'var(--accent)', marginTop: 20, lineHeight: 1 }}>
            {score}
          </div>
          <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            PRECURSOR SCORE
          </div>
          <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {profileData.percentile}
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '20px 0' }} />

          <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {profileData.thesesStaked} theses staked · {profileData.accuracy}% accuracy · {profileData.resolved} resolved true
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <div className="pulse-dot" />
            <div className="font-body" style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              {profileData.notableCall}
            </div>
          </div>
        </motion.div>

        {/* Right text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ flex: 1 }}
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
    </div>
  )
}
