import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return NextResponse.json({ error: "Missing API Key" }, { status: 400 });
  }

  // FALL 1: Photo-Abfrage
  const photoReference = searchParams.get('photo_reference');
  if (photoReference) {
    try {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;
      const response = await fetch(photoUrl);
      
      if (!response.ok) throw new Error("Failed to fetch photo");

      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (error) {
      return NextResponse.json({ error: "Photo fetch failed" }, { status: 500 });
    }
  }

  // FALL 2: Place Details Abfrage
  const placeId = searchParams.get('place_id');
  if (placeId) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,formatted_phone_number,opening_hours,website,editorial_summary&key=${apiKey}&language=de`;
      const response = await fetch(url);
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: "Details fetch failed" }, { status: 500 });
    }
  }

  // FALL 3: Nearby Search (Standard)
  const location = searchParams.get('location') || "50.7753,6.0839";
  const radius = searchParams.get('radius') || "1000";
  const type = searchParams.get('type') || "tourist_attraction";

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}&language=de`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from Google" }, { status: 500 });
  }
}
