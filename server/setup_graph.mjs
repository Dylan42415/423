import neo4j from 'neo4j-driver';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

async function setup() {
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();
  try {
    console.log("Creating fulltext index...");
    await session.run(`
      CREATE FULLTEXT INDEX entityNameIndex IF NOT EXISTS 
      FOR (n:Entity) ON EACH [n.name]
    `);
    console.log("Index created successfully.");
  } catch (err) {
    console.error("Failed to create index:", err);
  } finally {
    await session.close();
    await driver.close();
  }
}

setup();
