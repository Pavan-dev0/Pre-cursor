import SectionLabel from './SectionLabel'
import { culturalDNAText } from '../../data/mockData'

export default function CulturalDNA() {
  return (
    <div style={{ marginBottom: 56 }}>
      <SectionLabel number="05" title="CULTURAL DNA" />
      <div
        className="font-body"
        style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.9 }}
      >
        {culturalDNAText.map((seg, i) => (
          <span
            key={i}
            style={
              seg.highlight
                ? {
                    borderBottom: '1px solid var(--accent)',
                    color: 'var(--text-primary)',
                    fontStyle: 'normal',
                  }
                : {}
            }
          >
            {seg.text}
          </span>
        ))}
      </div>
    </div>
  )
}
