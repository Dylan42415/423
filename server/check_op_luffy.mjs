async function checkOnePieceLuffy() {
  const res = await fetch("http://localhost:8080/api/query/cypher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cypher: "MATCH (a:Entity {name: 'One Piece'})-[r]-(b:Entity {name: 'Monkey D. Luffy'}) RETURN type(r) as rel" })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.raw_results, null, 2));
}

checkOnePieceLuffy();
