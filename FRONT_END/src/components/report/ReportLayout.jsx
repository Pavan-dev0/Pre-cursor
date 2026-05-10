import { motion } from 'framer-motion'
import ConsensusSection from './ConsensusSection'
import ContradictionSection from './ContradictionSection'
import SilenceSection from './SilenceSection'
import VelocityChart from './VelocityChart'
import CulturalDNA from './CulturalDNA'
import { transitions } from '../../lib/motion'
import { useAdaptiveSection } from '../../lib/adaptive.jsx'

export default function ReportLayout({
  topic,
  scannedAt,
  sourcesCount,
  notice,
  consensus,
  contradictions,
  silenceSignals,
  velocityData,
  culturalDNA,
  summary
}) {
  const { ref, isActive, wasVisited } = useAdaptiveSection('report')

  return (
    <motion.div
      ref={ref}
      className={`narrative-section narrative-section-report ${isActive ? 'is-active' : ''} ${wasVisited ? 'was-visited' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, transition: transitions.standard }}
      transition={transitions.reveal}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 52,
          background: 'rgba(5,5,8,0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
        }}
      >
        <div>
          <span className="font-mono mono-meta" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            PRECURSOR REPORT:{' '}
          </span>
          <span className="font-mono mono-meta" style={{ fontSize: 10, color: 'var(--accent)' }}>
            {topic.toUpperCase()}
          </span>
        </div>
        <span className="font-mono mono-meta" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {sourcesCount} sources · {scannedAt}
        </span>
      </div>

      {(notice || summary) && (
        <div
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            padding: '18px 48px',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start'
          }}
        >
          {notice ? (
            <div className="font-mono mono-meta" style={{ fontSize: 10, color: 'var(--accent)', minWidth: 140 }}>
              SYSTEM NOTE
            </div>
          ) : (
            <div className="font-mono mono-meta" style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 140 }}>
              SUMMARY
            </div>
          )}
          <div className="font-body" style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {notice || summary}
          </div>
        </div>
      )}

      {/* Two column body */}
      <div style={{ display: 'flex', padding: 48 }}>
        {/* Left */}
        <div
          style={{
            width: '58%',
            paddingRight: 48,
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <ConsensusSection items={consensus} />
          <ContradictionSection items={contradictions} />
          <SilenceSection items={silenceSignals} />
        </div>

        {/* Right */}
        <div style={{ width: '42%', paddingLeft: 48 }}>
          <VelocityChart items={velocityData} />
          <CulturalDNA segments={culturalDNA} />
        </div>
      </div>
    </motion.div>
  )
}
