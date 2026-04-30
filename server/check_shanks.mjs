import { getDriver } from './dist/graph/service.js';
const driver = await getDriver();
const session = driver.session();
try {
  const res = await session.run("MATCH (n:Entity)-[r]-(m) WHERE toLower(n.name) CONTAINS 'shanks' RETURN n.name, type(r), m.name");
  console.log('Rows:', res.records.length);
  res.records.forEach(r => console.log(r.get(0), '->', r.get(1), '->', r.get(2)));
} finally {
  await session.close();
  await driver.close();
}
