const chips = ['Job Boards', 'Forums', 'VC Portfolios', 'Reviews', 'Product Launches', 'Landing Pages']

export default function SourceChips() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
      {chips.map((chip) => (
        <span
          key={chip}
          className="font-mono"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            fontSize: 10,
            letterSpacing: '0.08em',
            padding: '5px 12px',
            color: 'var(--text-secondary)',
            borderRadius: 0,
          }}
        >
          {chip}
        </span>
      ))}
    </div>
  )
}
