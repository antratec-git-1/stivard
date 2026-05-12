const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY;
const VIATOR_BASE_URL = 'https://api.viator.com/partner';

async function testLoc() {
  const headers = { 'exp-api-key': VIATOR_API_KEY || '', 'Accept': 'application/json;version=2.0' };
  const res = await fetch(`${VIATOR_BASE_URL}/locations/488`, { headers });
  const data = await res.json();
  console.log(data);
}

testLoc();
