import { useAdaptiveSection } from '../../lib/adaptive.jsx'

export default function Footer() {
  const { ref, isActive, wasVisited } = useAdaptiveSection('footer', { threshold: 0.45, rootMargin: '0px 0px -8% 0px' })

  return (
    <div
      ref={ref}
      className={`narrative-section narrative-section-footer ${isActive ? 'is-active' : ''} ${wasVisited ? 'was-visited' : ''}`}
      style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        PRECURSOR v0.1 — Built at Build with Anakin Hackathon · Bangalore · May 10, 2026
      </span>
      <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        Intelligence powered by Anakin Universal Scraper
      </span>
    </div>
  )
}
