import { motion } from 'framer-motion'
import SectionLabel from './SectionLabel'
import { contradictions } from '../../data/mockData'

export default function ContradictionSection() {
  return (
    <div style={{ marginBottom: 56 }}>
      <SectionLabel number="02" title="CONTRADICTIONS" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {contradictions.map((pair, i) => (
          <motion.div
            key={i}
            style={{
              position: 'relative',
              padding: '24px 0',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {/* Ghost VS */}
            <motion.div
              className="font-display"
              initial={{ opacity: 0.04 }}
              whileHover={{ opacity: 0.12 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontWeight: 800,
                fontSize: 72,
                color: 'white',
                zIndex: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              VS
            </motion.div>

            <div style={{ display: 'flex', gap: 32, position: 'relative', zIndex: 1 }}>
              <div style={{ flex: 1 }}>
                <div className="font-body" style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {pair.left.claim}
                </div>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--accent)', marginTop: 8 }}>
                  {pair.left.source}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="font-body" style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {pair.right.claim}
                </div>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
                  {pair.right.source}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
