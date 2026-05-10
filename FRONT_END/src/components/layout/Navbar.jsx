import { memo } from 'react'
import { motion } from 'framer-motion'
import { transitions, withDelay } from '../../lib/motion'

function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={withDelay(transitions.reveal, 0.12)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        backdropFilter: 'blur(8px)',
        background: 'rgba(5,5,8,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 4000,
      }}
    >
      <span
        className="font-display"
        style={{
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: '0.15em',
          color: 'var(--text-primary)',
        }}
      >
        PRECURSOR
      </span>

      <div style={{ display: 'flex', gap: 32 }}>
        {['How it works', 'Sign in'].map((label) => (
          <motion.span
            key={label}
            whileHover={{ color: 'var(--accent)', y: -1 }}
            transition={transitions.micro}
            className="font-mono kinetic-link"
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              willChange: 'transform',
            }}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </motion.nav>
  )
}

export default memo(Navbar)
