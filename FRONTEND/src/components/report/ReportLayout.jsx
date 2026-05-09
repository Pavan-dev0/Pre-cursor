import { motion } from 'framer-motion'
import ConsensusSection from './ConsensusSection'
import ContradictionSection from './ContradictionSection'
import SilenceSection from './SilenceSection'
import VelocityChart from './VelocityChart'
import CulturalDNA from './CulturalDNA'

export default function ReportLayout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6 }}
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
          <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            PRECURSOR REPORT:{' '}
          </span>
          <span className="font-mono" style={{ fontSize: 10, color: 'var(--accent)' }}>
            BANGALORE B2B SAAS ECOSYSTEM
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          31 sources · May 10, 2026 · 14:32 IST
        </span>
      </div>

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
          <ConsensusSection />
          <ContradictionSection />
          <SilenceSection />
        </div>

        {/* Right */}
        <div style={{ width: '42%', paddingLeft: 48 }}>
          <VelocityChart />
          <CulturalDNA />
        </div>
      </div>
    </motion.div>
  )
}
