import { motion } from 'framer-motion'

function formatLine(line) {
  const doneMatch = line.match(/\[done (.+?)\]/)
  if (doneMatch) {
    const before = line.split('[done')[0]
    return (
      <span>
        {before}
        <span style={{ color: 'var(--accent)' }}>[done {doneMatch[1]}]</span>
      </span>
    )
  }
  if (line.includes('PRECURSOR REPORT READY.')) {
    return (
      <span className="font-display" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
        {line}
      </span>
    )
  }
  return <span>{line}</span>
}

export default function TerminalFeed({ lines, showCursor = false }) {
  return (
    <div>
      <div
        className="font-mono"
        style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 24 }}
      >
        PRECURSOR INTELLIGENCE ENGINE — ACTIVE
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono"
            style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}
          >
            {formatLine(line)}
          </motion.div>
        ))}
        {showCursor && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="font-mono"
            style={{ fontSize: 12, color: 'var(--accent)', lineHeight: 1.8 }}
          >
            ▋
          </motion.div>
        )}
      </div>
    </div>
  )
}
