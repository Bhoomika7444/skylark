# SkyInsight - AI Business Intelligence Agent for Skylark Drones

**SkyInsight** is a production-grade AI Business Intelligence Agent built for Skylark Drones to answer founder-level business questions dynamically by fetching live data from **Monday.com GraphQL API** and analyzing it via **Google Gemini AI**.

---

## Architecture Overview

```
[ Frontend (React + Vite + TailwindCSS + React Query) ]
                       │
                       ▼ HTTP REST API
[ Full-Stack Express + Node.js Backend Server ]
        │                                  │
        ▼ GraphQL                          ▼ @google/genai SDK
[ Monday.com API v2 ]               [ Google Gemini 3.6 Flash ]
  (Work Orders & Deals)               (Business Intelligence Analysis)
```

1. **Frontend**: Built with React 19, Vite, TypeScript, TailwindCSS, and TanStack React Query. Provides a SaaS executive dashboard, interactive chat interface, ambiguity clarification prompts, live metrics, and leadership report generation.
2. **Backend**: Express on Node.js running TypeScript directly via `tsx` in dev and bundled using `esbuild` for production.
3. **Monday.com GraphQL Integration**: Connects directly to Monday.com GraphQL endpoint (`https://api.monday.com/v2`) using `API-Version: 2025-04` and fetching Work Order (`5030485390`) and Deals (`5030486158`) boards dynamically every request.
4. **Data Normalization Engine**: Pre-processes raw Monday items by normalizing nulls, empty strings, date formats, client name duplicates (e.g. "Tata Steel Ltd" -> "Tata Steel"), work order statuses, and tracking data quality warnings.
5. **AI Business Intelligence Engine**: Leverages `@google/genai` with model `gemini-3.6-flash` and strict JSON schemas to deliver structured Executive Summaries, Key Insights, Risks & Blockers, Recommendations, and Confidence Levels.

---

## Mandatory Tech Stack

- **Frontend**: React, Vite, TypeScript, TailwindCSS, React Query, Axios, Lucide React
- **Backend**: Node.js, Express, TypeScript, Esbuild
- **AI**: Google Gemini API (`gemini-3.6-flash`)
- **Database**: Monday.com GraphQL API (No MongoDB, No PostgreSQL, No Firebase, No Supabase, No Redis)

---

## Environment Variables Configuration

All variables are defined in `.env.example`:

```env
PORT=3000
MONDAY_API_KEY=your_monday_api_key_here
MONDAY_API_VERSION=2025-04
WORK_ORDER_BOARD_ID=5030485390
DEALS_BOARD_ID=5030486158
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=https://your-service.run.app
```

---

## Local Setup & Running Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application runs locally on `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Run Production Server**:
   ```bash
   npm run start
   ```

---

## Backend APIs

- `GET /health` - System health, Monday.com connection state, board metadata
- `GET /boards` - Raw & normalized boards overview
- `GET /work-orders` - Normalized Work Orders board items + data quality report
- `GET /deals` - Normalized Deals board items + data quality report
- `POST /chat` - Process founder BI questions via Gemini + Monday data
- `POST /leadership-update` - Generate C-suite leadership report

---

## Deployment Strategy

- **Frontend**: Standard static SPA build output in `dist/` deployable to **Vercel** or **Cloud Run**.
- **Backend**: Single CJS server bundle (`dist/server.cjs`) generated via `esbuild` deployable to **Render** or **Cloud Run**.

---

## Key Tradeoffs & Future Improvements

1. **Caching & Rate Limiting**: Currently fetches live Monday.com GraphQL data on every query to guarantee source-of-truth accuracy. In high-traffic scenarios, in-memory caching with a short TTL (e.g. 60s) could reduce Monday GraphQL rate limits.
2. **Field ID Mapping**: Normalizes board columns dynamically by title matching. Adding explicit custom column ID mapping UI could support arbitrary custom Monday.com board structures.
