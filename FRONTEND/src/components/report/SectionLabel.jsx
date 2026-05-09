export default function SectionLabel({ number, title }) {
  return (
    <div
      className="font-display"
      style={{
        fontWeight: 800,
        fontSize: 11,
        color: 'var(--accent)',
        letterSpacing: '0.12em',
        marginBottom: 32,
      }}
    >
      {number} — {title}
    </div>
  )
}
