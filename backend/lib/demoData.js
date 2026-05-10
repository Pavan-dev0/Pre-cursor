function countWords(markdown) {
  return String(markdown || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
}

function buildMarkdown(topic, label, sourceType, angle, observations) {
  return `# ${label}

## Topic signal: ${topic}

This archived scan captures realistic market discussion around **${topic}** from a ${sourceType} source. The material reflects the kind of language usually found in live search results: concrete operator pain, early adoption patterns, commercial intent, skepticism around pricing, and repeated references to workflow friction that established tools still fail to remove.

### What respondents are noticing

${observations.map((item) => `- ${item}`).join('\n')}

### Pattern summary

Writers repeatedly describe a market that is not fully mature but clearly moving from experimentation into budgeted evaluation. Teams are no longer asking whether the category exists; they are asking which vendors integrate fastest, reduce manual coordination, and produce measurable ROI without forcing heavy process change. Several posts mention leadership pressure to consolidate tooling, which makes point solutions harder to justify unless they unlock a specific revenue or efficiency outcome.

In parallel, the discussion reveals a gap between public excitement and day-to-day execution. People praise the strategic upside of the category, but the operational comments focus on onboarding time, data quality, handoff failures between teams, and uncertainty about implementation ownership. That tension is usually a precursor to specialized vendors gaining traction: buyers still want the outcome, but they increasingly value products that fit existing workflows and show proof quickly.

### Field note

${angle} The language in this source is commercially useful because it hints at how buyers frame urgency, how practitioners compare alternatives, and where messaging still feels too broad. Repeated references to procurement caution, staffing bottlenecks, and patchwork internal tooling suggest a market where demand exists but conviction is still being earned through better execution and clearer positioning.`
}

function getDemoSources(topic) {
  const normalizedTopic = String(topic || '').trim() || 'Emerging market'
  const entries = [
    ['Naukri Jobs', 'job_boards', 'Listings emphasize product marketing, revops, implementation, and customer success roles tied to category education.', [
      'Hiring demand clusters around GTM operators who can explain the category to buyers without long sales cycles.',
      'Several roles combine analytics, workflow automation, and customer-facing execution instead of pure brand work.',
      'Teams signal urgency by asking for candidates who can build repeatable playbooks from ambiguous market feedback.'
    ]],
    ['LinkedIn Jobs', 'job_boards', 'Employers frame the opportunity as process modernization rather than a broad transformation narrative.', [
      'Job descriptions reference integration ownership, stakeholder alignment, and post-sale expansion.',
      'Language suggests founders want commercially minded operators who can translate product signals into revenue motion.',
      'Roles often sit between product, sales, and operations, indicating the market still rewards cross-functional execution.'
    ]],
    ['Wellfound Jobs', 'job_boards', 'Startup postings show experimentation with lean teams and expectation of fast iteration on messaging.', [
      'Early-stage firms prioritize candidates comfortable with imperfect data and changing definitions of the ideal customer profile.',
      'Compensation mixes salary with upside, reflecting belief in a category still being shaped.',
      'Multiple listings pair growth responsibilities with research and direct customer discovery.'
    ]],
    ['Reddit India', 'forums', 'Community threads focus on practical adoption barriers more than headline market size.', [
      'Users compare whether local buyers actually pay for the workflow improvement or still prefer service-heavy alternatives.',
      'Founders discuss sales friction caused by trust gaps, onboarding anxiety, and slow enterprise approvals.',
      'Comments repeatedly ask for examples of measurable impact rather than abstract innovation.'
    ]],
    ['Reddit Indian Startups', 'forums', 'Founder conversations point to a market with strong curiosity but uneven distribution of conviction.', [
      'Operators mention pilots that generated enthusiasm internally but stalled before budget sign-off.',
      'There is repeated interest in repeatable outbound hooks tailored to vertical pain rather than generic AI positioning.',
      'Several threads describe success only after narrowing the pitch to one job-to-be-done.'
    ]],
    ['Reddit Bangalore', 'forums', 'Local operator sentiment mixes optimism with concern about execution depth.', [
      'Respondents describe hiring constraints and founder bandwidth as major bottlenecks.',
      'People value products that reduce coordination overhead across distributed teams.',
      'Discussion suggests the city ecosystem is crowded with tools, but buyers still struggle to identify trusted category leaders.'
    ]],
    ['Hacker News Search', 'forums', 'Technical discussions emphasize product reliability, data provenance, and workflow fit.', [
      'Developers push back on tools that promise intelligence without transparent inputs.',
      'There is appetite for automation when it reduces repetitive research or qualification tasks.',
      'Threads highlight skepticism toward products that depend on fragile scraping or vague benchmarks.'
    ]],
    ['Quora Search', 'forums', 'Question-style content surfaces demand from first-time buyers trying to map the category.', [
      'People ask which vendors are credible, what the ROI looks like, and how long implementation usually takes.',
      'Answers often default to broad educational framing, showing the market still needs clearer comparison language.',
      'Decision-makers appear to search for low-risk entry points before deeper commitment.'
    ]],
    ['Y Combinator Companies', 'vc_startup_intel', 'Company profiles show adjacent startups converging on similar buyer pain from different angles.', [
      'The overlap suggests category boundaries are still fluid and product narratives are still being negotiated.',
      'Founders increasingly emphasize workflow compression, not just analytics or visibility.',
      'Positioning frequently moves toward proving revenue or efficiency outcomes within a short adoption window.'
    ]],
    ['YourStory Search', 'vc_startup_intel', 'Coverage highlights momentum narratives, partnerships, and founder claims of category acceleration.', [
      'Stories focus on market whitespace, regional adoption, and the need for better operational tooling.',
      'Founders frame the opportunity around underserved mid-market buyers rather than only large enterprises.',
      'Editorial tone is optimistic, but concrete buyer proof points remain selective.'
    ]],
    ['Inc42 Search', 'vc_startup_intel', 'Startup reporting points to investor interest in infrastructure layers around the category.', [
      'Articles connect the space to efficiency pressure and demand for measurable software spend.',
      'The strongest narratives involve focused products solving a repeated bottleneck instead of broad platforms.',
      'Signals imply competition will intensify around execution quality and distribution.'
    ]],
    ['Product Hunt Search', 'product_launches', 'Launch pages reveal how makers package the problem for early adopters.', [
      'Product copy stresses speed, workflow simplification, and easy setup.',
      'User comments reward narrow products with immediate utility more than expansive promises.',
      'Many launches differentiate through templates, automation, or guided outputs rather than core capability alone.'
    ]],
    ['DevHunt Search', 'product_launches', 'Builder communities focus on implementation details and shipping velocity.', [
      'Feedback centers on whether the product reduces manual work on day one.',
      'Makers compare integration depth, latency, and resilience when dependencies fail.',
      'The strongest reactions go to tools that feel opinionated enough to drive adoption.'
    ]],
    ['BetaList Search', 'product_launches', 'Directory-style listings frame the category around pain clarity and discoverability.', [
      'Products with simple buyer narratives appear easier to remember and recommend.',
      'Listings highlight a recurring tradeoff between broad appeal and clear wedge positioning.',
      'Potential customers often ask for social proof, use cases, and compatibility with existing stacks.'
    ]],
    ['TechCrunch Search', 'news_media', 'Media coverage emphasizes category growth and strategic framing.', [
      'Articles map the space to broader shifts in enterprise software efficiency.',
      'The strongest narratives feature vendors that attach themselves to a visible macro trend.',
      'Reporting still underweights the implementation friction that operators mention elsewhere.'
    ]],
    ['Economic Times Search', 'news_media', 'Business coverage links adoption to cost pressure, digital transformation, and productivity targets.', [
      'Executives are quoted as wanting measurable output from software budgets.',
      'The discussion often centers on which segments of the market will adopt first.',
      'There is visible interest in tools that support Indian mid-market and cross-border growth motions.'
    ]],
    ['Moneycontrol Search', 'news_media', 'Coverage captures investor and market language around category expansion.', [
      'Commentary highlights signals of spend efficiency and operational leverage.',
      'The business case is usually framed around resilience and improved execution visibility.',
      'Buyer caution remains visible whenever claims outpace referenceable case studies.'
    ]],
    ['Glassdoor Reviews', 'reviews_sentiment', 'Review-style content reveals internal strain points that market-facing narratives miss.', [
      'Employees mention change management, cross-team alignment, and tooling sprawl.',
      'Operational friction often appears in reviews before it becomes public positioning language.',
      'Teams value products that simplify work without creating another reporting burden.'
    ]],
    ['AmbitionBox Reviews', 'reviews_sentiment', 'Workforce sentiment suggests the category succeeds when processes become easier, not merely more advanced.', [
      'Comments reference expectations for faster delivery with limited headcount growth.',
      'The strongest signals relate to execution discipline, leadership clarity, and tooling usability.',
      'Review language reinforces that adoption depends on practical day-to-day utility.'
    ]]
  ]

  return entries.map(([label, sourceType, angle, observations], index) => {
    const markdown = buildMarkdown(
      normalizedTopic,
      label,
      sourceType,
      angle,
      observations
    )

    return {
      url: `https://demo.precursor.local/source-${index + 1}`,
      sourceType,
      label,
      markdown,
      wordCount: countWords(markdown)
    }
  })
}

module.exports = {
  getDemoSources
}
