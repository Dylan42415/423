# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Products

### Graph RAG Intelligence Platform (`artifacts/graph-rag-ui`)
A full enterprise frontend UI shell for a Multimodal Graph-RAG Intelligence Platform. Pure frontend, no backend. All mock data lives in `src/mock/mockData.ts`. Designed for future integration with Neo4j, Graph-RAG, and multimodal ingestion backends.

**Pages:**
- `/` — Dashboard (metrics, recent uploads, recent queries)
- `/upload` — File Upload (drag-and-drop, 8 upload type cards, upload queue)
- `/pipeline` — Processing Pipeline (animated stage progress per file)
- `/collections` — Data Collections (categorized collection cards)
- `/query` — Query Workspace (natural language + Cypher editor, results panel)
- `/graph` — Knowledge Graph Explorer (animated SVG graph, `GraphCanvasPlaceholder` component)
- `/insights` — Insights & Infographics (charts, KPIs, anomaly alerts)

**Component architecture:** `src/components/layout/`, `src/components/`, `src/pages/`, `src/mock/`, `src/types/`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
