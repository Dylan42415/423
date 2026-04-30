async function checkProtagonist() {
  const res = await fetch("http://localhost:8080/api/query/cypher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cypher: "MATCH (n:Entity {name: 'Protagonist'}) RETURN n" })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.raw_results, null, 2));
}

checkProtagonist();
