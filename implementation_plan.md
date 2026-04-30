# Implementation Plan — NEA Graph-RAG Intelligence System

This document outlines the final steps to transition the system from a template/prototype into a fully functional, production-ready intelligence platform.

## 1. Project Cleanup (Immediate Priority)
Remove all sample data and mock configurations introduced by the initial boilerplate.

### Actions:
- [ ] Migrate static configurations (like `uploadTypeConfigs`) from `client/src/mock/` to `client/src/constants/`.
- [ ] Refactor UI components (`Dashboard.tsx`, `Insights.tsx`, `UploadSources.tsx`) to remove hardcoded dependencies on mock data.
- [ ] Delete the `client/src/mock/` directory.

---

## 2. Multimodal Ingestion Pipeline (Completion)
Finalize the ingestion handlers to support all data types defined in the system specification.

### Actions:
- [ ] **Video Module**: Implement frame extraction and sequential vision analysis.
- [ ] **Geospatial Module**: Implement mapping of coordinates to Neo4j spatial types.
- [ ] **Time-series Module**: Implement temporal node sequencing.
- [ ] **Audio Validation**: Conduct end-to-end testing with real audio files.

---

## 3. Reasoning & Intelligence
Enhance the Graph-RAG capabilities.

### Actions:
- [ ] **Multi-hop Reasoning**: Implement iterative LLM-driven graph traversal in the query engine.
- [ ] **Confidence Scoring**: Transition from relationship-count heuristics to LLM-derived probability scoring.
- [ ] **Entity Resolution**: Implement semantic merging of nodes within the extraction service.

---

## 4. Final Verification
- [ ] Performance benchmarking of the Groq/Neo4j pipeline.
- [ ] Security audit (ensuring `AUTH_ENABLED` is correctly handled).
- [ ] Full end-to-end regression test with all multimodal sources.
