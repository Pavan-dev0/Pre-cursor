# PRECURSOR

**PRECURSOR** is an intelligence-backed discovery engine for startup ideas. It scans live web signals, extracts market structure from noisy source material, and turns that signal into investable theses and near-term prophecies.

Positioning:

> The world's first intelligence-backed market for undiscovered startup ideas.

Instead of asking users to trust isolated opinions, PRECURSOR builds a structured view from scraped source material across jobs, forums, startup media, launch platforms, and cultural language. The result is a research surface designed for founders, investors, operators, and judges who want to see the signal before the market narrative fully forms.

## Live Product

- Live website: `https://precursor077.vercel.app`
- Backend API: `https://pre-cursor-coar.vercel.app`

Public demo workflow:

1. Open the live website.
2. Press `Ctrl + D` to trigger the hidden demo shortcut.
3. PRECURSOR auto-fills `Bangalore B2B SaaS Ecosystem`.
4. The terminal-style loader plays for 6 seconds.
5. The report renders with:
   - consensus signals
   - contradictions
   - silence patterns
   - velocity map
   - cultural DNA
   - prophecy cards
   - thesis market output

## What PRECURSOR Does

PRECURSOR combines three layers:

- **Acquisition**: collects market evidence from high-signal web surfaces.
- **Interpretation**: detects patterns that only emerge across multiple sources.
- **Prediction**: converts those patterns into falsifiable near-term market prophecies.

The product is not a generic chatbot wrapper. It is a structured intelligence pipeline with explicit stages:

1. Generate a topic-specific source plan.
2. Scrape source pages through Anakin.
3. Normalize and filter the returned markdown.
4. Run the **Zeitgeist Engine** to extract cross-source intelligence.
5. Run the **Prophecy Engine** to produce forward-looking market calls.
6. Render the result as a cinematic research interface.

## Core Claims

- PRECURSOR is built to find **underserved startup opportunities**, not summarize articles.
- It focuses on **signal between sources**, not inside a single source.
- It is designed to reveal:
  - repeated demand
  - contradiction between market narratives
  - silence where demand exists but supply is missing
  - language shifts that often precede startup category formation

## Product Surface

The current frontend experience includes:

- a bold hero surface with topic input
- a hidden keyboard shortcut for demo activation
- a terminal-style scan animation with real source labels
- a report view with five structured sections
- prophecy cards with confidence scores
- a thesis market section for startup opportunity framing
- a score panel that turns the session into a quantified intelligence profile

## Research and Intelligence Design

PRECURSOR is intentionally built around the idea that market insight is not usually found in one perfect source. It appears when different source classes begin to rhyme:

- job boards reveal hiring pressure
- forums reveal operator pain
- startup media reveals narrative and funding bias
- launch platforms reveal what builders are shipping
- review-style sentiment reveals execution friction

The intelligence layer is meant to answer questions such as:

- What is the market confidently saying?
- What is the market saying in conflicting ways?
- What adjacent demand exists without direct supply?
- Which concepts are spreading faster than the category itself?
- What cultural language suggests a category is maturing?

## Architecture

### Frontend

- React 18
- Vite
- Framer Motion

Primary responsibilities:

- collect user topic input
- trigger a single backend run request
- animate the scan experience
- present the intelligence report safely with an error boundary

### Backend

- Node.js 20
- Express 4
- axios
- `@google/generative-ai`
- `cors`
- `dotenv`
- `express-rate-limit`

Primary responsibilities:

- source planning
- scraping orchestration
- result filtering
- Gemini-based analysis
- prophecy generation
- demo-mode fallback
- in-memory cache for repeated demo topics

### External Systems

- **Anakin API** for scraping live web pages
- **Gemini API** for structured intelligence generation
- **Vercel** for frontend hosting and backend serverless deployment

## Intelligence Pipeline

### 1. Source Planning

The backend generates a focused source plan from the topic. The current production flow uses 8 target URLs to keep the demo fast and visually coherent.

Current source classes:

- Reddit
- Hacker News
- Wellfound
- Naukri
- YourStory
- Inc42
- Product Hunt
- TechCrunch

### 2. Scraping

Anakin is used to fetch and normalize page content into markdown. The key stays server-side and never reaches the browser.

### 3. Zeitgeist Analysis

The **Zeitgeist Engine** produces structured intelligence in JSON:

- `consensus`
- `contradictions`
- `silenceSignals`
- `velocityData`
- `culturalDNA`
- `summary`

### 4. Prophecy Generation

The **Prophecy Engine** turns the analysis into three near-term market prophecies with:

- confidence
- statement
- evidence
- sources
- timeframe
- precursor type

## Demo Safety Features

The deployed demo includes a set of safeguards designed specifically for a live presentation:

- `DEMO_MODE=true` support for pre-cached scrape data
- `/api/run` single-call orchestration
- in-memory topic cache
- 6-second minimum loader animation for screen pacing
- hidden `Ctrl + D` shortcut for clean demo starts
- report-level error boundary to prevent a white-screen failure

These choices were deliberate. For live judging or video recording, reliability matters more than proving raw scrape latency on every run.

## Live Demo Instructions

### For a Viewer

1. Open `https://precursor077.vercel.app`
2. Type a market topic, or press `Ctrl + D`
3. Wait for the loader to complete
4. Review the structured report
5. Inspect the prophecy cards and thesis market

### Recommended Topic

For the best prepared demo path:

```txt
Bangalore B2B SaaS Ecosystem
```

### What a Viewer Should Notice

- the scan simulates a real intelligence terminal, not a generic spinner
- the report is segmented into specific analytical layers
- the product does not produce loose prose; it produces structure
- the final output looks more like an institutional research tool than a consumer chatbot

## Local Development

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend environment variables:

```bash
ANAKIN_API_KEY=your_anakin_key_here
GEMINI_API_KEY=your_gemini_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
DEMO_MODE=false
```

Optional:

```bash
GEMINI_MODEL=gemini-2.0-flash
```

### 2. Frontend

```bash
cd FRONT_END
npm install
npm run dev
```

Frontend environment variables:

```bash
VITE_API_URL=http://localhost:3001
```

### 3. Local Usage

1. Start backend on `http://localhost:3001`
2. Start frontend on `http://localhost:5173`
3. Open the app in the browser
4. Enter a topic or press `Ctrl + D`

## Local Verification

Run the backend full-flow script:

```bash
node backend/debug/testFullFlow.js
```

Useful debug scripts:

```bash
node backend/debug/testAnakin.js
node backend/debug/testGemini.js
node backend/debug/testFullFlow.js
```

## Deployment

PRECURSOR is deployed as **two Vercel projects** from the same GitHub repository.

### Frontend Vercel Project

- Root Directory: `FRONT_END`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Frontend environment variable:

```bash
VITE_API_URL=https://pre-cursor-coar.vercel.app
```

### Backend Vercel Project

- Root Directory: `backend`
- Framework Preset: `Other`

Backend environment variables:

```bash
ANAKIN_API_KEY=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
FRONTEND_URL=https://precursor077.vercel.app
DEMO_MODE=true
```

## API Overview

### Production Endpoint

```txt
POST /api/run
```

Request body:

```json
{
  "topic": "Bangalore B2B SaaS Ecosystem",
  "demoMode": true
}
```

Response shape:

```json
{
  "success": true,
  "topic": "Bangalore B2B SaaS Ecosystem",
  "sourcesAttempted": 19,
  "sourcesSucceeded": 19,
  "sources": [],
  "analysis": {
    "consensus": [],
    "contradictions": [],
    "silenceSignals": [],
    "velocityData": [],
    "culturalDNA": [],
    "summary": ""
  },
  "prophecies": [],
  "scannedAt": "2026-05-10T00:00:00.000Z"
}
```

Legacy endpoints remain available:

- `POST /api/scan`
- `POST /api/analyze`
- `POST /api/prophecy`

## Public Viewing Guide

If you are reviewing the project publicly, start with:

1. the live site
2. the hero input and demo shortcut
3. the report structure
4. the thesis and prophecy outputs
5. the deployment architecture

This helps viewers understand that PRECURSOR is both:

- a product experience
- and an intelligence system

## Screenshot Guidance

There are no committed screenshot assets in the repository yet. For a polished public README, add one or two images later under a path like:

```txt
docs/hero.png
docs/report.png
```

Suggested captures:

- **Hero screen** with the input and `SCAN` CTA
- **Report screen** showing consensus, prophecy cards, and thesis market in one frame

Then embed them in this README with:

```md
![PRECURSOR Hero](docs/hero.png)
![PRECURSOR Report](docs/report.png)
```

## Why This Matters

Most startup idea generation tools are shallow. They remix visible trends, summarize obvious themes, or produce founder-sounding copy with no market grounding.

PRECURSOR takes a different stance:

- scrape first
- structure second
- infer last

That sequence is what makes the output more defensible. It pushes the product toward real market intelligence rather than aesthetic speculation.

## Status

Current state:

- frontend deployed
- backend deployed
- single-call `/api/run` flow operational
- Vercel-connected architecture working
- demo-mode safety path active

## License

This project is currently shared for demonstration and evaluation purposes. Add an explicit production license if you plan to open-source it publicly.
