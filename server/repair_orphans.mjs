import { getDriver } from './dist/graph/service.js';
import { randomUUID } from 'node:crypto';

async function repair() {
  const driver = await getDriver();
  const session = driver.session();
  try {
    console.log('Repairing orphan nodes...');
    
    // 1. Create a "Recovered Data" source/collection
    const recoveryId = 'recovery-' + randomUUID();
    await session.run(`
      MERGE (s:Source {id: $id})
      ON CREATE SET s.filename = 'Recovered Data', s.type = 'system', s.processedAt = datetime(), s.status = 'Completed'
    `, { id: recoveryId });

    // 2. Link all entities that don't have a source
    const result = await session.run(`
      MATCH (e:Entity)
      WHERE NOT (e)<-[:EXTRACTED_ENTITY]-(:Source)
      MATCH (s:Source {id: $id})
      MERGE (s)-[:EXTRACTED_ENTITY]->(e)
      RETURN count(e) as count
    `, { id: recoveryId });

    console.log(`Linked ${result.records[0].get('count').toNumber()} orphan entities to 'Recovered Data'.`);

    // 3. Create a default "Global Collection" if none exist
    await session.run(`
      MERGE (c:Collection {name: 'General Intelligence'})
      ON CREATE SET c.id = $id, c.description = 'Automatically aggregated intelligence.', c.createdAt = datetime(), c.status = 'Active'
    `, { id: 'coll-' + randomUUID() });

  } catch (err) {
    console.error('Repair failed:', err);
  } finally {
    await session.close();
    await driver.close();
  }
}
repair();
