import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialisiere Gemini mit dem Key aus .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function geocode(locationName: string | null) {
  if (!locationName || !process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(locationName)}&inputtype=textquery&fields=geometry,place_id,name&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.candidates && data.candidates[0]) {
      return {
        lat: data.candidates[0].geometry.location.lat,
        lng: data.candidates[0].geometry.location.lng,
        place_id: data.candidates[0].place_id,
        formatted_name: data.candidates[0].name
      };
    }
  } catch (e) {
    console.error("Geocoding failed for:", locationName, e);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { text, imageBase64, mimeType = "image/jpeg" } = await req.json();
    
    if (!text && !imageBase64) {
      return NextResponse.json({ error: "Weder Text noch Bild gefunden." }, { status: 400 });
    }

    // Wir nutzen gemini-2.5-flash, da es laut deiner API-Modelliste verfügbar ist
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      // Wir zwingen die KI, IMMER gültiges JSON auszugeben!
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Du bist ein intelligenter Reiseassistent. Extrahiere die Reisedaten aus dem bereitgestellten Text oder dem Ticket-Bild.
Aktuelles Datum: 15.05.2026. Beachte dies bei relativen Angaben wie "morgen".
WICHTIG: Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt.

Regeln für Felder:
- "type": Muss IMMER exakt "booked" sein.
- "category": Muss EXAKT einer dieser Werte sein: "hotel", "activity", "food", "transport", "leisure", "car_rental", "gem", "ai_slot".
- "title": Ein knackiger Titel (z.B. "Guruwalks Stadttour").
- "start_time": ISO8601 Format. Wenn nur eine Uhrzeit (z.B. 14:15) und ein Datum gegeben sind, kombiniere sie korrekt.
- "end_time": ISO8601 Format (falls Endzeitpunkt wie 16:15 gegeben).

JSON-Schema:
{
  "type": string,
  "category": string,
  "title": string,
  "start_time": string,
  "end_time": string | null,
  "start_location_name": string | null,
  "end_location_name": string | null,
  "description": string | null
}

Hier ist der zu analysierende Text:
${text || "[Kein Text, siehe Bild]"}
`;

    let result;
    
    if (imageBase64) {
      // Wenn ein Bild mitgeschickt wurde (Ticket-Scan)
      const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
      const parts = [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ];
      result = await model.generateContent(parts);
    } else {
      // Wenn nur Text geschickt wurde
      result = await model.generateContent(prompt);
    }

    let responseText = result.response.text();
    
    // Bereinige Markdown-Codeblöcke, falls die KI sie trotz responseMimeType mitschickt
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const json = JSON.parse(responseText);
    console.log("Magic Import AI Result:", json);

    // NEU: Geocoding für die gefundenen Orte
    if (json.start_location_name) {
      const geo = await geocode(json.start_location_name);
      if (geo) {
        json.start_location_lat = geo.lat;
        json.start_location_lng = geo.lng;
        json.place_id = geo.place_id;
        // Optional: Name durch den von Google formatierten Namen ersetzen
        json.start_location_name = geo.formatted_name;
      }
    }

    if (json.end_location_name) {
      const geo = await geocode(json.end_location_name);
      if (geo) {
        json.end_location_lat = geo.lat;
        json.end_location_lng = geo.lng;
      }
    }

    return NextResponse.json(json);

  } catch (error: any) {
    console.error("Magic Import Error:", error);
    return NextResponse.json({ error: error.message || "Fehler bei der KI-Verarbeitung." }, { status: 500 });
  }
}
