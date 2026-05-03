import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const maxDuration = 30; // 30 seconds max execution time

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const systemPrompt = `
Du bist Stewart, ein exklusiver, hochprofessioneller, digitaler Concierge im Bereich "Nordic Luxury".
Aktueller Standort: ${context?.location || 'Unbekannt'}
    `.trim();

    // Fallback Mock Stream if API Key is missing or invalid
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dein_api_key_hier' || process.env.GEMINI_API_KEY === 'dein_echter_key_hier') {
      const mockText = `God dag! Da mein API Key noch nicht konfiguriert ist, laufe ich im Demo-Modus. Aber ich sehe, du bist aktuell in ${context?.location || 'der Umgebung'}. Ich würde dir für heute Abend das Restaurant 'Fjord & Fire' empfehlen.`;
      
      const stream = new ReadableStream({
        async start(controller) {
          const words = mockText.split(' ');
          for (const word of words) {
            controller.enqueue(new TextEncoder().encode(word + ' '));
            await new Promise(r => setTimeout(r, 100)); // Simulate typing delay
          }
          controller.close();
        }
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });
    
    if (typeof (result as any).toDataStreamResponse === 'function') {
      return (result as any).toDataStreamResponse();
    }
    
    if (typeof (result as any).toAIStreamResponse === 'function') {
      return (result as any).toAIStreamResponse();
    }

    return new Response((result as any).textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
}
