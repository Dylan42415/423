# Tasks

## Phase 1: Project Cleanup
- [x] Update `UploadSources.tsx` to remove dependency on `mockUploadTypes.ts`
- [x] Update other UI components using mocks (Insights, Graph views)
- [x] Delete `client/src/mock/` directory

## Phase 2: Multimodal Ingestion (Completion)
- [x] Validate Image Ingestion
- [ ] Validate Audio Ingestion
- [x] Implement Video Ingestion (Keyframe extraction)
- [x] Implement Geospatial Handler
- [x] Implement Time-series Handler

## Phase 3: Intelligence & Reasoning
- [x] Refine Confidence Scoring (LLM-based)
- [x] Implement Multi-hop Reasoning in Query Engine
- [x] Add entity resolution logic

## Phase 4: Final Validation
- [ ] End-to-end multimodal test
- [ ] Performance check (Groq/Neo4j latency)
