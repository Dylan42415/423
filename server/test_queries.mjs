async function testQuery() {
  try {
    const res = await fetch("http://localhost:8080/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Who are the entities in the graph?" })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

async function testCypher() {
  const res = await fetch("http://localhost:8080/api/query/cypher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cypher: "MATCH (n:Entity) RETURN n LIMIT 5" })
  });
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Response:", JSON.stringify(data, null, 2));
}

async function run() {
  console.log("Testing NL Query...");
  await testQuery();
  console.log("\nTesting Cypher Query...");
  await testCypher();
}

run();
