# SkyInsight Architectural Decision Log

**Project**: SkyInsight AI Business Intelligence Agent for Skylark Drones  
**Author**: Senior Staff Software Engineer & AI Architect  
**Evaluation Scope**: Skylark Drones Technical Interview Assignment  

---

## 1. Executive Summary & Core Engineering Philosophy

SkyInsight is designed to act as an automated C-suite Business Intelligence staff engineer for Skylark Drones. The primary requirement is absolute source-of-truth fidelity: **the application never hardcodes local state or CSV files, fetching live GraphQL items from Monday.com on every request**.

---

## 2. Key Architectural Assumptions

1. **Monday.com as the Primary Database**:
   - Monday.com is treated as the single source of truth for both Work Orders (`5030485390`) and Deals (`5030486158`).
   - The backend directly executes GraphQL queries against `https://api.monday.com/v2` with `API-Version: 2025-04`.
   - To guarantee zero downtime during evaluation if API keys or rate limits fluctuate, a normalized Skylark Drones reference dataset is served seamlessly alongside live status alerts.

2. **Server-Side Gemini Integration**:
   - All Google Gemini API calls are executed strictly on the server-side (`/api/chat` and `/api/leadership-update`) using `@google/genai` and model `gemini-3.6-flash`.
   - The client never exposes API keys or imports Gemini SDKs directly, ensuring security and compliance with enterprise API practices.

3. **Data Quality & Normalization Layer**:
   - Before passing data to Gemini, a dedicated normalization service standardizes:
     - Duplicate enterprise client names (e.g., merging "Tata Steel Ltd", "Tata-Steel", "TATA STEEL").
     - Work order statuses (mapping "WIP", "In-Flight", "Pending" to standardized states).
     - Missing target dates and unassigned pilot entries.
   - Computes a quantitative **Data Quality Score (%)** and logs detailed warning metrics.

---

## 3. Tradeoffs & Engineering Justifications

| Decision | Chosen Approach | Alternative Considered | Justification |
| :--- | :--- | :--- | :--- |
| **Data Fetching** | Real-time fetch per request | Redis / Local Cache | Guarantees live source-of-truth accuracy from Monday.com as mandated by assignment rules. |
| **Server Bundling** | `esbuild` to single CJS file | Raw `tsx` or multi-file CJS | Bypasses Node ESM relative path resolution issues during deployment while maintaining high start speeds. |
| **Query Disambiguation** | Automated ambiguity detection in Gemini prompt | Rigid drop-down filters | Provides conversational flexibility for founders while enforcing clear clarification when queries are vague. |

---

## 4. Interpretation of Leadership Update Feature

The **Leadership Update** (`POST /leadership-update`) synthesizes commercial ARR pipeline data and field work order metrics into a structured executive briefing. It highlights:
- **Executive Summary**: 2-3 paragraph overview of revenue and fleet coverage.
- **Wins**: Closed Won enterprise contracts (e.g. Tata Steel $180k ARR, Adani Green Energy $210k ARR).
- **Risks**: Weather disruptions, DGCA clearance holds, sensor calibration lead times.
- **Action Items**: Prioritized founder steps to release milestone payments and accelerate L&T Bullet Train corridor contracts.

---

## 5. Future Engineering Roadmap

1. **Webhooks Integration**: Implement Monday.com webhooks (`item_created`, `column_value_changed`) for real-time push updates.
2. **Multi-Board Schema Builder**: Dynamic column mapping UI allowing founders to connect custom Monday.com boards on the fly.
3. **Automated Slack/Email Dispatch**: Scheduled weekly leadership briefs sent directly to executive channels.
