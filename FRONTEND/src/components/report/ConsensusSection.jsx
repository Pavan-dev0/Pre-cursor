import { motion } from 'framer-motion'
import SectionLabel from './SectionLabel'
import { useInView } from '../../hooks/useInView'
import { consensusSignals } from '../../data/mockData'

export default function ConsensusSection() {
  const { ref, inView } = useInView()

  return (
    <div ref={ref} style={{ marginBottom: 56 }}>
      <SectionLabel number="01" title="CONSENSUS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {consensusSignals.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              className="font-display"
              style={{
                fontWeight: 800,
                fontSize: 72,
                color: 'rgba(255,255,255,0.04)',
                lineHeight: 1,
                flexShrink: 0,
                width: 80,
                marginTop: -10,
              }}
            >
              {item.id}
            </div>
            <div style={{ flex: 1 }}>
              <div
                className="font-display"
                style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.4 }}
              >
                {item.claim}
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                Appears across {item.sources} sources
              </div>
              <motion.div
                animate={{ width: inView ? '100%' : '0%' }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: 1, background: 'var(--accent)', marginTop: 12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
