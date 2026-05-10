import SectionLabel from './SectionLabel'

export default function SilenceSection({ items = [] }) {
  const hasFallbackOnly = items.length === 1 && items[0]?.text === 'Insufficient web signal for this section.'

  return (
    <div style={{ marginBottom: 56 }}>
      <SectionLabel number="03" title="THE SILENCE" />
      <div
        style={{
          background: '#0a0a10',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: 24,
        }}
      >
        <div
          className="font-body"
          style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: 24 }}
        >
          What the internet is not saying:
        </div>
        {hasFallbackOnly ? (
          <div className="font-body" style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Insufficient web signal for this section.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {items.map((sig, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div className="pulse-dot" />
                <div>
                  <div className="font-body" style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                    — {sig.text}
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                    Adjacent signal in:{' '}
                    {sig.adjacent.map((a, j) => (
                      <span key={j} style={{ color: 'var(--text-secondary)', marginRight: 8 }}>
                        [{a}]
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
