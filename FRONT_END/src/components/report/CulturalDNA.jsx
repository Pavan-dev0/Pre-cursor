import { motion } from 'framer-motion'
import SectionLabel from './SectionLabel'
import { fadeUpVariants, transitions, viewportOnce } from '../../lib/motion'

export default function CulturalDNA({ segments = [] }) {
  const hasFallbackOnly = segments.length === 1 && segments[0]?.text === 'Insufficient web signal for this section.'

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpVariants(18, transitions.reveal)}
      style={{ marginBottom: 56 }}
    >
      <SectionLabel number="05" title="CULTURAL DNA" />
      <div
        className="font-body"
        style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.9 }}
      >
        {hasFallbackOnly
          ? 'Insufficient web signal for this section.'
          : segments.map((seg, i) => (
              <span
                key={i}
                className={seg.highlight ? 'dna-highlight' : undefined}
                style={
                  seg.highlight
                    ? {
                        borderBottom: '1px solid #6C63FF',
                        color: 'var(--text-primary)',
                        fontStyle: 'normal',
                        paddingBottom: 1,
                      }
                    : {}
                }
              >
                {seg.text}
              </span>
            ))}
      </div>
    </motion.div>
  )
}
