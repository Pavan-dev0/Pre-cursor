import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { useScrambleText } from '../../hooks/useScrambleText'
import { useInView } from '../../hooks/useInView'

export default function ProphecyCard({ prophecy, delay = 0 }) {
  const { ref, inView } = useInView(0.2)
  const count = useCountUp(prophecy.confidence, inView, 1000)
  const { displayText } = useScrambleText(prophecy.statement, inView, 700)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent)',
        padding: 32,
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Confidence score */}
      <div className="font-display" style={{ fontWeight: 800, fontSize: 64, color: 'var(--accent)', lineHeight: 1 }}>
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
          animate={{ width: inView ? `${prophecy.confidence}%` : '0%' }}
          transition={{ duration: 0.8, delay: 0.3 }}
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
        className="font-body"
        style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 16 }}
      >
        {prophecy.evidence}
      </div>

      {/* Sources */}
      <div className="font-mono" style={{ fontSize: 10, marginTop: 16 }}>
        <span style={{ color: 'var(--accent)' }}>Sources: </span>
        <span style={{ color: 'var(--text-muted)' }}>{prophecy.sources}</span>
      </div>
    </motion.div>
  )
}
