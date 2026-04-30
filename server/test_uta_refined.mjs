async function testUtaQuery() {
  const res = await fetch("http://localhost:8080/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "uta" })
  });
  const data = await res.json();
  console.log("Answer:", data.answer);
  console.log("Paths:", JSON.stringify(data.graph_path, null, 2));
}

testUtaQuery();
