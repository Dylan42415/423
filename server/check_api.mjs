async function check() {
  const cypher = "MATCH (n:Entity)-[r]-(m) WHERE toLower(n.name) CONTAINS 'shanks' RETURN n.name, type(r), m.name";
  const res = await fetch('http://localhost:8080/api/query/cypher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cypher })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
check();
