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
  console.log(`Query: "${query}" -> Data:`, JSON.stringify(data, null, 2));
}

testQuery("Wien bustour");
