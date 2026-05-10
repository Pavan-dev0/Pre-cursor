# PRECURSOR

Precursor is a market-intelligence product that scrapes live web sources around a startup theme, synthesizes cross-source patterns with the Zeitgeist Engine, and generates near-term prophecy cards from those signals. The frontend presents the result as a cinematic research surface while the backend keeps scraping and model orchestration secure and production-ready.

## How Anakin Is Used

Anakin is in the critical path for every scan. The backend generates a multi-source URL plan for the requested topic, calls the real Anakin scraping API in parallel, normalizes the returned markdown, filters low-signal results, and then passes the surviving source set into the Zeitgeist analysis and prophecy generation pipeline. The Anakin API key never ships to the browser; it only exists in backend environment variables.

## Live Demo

Pending deployment. Add your deployed frontend URL here before submission.

## Tech Stack

- Frontend: React, Vite, Framer Motion
- Backend: Node.js 20, Express 4, axios, @google/generative-ai, cors, dotenv, express-rate-limit
- Deployment: Vercel Serverless Functions
- Scraping: Anakin API

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Set:

```bash
ANAKIN_API_KEY=your_anakin_api_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
PORT=3001
```

Install and run:

```bash
npm install
npm run dev
```

### 2. Frontend

```bash
cd FRONT_END
```

Create `.env` with:

```bash
VITE_API_URL=http://localhost:3001
```

Then run:

```bash
npm install
npm run dev
```

### 3. End-to-End Flow

1. Start the backend on `http://localhost:3001`
2. Start the frontend on `http://localhost:5173`
3. Enter a topic such as `B2B SaaS Bangalore`
4. The frontend will call:
   - `POST /api/scan`
   - `POST /api/analyze`
   - `POST /api/prophecy`

## Deployment Notes

Backend Vercel environment variables:

```bash
ANAKIN_API_KEY=...
GEMINI_API_KEY=...
FRONTEND_URL=https://your-frontend.vercel.app
```

Frontend Vercel environment variable:

```bash
VITE_API_URL=https://your-backend.vercel.app
```

Deploy with Vercel from the frontend and backend directories, or connect the repo to the Vercel dashboard for auto-deploys.
