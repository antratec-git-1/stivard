const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY;
const VIATOR_BASE_URL = 'https://api.viator.com/partner';

async function debugViator() {
  console.log("Checking Viator with key:", VIATOR_API_KEY?.substring(0, 5) + "...");
  
  const headers = {
    'exp-api-key': VIATOR_API_KEY || '',
    'Content-Type': 'application/json',
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'de-DE'
  };

  try {
    // 1. Try a very simple destination lookup
    console.log("\n--- Testing Location Search (Berlin) ---");
    const locRes = await fetch(`${VIATOR_BASE_URL}/locations/suggest?text=Berlin`, { headers });
    const locData = await locRes.json();
    console.log("Location Data:", JSON.stringify(locData, null, 2));

    // 2. Try the freetext search
    console.log("\n--- Testing Freetext Search (Berlin) ---");
    const freeRes = await fetch(`${VIATOR_BASE_URL}/search/freetext`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        searchTerm: "Berlin",
        currency: "EUR",
        searchTypes: [{ "searchType": "PRODUCTS", "pagination": { "start": 1, "count": 3 } }]
      })
    });
    const freeData = await freeRes.json();
    console.log("Freetext Data:", JSON.stringify(freeData, null, 2));

  } catch (err) {
    console.error("Debug Error:", err);
  }
}

debugViator();
