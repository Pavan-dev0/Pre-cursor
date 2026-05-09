export const topic = 'Bangalore B2B SaaS Ecosystem'
export const scanDate = 'May 10, 2026 · 14:32 IST'
export const sourceCount = 31

export const terminalLines = [
  '→ Anakin: initializing universal scraper...',
  '→ Anakin: fetching reddit.com/r/india [done 1.8s]',
  '→ Anakin: fetching ycombinator.com [done 2.1s]',
  '→ Anakin: fetching glassdoor.com [done 1.4s]',
  '→ Anakin: fetching linkedin.com/jobs [done 3.2s]',
  '→ Anakin: fetching producthunt.com [done 1.9s]',
  '→ Anakin: fetching techcrunch.com [done 2.4s]',
  '→ Anakin: fetching moneycontrol.com [done 1.6s]',
  '→ Anakin: fetching yourstory.com [done 2.8s]',
  '→ Anakin: fetching naukri.com/jobs [done 1.2s]',
  '→ 31 sources collected. Beginning Zeitgeist analysis...',
  '→ Extracting atomic signals from Markdown...',
  '→ Running contradiction detection...',
  '→ Mapping silence patterns...',
  '→ Detecting velocity anomalies...',
  '→ Extracting cultural DNA...',
  '→ Prophecy Engine initializing...',
  '→ Generating thesis cards...',
  '→ PRECURSOR REPORT READY.',
]

export const consensusSignals = [
  {
    id: '01',
    claim: 'AI adoption is being announced everywhere but infrastructure spend tells a different story',
    sources: 14,
  },
  {
    id: '02',
    claim: 'Founders are optimizing for legitimacy over growth — language patterns reveal deep credibility anxiety',
    sources: 11,
  },
  {
    id: '03',
    claim: 'The B2B sales cycle in this market is 2x longer than founders publicly admit',
    sources: 9,
  },
]

export const contradictions = [
  {
    left: {
      claim: 'Tech media declares Bangalore the AI capital of India',
      source: 'TechCrunch, YourStory — 8 articles',
    },
    right: {
      claim: '0 of 34 scraped job postings require ML engineering. The AI being built is wrappers.',
      source: 'LinkedIn Jobs — scraped live',
    },
  },
  {
    left: {
      claim: 'VCs declare B2B SaaS is saturated and capital is drying up',
      source: '3 VC blogs — past 30 days',
    },
    right: {
      claim: '14 new B2B SaaS products launched on ProductHunt from Bangalore this month alone',
      source: 'ProductHunt — scraped live',
    },
  },
]

export const silenceSignals = [
  {
    text: 'No AI product exists for legal document reading in Hindi despite 400M speakers and booming SMB compliance needs',
    adjacent: ['US Market', 'Southeast Asia'],
  },
  {
    text: 'Zero tools address compliance burden for sub-10-person startups in Tier 2 Indian cities — 340,000 registered businesses, 0 products',
    adjacent: ['EU Market', 'Singapore'],
  },
  {
    text: 'Vernacular voice interfaces for B2B sales teams completely absent — 3 US startups just raised for English version',
    adjacent: ['US Market', 'Latin America'],
  },
]

export const velocityData = [
  { topic: 'voice AI',          width: 87, sources: 11 },
  { topic: 'vernacular SaaS',   width: 72, sources: 19 },
  { topic: 'compliance auto',   width: 54, sources: 8  },
  { topic: 'agentic workflow',  width: 31, sources: 4  },
]

export const culturalDNAText = [
  { text: 'The dominant metaphor of this ecosystem is the ', highlight: false },
  { text: 'Flipkart exit', highlight: true },
  { text: ' — a decade-old event that still structures how founders think about ambition, timeline, and risk. The language reveals a deep tension between wanting to build globally and fearing to leave locally. Phrases like ', highlight: false },
  { text: 'india-first', highlight: true },
  { text: ', ', highlight: false },
  { text: 'real company', highlight: true },
  { text: ', and ', highlight: false },
  { text: 'sustainable growth', highlight: true },
  { text: " appear with 4x the frequency of 'global expansion.' This is not conservatism. It is a specific ", highlight: false },
  { text: 'anxiety about legitimacy', highlight: true },
  { text: '.', highlight: false },
]

export const prophecies = [
  {
    confidence: 74,
    statement: 'A major Bangalore SaaS company will announce significant layoffs within 45 days.',
    evidence:
      'Glassdoor review sentiment for 3 mid-stage companies collapsed 40% over 18 days. LinkedIn activity from senior ICs dropped 60%. Job postings froze simultaneously. This 3-signal pattern preceded layoff announcements in 74% of 12 historical cases tracked.',
    sources: 'Glassdoor (live) · LinkedIn Jobs (live) · Company career pages via Anakin',
  },
  {
    confidence: 81,
    statement: 'Voice AI will become the dominant hiring keyword in this market within 30 days.',
    evidence:
      'The term appeared in 0 Bangalore job postings 30 days ago. Now in 7. It appeared this week across 3 unrelated communities simultaneously — DevOps, sales enablement, and a founder forum. Cross-domain bleed at this speed preceded generative AI dominance in the US by 11 weeks.',
    sources: 'Naukri (live) · LinkedIn Jobs (live) · Reddit · HackerNews via Anakin',
  },
  {
    confidence: 68,
    statement: 'A vernacular EdTech funding round will be publicly announced within 60 days.',
    evidence:
      "Three VC blogs quietly removed 'EdTech is dead' posts in the past 2 weeks — detected via Anakin cached vs live page diff. Two vernacular EdTech products launched on ProductHunt with zero press — a stealth pattern that historically precedes funded announcements by 6 to 8 weeks.",
    sources: 'VC portfolio pages (diff) · ProductHunt (live) · AngelList via Anakin',
  },
]

export const theses = [
  {
    title: 'Hindi Legal AI',
    gap: 'Zero AI tools for legal document reading in Hindi despite 400M speakers and booming SMB compliance sector.',
    price: 84,
    confidence: 71,
    stakers: 23,
    daysAgo: 3,
  },
  {
    title: 'Vernacular Voice B2B',
    gap: 'No voice AI product for B2B sales teams in regional Indian languages. US equivalent raised $18M last month.',
    price: 71,
    confidence: 64,
    stakers: 17,
    daysAgo: 6,
  },
  {
    title: 'Tier 2 Compliance SaaS',
    gap: 'Sub-10-person startups in Tier 2 cities have zero affordable compliance tooling. 340,000 businesses, 0 products.',
    price: 92,
    confidence: 81,
    stakers: 41,
    daysAgo: 1,
  },
]

export const profileData = {
  initials: 'RK',
  name: 'Rohan Krishnamurthy',
  role: 'Founder, ex-Swiggy',
  score: 91,
  percentile: 'Top 3% globally',
  thesesStaked: 34,
  accuracy: 89,
  resolved: 4,
  notableCall: 'Called Voice AI boom 78 days early',
}
