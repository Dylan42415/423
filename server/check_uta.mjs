async function checkUta() {
  const res = await fetch("http://localhost:8080/api/query/cypher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cypher: "MATCH (n:Entity)-[r]-(m) WHERE n.name =~ '(?i)uta.*' OR m.name =~ '(?i)uta.*' RETURN n.name as start, type(r) as rel, m.name as end" })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.raw_results, null, 2));
}

checkUta();
