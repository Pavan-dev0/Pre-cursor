import { useCountUp } from '../../hooks/useCountUp'

const SOURCE_TYPES = ['Job Boards', 'Forums', 'VC Portfolios', 'Reviews', 'Launches', 'News']

export default function SourceCounter({ checkedCount }) {
  const count = useCountUp(31, true, 2500)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div className="font-display" style={{ fontWeight: 800, fontSize: 120, color: 'var(--accent)', lineHeight: 1 }}>
        {count}
      </div>
      <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, letterSpacing: '0.1em' }}>
        SOURCES SCRAPED
      </div>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SOURCE_TYPES.map((source, i) => (
          <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i < checkedCount ? 'var(--accent)' : 'transparent',
                border: '1px solid',
                borderColor: i < checkedCount ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
                display: 'inline-block',
                flexShrink: 0,
                transition: 'all 0.3s',
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 12,
                color: i < checkedCount ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}
            >
              {source}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
