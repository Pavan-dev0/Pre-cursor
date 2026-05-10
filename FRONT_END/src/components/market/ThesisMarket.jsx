import ThesisCard from './ThesisCard'
import { theses } from '../../data/mockData'

export default function ThesisMarket() {
  return (
    <div style={{ padding: '80px 48px', borderTop: '1px solid var(--border-subtle)' }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            className="font-display"
            style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text-primary)' }}
          >
            LIVE THESIS MARKET
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '4px 10px',
              letterSpacing: '0.08em',
              borderRadius: 0,
            }}
          >
            BETA
          </div>
        </div>
        <div
          className="font-body"
          style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 12 }}
        >
          Stake your conviction on which gaps become billion-dollar companies.
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        {theses.map((t, i) => (
          <ThesisCard key={i} thesis={t} index={i} />
        ))}
      </div>
    </div>
  )
}
