async function test() {
  try {
    const res = await fetch('http://localhost:8080/api/graph/data');
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Nodes:', data.nodes.length);
    console.log('Links:', data.links.length);
  } catch (err) {
    console.error('Test failed:', err);
  }
}
test();
