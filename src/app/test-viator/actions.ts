"use server";

export async function testViatorConnection() {
  const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY || process.env.VIATOR_API_KEY;
  const VIATOR_BASE_URL = 'https://api.viator.com/partner';

  if (!VIATOR_API_KEY) throw new Error("Key fehlt!");

  try {
    const response = await fetch(`${VIATOR_BASE_URL}/products/tags`, {
      method: 'GET',
      headers: {
        'exp-api-key': VIATOR_API_KEY,
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'de-DE'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, status: response.status, message: errorData.message || response.statusText };
    }

    return { success: true, status: 200 };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function searchViatorAction(query: string) {
  const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY || process.env.VIATOR_API_KEY;
  const VIATOR_BASE_URL = 'https://api.viator.com/partner';

  if (!VIATOR_API_KEY) throw new Error("Key fehlt!");

  const commonHeaders = {
    'exp-api-key': VIATOR_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'de-DE'
  };

  try {
    const response = await fetch(`${VIATOR_BASE_URL}/search/freetext`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({
        searchTerm: query,
        currency: 'EUR',
        searchTypes: [
          {
            "searchType": "PRODUCTS", // Focused only on Products as requested by the API
            "pagination": {
              "start": 1,
              "count": 15
            }
          }
        ]
      }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || data.error || (data.errors ? JSON.stringify(data.errors) : "API Error");
      throw new Error(`Viator [${response.status}]: ${errorMsg}`);
    }

    return data;
  } catch (error: any) {
    console.error("Server Action Error:", error);
    throw new Error(error.message || "Fehler bei der Kommunikation mit Viator");
  }
}

export async function getViatorProductLocationAction(productCode: string) {
  const VIATOR_API_KEY = process.env.NEXT_PUBLIC_VIATOR_API_KEY || process.env.VIATOR_API_KEY;
  const VIATOR_BASE_URL = 'https://api.viator.com/partner';

  if (!VIATOR_API_KEY) throw new Error("Key fehlt!");

  const headers = {
    'exp-api-key': VIATOR_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'de-DE'
  };

  try {
    // 1. Fetch Product Details for Logistics
    const prodRes = await fetch(`${VIATOR_BASE_URL}/products/${productCode}`, { headers, cache: 'no-store' });
    const prodData = await prodRes.json();
    
    if (!prodRes.ok) throw new Error("Fehler beim Laden der Produktdetails.");

    const startRef = prodData.logistics?.start?.[0]?.location?.ref;
    
    if (!startRef || !startRef.startsWith('LOC-')) {
      // Fallback if there is no precise GPS location ref
      const description = prodData.logistics?.start?.[0]?.description;
      return { 
        name: description ? "Details auf Voucher" : "Treffpunkt auf dem Ticket", 
        lat: null, 
        lng: null, 
        address: description ? description.substring(0, 100) + '...' : "" 
      };
    }

    // 2. Fetch Location Details
    const locRes = await fetch(`${VIATOR_BASE_URL}/locations/${startRef}`, { headers, cache: 'no-store' });
    const locData = await locRes.json();

    if (!locRes.ok) throw new Error("Fehler beim Laden der Standortdetails.");

    // Build the address string
    let addressName = locData.name || '';
    if (locData.address) {
      const parts = [locData.address.street, locData.address.city].filter(Boolean);
      if (parts.length > 0) {
        addressName = addressName ? `${addressName}, ${parts.join(', ')}` : parts.join(', ');
      }
    }

    return {
      name: addressName || "Unbekannter Ort",
      lat: locData.center?.latitude || null,
      lng: locData.center?.longitude || null,
      address: addressName
    };
  } catch (error) {
    console.error("Failed to fetch Viator location:", error);
    return null;
  }
}
