/**
 * Neo4j Graph Service — Manages connections and Cypher execution against Neo4j.
 */

import { logger } from "../lib/logger";
import { config } from "../config";
import type {
  ExtractedGraphPayload,
  ExtractedEntity,
  ExtractedRelationship,
  GraphInsertionResult,
} from "../types";

/**
 * Dynamically import neo4j-driver to avoid hard crashes if not installed.
 */
let driverInstance: any = null;

async function getDriver() {
  if (driverInstance) return driverInstance;

  try {
    const neo4j = await import("neo4j-driver");
    const neo4jLib = neo4j.default;
    driverInstance = neo4jLib.driver(
      config.neo4j.uri,
      neo4jLib.auth.basic(config.neo4j.username, config.neo4j.password),
    );
    logger.info({ uri: config.neo4j.uri }, "Neo4j driver initialized");
    return driverInstance;
  } catch (err) {
    logger.error({ err }, "Failed to initialize Neo4j driver");
    throw new Error("Neo4j driver not available. Install neo4j-driver package.");
  }
}

/**
 * Attempt to resolve a name to an existing entity to prevent duplicates.
 */
async function resolveEntityName(name: string, session: any): Promise<string> {
  try {
    // Try fulltext search first (if index exists)
    const res = await session.run(
      `CALL db.index.fulltext.queryNodes("entityNameIndex", $query) YIELD node, score
       WHERE score > 0.9
       RETURN node.name as resolvedName LIMIT 1`,
      { query: `${name}~` } // Tilde for fuzzy matching
    );
    return res.records[0]?.get("resolvedName") ?? name;
  } catch (err) {
    // Fallback to exact match if index not ready
    return name;
  }
}

/**
 * Insert an ExtractedGraphPayload into Neo4j.
 * Uses MERGE and resolution logic to avoid duplicates.
 */
export async function insertPayload(
  payload: ExtractedGraphPayload,
): Promise<GraphInsertionResult> {
  const driver = await getDriver();
  const session = driver.session();

  let nodesCreated = 0;
  let relationshipsCreated = 0;
  const errors: string[] = [];

  try {
    // Insert Source node for metadata tracking
    await session.run(
      `MERGE (s:Source {id: $sourceId})
       ON CREATE SET s.filename = $filename, s.type = $type, s.processedAt = datetime(), s.status = 'Completed'
       ON MATCH SET s.processedAt = datetime(), s.status = 'Completed'`,
      {
        sourceId: payload.metadata.sourceId,
        filename: payload.metadata.filename ?? "unknown",
        type: payload.metadata.sourceType ?? "unknown",
      },
    );

    // Resolution map to keep track of renamed entities in this batch
    const resolutionMap = new Map<string, string>();

    // Insert entities
    for (const entity of payload.entities) {
      try {
        const resolvedName = await resolveEntityName(entity.name, session);
        resolutionMap.set(entity.name, resolvedName);

        // Detect and format geospatial points if present in attributes
        let pointCypher = "";
        const lat = entity.attributes.latitude ?? entity.attributes.lat;
        const lng = entity.attributes.longitude ?? entity.attributes.lng ?? entity.attributes.lon;

        if (lat !== undefined && lng !== undefined) {
          pointCypher = ", e.location = point({latitude: $lat, longitude: $lng})";
        }

        await session.run(
          `MERGE (e:Entity {name: $name})
           ON CREATE SET e.type = $type, e.sourceId = $sourceId, e.createdAt = datetime(), e.attributes = $attributes ${pointCypher}
           ON MATCH SET e.sourceId = $sourceId, e.attributes = $attributes ${pointCypher}`,
          {
            name: resolvedName,
            type: entity.type,
            attributes: typeof entity.attributes === 'string' ? entity.attributes : JSON.stringify(entity.attributes || {}),
            sourceId: payload.metadata.sourceId,
            lat: Number(lat),
            lng: Number(lng),
          },
        );
        // Link entity to its source
        await session.run(
          `MATCH (e:Entity {name: $name})
           MATCH (s:Source {id: $sourceId})
           MERGE (s)-[:EXTRACTED_ENTITY]->(e)`,
          { name: resolvedName, sourceId: payload.metadata.sourceId }
        );
        nodesCreated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Entity "${entity.name}": ${msg}`);
        logger.warn({ entity: entity.name, err }, "Failed to insert entity");
      }
    }

    // Insert relationships
    for (const rel of payload.relationships) {
      try {
        const resolvedSource = resolutionMap.get(rel.source) ?? rel.source;
        const resolvedTarget = resolutionMap.get(rel.target) ?? rel.target;

        await session.run(
          `MATCH (s:Entity {name: $source})
           MATCH (t:Entity {name: $target})
           MERGE (s)-[r:${sanitizeRelType(rel.type)}]->(t)
           ON CREATE SET r.strength = $strength, r.sourceId = $sourceId, r.createdAt = datetime()`,
          {
            source: resolvedSource,
            target: resolvedTarget,
            strength: rel.strength,
            sourceId: payload.metadata.sourceId,
          },
        );
        relationshipsCreated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Relationship "${rel.source}" -> "${rel.target}": ${msg}`);
        logger.warn({ rel, err }, "Failed to insert relationship");
      }
    }

    logger.info(
      { nodesCreated, relationshipsCreated, errors: errors.length },
      "Graph insertion complete",
    );

    return {
      success: errors.length === 0,
      nodesCreated,
      relationshipsCreated,
      ...(errors.length > 0 && { errors }),
    };
  } finally {
    await session.close();
  }
}

/**
 * Execute a raw Cypher query and return results.
 */
export async function runCypher(
  cypher: string,
  params: Record<string, unknown> = {},
): Promise<any[]> {
  const driver = await getDriver();
  const session = driver.session();

  try {
    logger.info({ cypher: cypher.slice(0, 200) }, "Executing Cypher query");
    const result = await session.run(cypher, params);
    const neo4j = await import("neo4j-driver");
    const neo4jLib = neo4j.default;

    return result.records.map((record: any) => {
      const obj = record.toObject();

      const processValue = (val: any): any => {
        if (neo4jLib.isInt(val)) {
          return val.toNumber();
        }
        if (Array.isArray(val)) {
          return val.map(processValue);
        }
        if (val && typeof val === "object") {
          // If it's a standard JS object, recurse
          if (val.constructor && val.constructor.name === 'Object') {
            const newObj: any = {};
            for (const k in val) {
              newObj[k] = processValue(val[k]);
            }
            return newObj;
          }
        }
        return val;
      };

      for (const key in obj) {
        obj[key] = processValue(obj[key]);
      }
      return obj;
    });
  } finally {
    await session.close();
  }
}

/**
 * Get aggregated graph statistics.
 */
export async function getGraphStats() {
  const driver = await getDriver();
  const session = driver.session();
  try {
    const res = await session.run(`
      OPTIONAL MATCH (n:Entity) WITH count(n) as entityCount
      OPTIONAL MATCH ()-[r:!EXTRACTED_ENTITY]->() WITH entityCount, count(r) as relationshipCount
      OPTIONAL MATCH (s:Source) WITH entityCount, relationshipCount, count(s) as totalFiles
      RETURN entityCount, relationshipCount, totalFiles
    `);
    const record = res.records[0];
    return {
      entityCount: record?.get("entityCount")?.toNumber() ?? 0,
      relationshipCount: record?.get("relationshipCount")?.toNumber() ?? 0,
      totalFiles: record?.get("totalFiles")?.toNumber() ?? 0,
      activeJobs: 0,
    };
  } finally {
    await session.close();
  }
}

/**
 * Get all processed sources (Collections).
 */
export async function getSources() {
  const driver = await getDriver();
  const session = driver.session();
  try {
    const res = await session.run(`
      MATCH (s:Source)
      OPTIONAL MATCH (s)-[:EXTRACTED_ENTITY]->(e:Entity)
      OPTIONAL MATCH (e)-[r]->()
      WITH s, count(DISTINCT e) as entityCount, count(DISTINCT r) as relationshipCount
      RETURN s.id as id, 
             s.filename as fileName, 
             s.type as type, 
             s.status as status, 
             toString(s.processedAt) as timestamp,
             entityCount,
             relationshipCount
      ORDER BY s.processedAt DESC
    `);
    return res.records.map((r) => {
      const obj = r.toObject();
      return {
        ...obj,
        entityCount: obj.entityCount?.toNumber() ?? 0,
        relationshipCount: obj.relationshipCount?.toNumber() ?? 0,
      };
    });
  } finally {
    await session.close();
  }
}

/**
 * Get the full graph for visualization.
 */
export async function getFullGraph() {
  const driver = await getDriver();
  const session = driver.session();
  try {
    const res = await session.run(`
      MATCH (n:Entity)
      OPTIONAL MATCH (n)-[r]->(m:Entity)
      RETURN collect(DISTINCT n) as nodes, collect(DISTINCT r) as rels
    `);
    const record = res.records[0];
    const nodes = record.get("nodes").map((n: any) => ({
      id: n.identity.toString(),
      name: n.properties.name,
      type: n.properties.type || "Unknown",
      properties: n.properties,
    }));
    const links = record.get("rels")
      .filter((r: any) => r !== null)
      .map((r: any) => ({
        id: r.identity.toString(),
        source: r.start.toString(),
        target: r.end.toString(),
        type: r.type,
      }));
    return { nodes, links };
  } finally {
    await session.close();
  }
}

/**
 * Get the current graph schema summary (node labels + relationship types).
 */
export async function getSchemaHint(): Promise<string> {
  const driver = await getDriver();
  const session = driver.session();

  try {
    const labelsResult = await session.run(
      "CALL db.labels() YIELD label RETURN collect(label) AS labels",
    );
    const relsResult = await session.run(
      "CALL db.relationshipTypes() YIELD relationshipType RETURN collect(relationshipType) AS types",
    );

    const labels = labelsResult.records[0]?.get("labels") ?? [];
    const relTypes = relsResult.records[0]?.get("types") ?? [];

    return `Node labels: ${labels.join(", ")}\nRelationship types: ${relTypes.join(", ")}`;
  } finally {
    await session.close();
  }
}

/**
 * Check Neo4j connectivity.
 */
export async function checkHealth(): Promise<{
  status: "ok" | "error";
  error?: string;
}> {
  try {
    const driver = await getDriver();
    await driver.verifyConnectivity();
    return { status: "ok" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: "error", error: message };
  }
}

/**
 * Close the Neo4j driver connection.
 */
export async function close(): Promise<void> {
  if (driverInstance) {
    await driverInstance.close();
    driverInstance = null;
    logger.info("Neo4j driver closed");
  }
}

/**
 * Sanitize relationship type names for Cypher safety.
 */
function sanitizeRelType(type: string): string {
  return type.replace(/[^A-Z0-9_]/gi, "_").toUpperCase();
}
