# PRECURSOR — The Signal Before the Storm

> Intelligence-backed market for undiscovered startup ideas.

## Stack
- React 18 + Vite
- Tailwind CSS v3
- Framer Motion v11
- Google Fonts: Syne (display) · Syne Mono (mono) · DM Sans (body)

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
  components/
    layout/     Navbar, Ticker
    hero/       Hero, SourceChips
    loading/    ScanLoader, TerminalFeed, SourceCounter
    report/     ReportLayout, ConsensusSection, ContradictionSection,
                SilenceSection, VelocityChart, CulturalDNA, SectionLabel
    prophecy/   ProphecyEngine, ProphecyCard
    market/     ThesisMarket, ThesisCard
    score/      PrecursorScore
    footer/     Footer
  hooks/
    useScrambleText.js
    useCountUp.js
    useInView.js
  data/
    mockData.js
  styles/
    globals.css
  App.jsx
  main.jsx
```

## Flow

`hero` → `loading` (6s scan animation) → `report` (full intelligence report)

State managed in `App.jsx` via `const [view, setView] = useState('hero')`

## Design System

| Token           | Value                      |
|-----------------|----------------------------|
| `--bg-primary`  | `#050508`                  |
| `--bg-surface`  | `#0d0d14`                  |
| `--accent`      | `#6C63FF`                  |
| `--text-primary`| `#F0EFF8`                  |
| font-display    | Syne 700/800               |
| font-body       | DM Sans 300                |
| font-mono       | Syne Mono                  |

Built at **Build with Anakin Hackathon · Bangalore · May 10, 2026**
