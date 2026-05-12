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
