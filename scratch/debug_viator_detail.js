const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY;
const VIATOR_BASE_URL = 'https://api.viator.com/partner';

async function testDetail() {
  const headers = {
    'exp-api-key': VIATOR_API_KEY || '',
    'Content-Type': 'application/json',
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'de-DE'
  };
  
  // First search to get a productCode
  const res = await fetch(`${VIATOR_BASE_URL}/search/freetext`, {
    method: 'POST', headers,
    body: JSON.stringify({ searchTerm: "Berlin Bootstour", currency: "EUR", searchTypes: [{ searchType: "PRODUCTS", pagination: { start: 1, count: 1 } }] })
  });
  const data = await res.json();
  const productCode = data.products?.results?.[0]?.productCode;
  
  if (!productCode) { console.log("No product found"); return; }
  console.log("Fetching details for:", productCode);
  
  // Get product details
  const detailRes = await fetch(`${VIATOR_BASE_URL}/products/${productCode}`, { headers });
  const detailData = await detailRes.json();
  
  console.log("Logistics info:", JSON.stringify(detailData.logistics, null, 2));
}

testDetail();
