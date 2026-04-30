import neo4j from 'neo4j-driver';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
dotenv.config();

async function repair() {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );
  const session = driver.session();
  try {
    console.log('Repairing orphan nodes...');
    const recoveryId = 'recovery-' + randomUUID();
    await session.run(`
      MERGE (s:Source {id: $id})
      ON CREATE SET s.filename = 'Recovered Data', s.type = 'system', s.processedAt = datetime(), s.status = 'Completed'
    `, { id: recoveryId });

    const result = await session.run(`
      MATCH (e:Entity)
      WHERE NOT (e)<-[:EXTRACTED_ENTITY]-(:Source)
      MATCH (s:Source {id: $id})
      MERGE (s)-[:EXTRACTED_ENTITY]->(e)
      RETURN count(e) as count
    `, { id: recoveryId });

    console.log(`Linked ${result.records[0].get('count').toNumber()} orphan entities to 'Recovered Data'.`);
  } catch (err) {
    console.error('Repair failed:', err);
  } finally {
    await session.close();
    await driver.close();
  }
}
repair();
