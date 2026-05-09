import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const radius = searchParams.get('radius');
  const type = searchParams.get('type');
  const photo_reference = searchParams.get('photo_reference');
  const place_id = searchParams.get('place_id');
  
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  // DEBUG LOGS FOR VERCEL
  console.log('--- API PROXY DEBUG ---');
  console.log('API_KEY exists:', !!API_KEY);
  console.log('Query Params:', { location, radius, type, photo_id: !!photo_reference, place_id });

  if (!API_KEY) {
    console.error('ERROR: NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is missing in environment variables');
    return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
  }

  try {
    // 1. Handle Photo Request
    if (photo_reference) {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo_reference}&key=${API_KEY}`;
      const res = await fetch(photoUrl);
      
      if (!res.ok) {
        console.error('Google Photo API Error:', res.status, res.statusText);
      }
      
      const blob = await res.blob();
      return new NextResponse(blob, {
        headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // 2. Handle Details Request
    if (place_id) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&language=de&key=${API_KEY}`;
      const res = await fetch(detailsUrl);
      const data = await res.json();
      
      if (data.status !== 'OK') {
        console.error('Google Details API Status:', data.status, data.error_message);
      }
      
      return NextResponse.json(data);
    }

    // 3. Handle Nearby Search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&language=de&key=${API_KEY}`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Search API Status:', data.status, data.error_message);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Exception:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
