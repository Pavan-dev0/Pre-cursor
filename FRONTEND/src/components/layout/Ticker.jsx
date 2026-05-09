const CONTENT =
  'BANGALORE B2B SAAS · GENERATIVE AI INDIA · EV CHARGING INFRA · VERNACULAR EDTECH · CREATOR MONETIZATION · HINDI LEGAL AI · GIG WORKER FINTECH · OPEN SOURCE TOOLING · CLIMATE TECH PUNE · D2C BEAUTY TIER2 · '

export default function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
          {CONTENT}
        </span>
        <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
          {CONTENT}
        </span>
      </div>
    </div>
  )
}
