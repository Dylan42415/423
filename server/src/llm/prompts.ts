/**
 * Prompt templates for LLM-driven extraction and reasoning tasks.
 * Structured to produce JSON output conforming to ExtractedGraphPayload.
 */

/**
 * System prompt for the entity/relationship extraction task.
 */
export const EXTRACTION_SYSTEM_PROMPT = `You are a knowledge graph extraction engine.
Your task is to extract structured entities and relationships from the provided text.
Always respond in valid JSON matching the exact schema specified.
Do not include any text outside the JSON object.
Be thorough — extract ALL entities and relationships you can identify.
Assign a strength score (0.0-1.0) to each relationship based on how explicitly it is stated.`;

/**
 * Build the user prompt for extraction given a text block.
 */
export function buildExtractionPrompt(text: string): string {
  return `Extract all entities and relationships from the following text.

Respond with a JSON object matching this exact schema:
{
  "entities": [
    { 
      "name": "string", 
      "type": "string (e.g. Person, Organization, Location, Event, Concept, Document)", 
      "confidence": 0.0-1.0,
      "attributes": { 
        "key": "value",
        "latitude": "number (optional)",
        "longitude": "number (optional)",
        "timestamp": "ISO8601 string (optional)"
      } 
    }
  ],
  "relationships": [
    { "source": "entity name", "target": "entity name", "type": "string (e.g. WORKS_FOR, LOCATED_IN, RELATED_TO)", "strength": 0.0-1.0 }
  ]
}

Rules:
- Entity names must be specific (e.g., use "Monkey D. Luffy" instead of "Protagonist" or "him").
- Resolve aliases: If a text says "Luffy" and later "the Captain", extract both as "Monkey D. Luffy".
- Entity confidence: 1.0 = explicitly named, 0.5 = ambiguous/implied, 0.1 = potential but uncertain
- Relationship types should be UPPERCASE_SNAKE_CASE (e.g., BORN_IN, DEFEATED, PART_OF).
- Strength 1.0 = explicitly stated, 0.5 = implied, 0.1 = weakly inferred
- Include ALL entities and their attributes mentioned, even minor ones.

TEXT:
"""
${text}
"""`;
}

/**
 * System prompt for the natural language to Cypher translation task.
 */
export const CYPHER_SYSTEM_PROMPT = `You are a Neo4j Cypher query generator for a multi-hop Graph-RAG system.
Given a natural language question and the graph schema, generate an optimized Cypher query that traverses the graph to find deep connections.

Guidelines:
1. Prioritize discovery: Find ALL entities related to the keywords. Use broad patterns like MATCH (n:Entity)-[r*1..2]-(m:Entity) WHERE n.name =~ '(?i)...' RETURN n, r, m LIMIT 100
2. Use shortestPath ONLY when the user asks for a specific connection between two known nodes.
3. Use case-insensitive fuzzy matching for names: n.name =~ '(?i).*keyword.*'
4. RETURN as much structured data as possible (nodes and relationships) so the analyst can see the full context.
5. ALWAYS respond in valid JSON with a single "cypher" field.`;

/**
 * Build the user prompt for NL-to-Cypher translation.
 */
export function buildCypherPrompt(
  question: string,
  schemaHint: string,
): string {
  return `Convert the following natural language question into a Cypher query.

Graph schema context:
${schemaHint}

Respond with JSON: { "cypher": "MATCH ... RETURN ..." }

Question: "${question}"`;
}

/**
 * System prompt for insight generation from graph query results.
 */
export const INSIGHT_SYSTEM_PROMPT = `You are an intelligence analyst generating insights from knowledge graph query results.
Summarize findings in clear, professional language.
Always respond in valid JSON matching the specified schema.

IMPORTANT: Use all the retrieved information, including relationships and neighbor entities, to provide a detailed and comprehensive answer.
Strict Grounding: Use ONLY the exact entity names provided in the graph results. DO NOT replace names with roles (e.g., do not use "Protagonist" if the node is "Monkey D. Luffy").
If the graph results show relationships, explicitly explain these connections in your answer. 
Do not give one-sentence answers if more context is available in the data.
Include a confidence score based on the strength of evidence found.`;

/**
 * Build the user prompt for generating a final insight response.
 */
export function buildInsightPrompt(
  question: string,
  graphResults: string,
): string {
  return `Based on the following knowledge graph query results, answer the user's question.

Respond with JSON matching this schema:
{
  "answer": "A clear, comprehensive answer based on the graph data",
  "graph_path": [
    { "nodes": ["id1", "id2"], "edges": ["RELATION_TYPE"] },
    { "nodes": ["id2", "id3"], "edges": ["ANOTHER_REL"] }
  ],
  "supporting_entities": ["entity1", "entity2", "entity3"],
  "confidence": 0.0-1.0,
  "visualization_hint": "graph | chart | map | timeline"
}

Note: Include ALL distinct paths found in the graph results in the graph_path array. Do not limit yourself to just 1 or 2 paths if more evidence is present.

User question: "${question}"

Graph results:
${graphResults}`;
}
