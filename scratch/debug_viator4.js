const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY;
const VIATOR_BASE_URL = 'https://api.viator.com/partner';

async function testQuery(query) {
  const headers = {
    'exp-api-key': VIATOR_API_KEY || '',
    'Content-Type': 'application/json',
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'de-DE'
  };
  const res = await fetch(`${VIATOR_BASE_URL}/search/freetext`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      searchTerm: query,
      currency: "EUR",
      searchTypes: [{ "searchType": "PRODUCTS", "pagination": { "start": 1, "count": 3 } }]
    })
  });
  const data = await res.json();
  console.log(`Query: "${query}" -> Products found:`, data.products ? data.products.length : (data.message || data.error || "Undefined/Error"));
}

async function run() {
  await testQuery("Wien schloss");
  await testQuery("Vienna castle");
  await testQuery("Wien");
  await testQuery("Vienna");
  await testQuery("Bootstour");
  await testQuery("Schloss");
}
run();
