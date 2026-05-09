import ProphecyCard from './ProphecyCard'
import { prophecies } from '../../data/mockData'

export default function ProphecyEngine() {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '80px 48px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 'clamp(40px, 5vw, 64px)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          WHAT HAPPENS NEXT
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}
        >
          Precursor Prophecy Engine — pattern-matched from 31 live sources
        </div>
      </div>

      {/* Cards row — gap IS the divider */}
      <div style={{ display: 'flex', gap: 1 }}>
        {prophecies.map((p, i) => (
          <ProphecyCard key={i} prophecy={p} delay={i * 0.15} />
        ))}
      </div>
    </div>
  )
}
