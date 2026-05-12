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
      searchTypes: [{ "searchType": "PRODUCTS", "pagination": { "start": 1, "count": 1 } }]
    })
  });
  const data = await res.json();
  console.log("Data keys:", Object.keys(data));
  if (data.products) {
    console.log("Products type:", Array.isArray(data.products) ? "Array" : typeof data.products);
    if (!Array.isArray(data.products)) {
        console.log("Products keys:", Object.keys(data.products));
        if (data.products.results) {
             console.log("Results length:", data.products.results.length);
        }
    }
  }
}

testQuery("Wien");
