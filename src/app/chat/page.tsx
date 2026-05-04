"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import TopAppBar from '@/components/TopAppBar';

export default function ChatPage() {
  const { location } = useLocation();
  const [input, setInput] = useState('');
  const initialMessage = {
    id: '1',
    role: 'assistant',
    content: 'God dag! Ich bin Stewart, dein digitaler Concierge. Wie darf ich deinen Aufenthalt heute noch exklusiver gestalten?',
  };
  
  const [messages, setMessages] = useState<any[]>([initialMessage]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lade den Chatverlauf beim ersten Rendern
  useEffect(() => {
    const saved = localStorage.getItem('stivard_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse chat history", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Speichere den Chatverlauf bei jeder Änderung
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('stivard_chat_history', JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendRequest = async (userText: string) => {
    if (!userText.trim()) return;
    
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            location: location?.name || 'Unbekannt',
            isHotelContext: location?.isHotelContext || false,
            vibes: ['Kulinarik', 'Geheimtipps'],
            dislikes: 'Touristenfallen, lange Wartezeiten',
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Add empty assistant message to append stream to
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        if (value) {
          let chunkValue = decoder.decode(value, { stream: true });
          
          // Vercel AI SDK 3.x DataStream protocol fallback cleanup
          // Oft fangen die Chunks mit '0:"' an und enden mit '"\n'
          if (chunkValue.startsWith('0:')) {
            const lines = chunkValue.split('\n');
            chunkValue = lines.map(line => {
              if (line.startsWith('0:')) {
                try {
                  return JSON.parse(line.slice(2));
                } catch {
                  return line.slice(2).replace(/^"|"$/g, '');
                }
              }
              return '';
            }).join('');
          }

          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, content: lastMsg.content + chunkValue }
            ];
          });
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Entschuldigung, meine Verbindung wurde unterbrochen. Bitte überprüfe den API Key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendRequest(input);
  };

  const sendPrompt = (text: string) => {
    sendRequest(text);
  };

  return (
    <div className="text-on-background min-h-screen bg-cloud-white flex flex-col">
      <TopAppBar 
        subtitle={
          isLoading ? (
            <>
              <span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse"></span>
              Stewart denkt nach...
            </>
          ) : (
            'Chat with Stewart'
          )
        } 
      />

      {/* Main Canvas: Chat Interface */}
      <main className="pt-20 pb-32 px-4 max-w-md mx-auto chat-container flex flex-col h-screen w-full">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4 scroll-smooth">
          {messages.map((msg: any, index: number) => {
            const textContent = msg.content || msg.text || msg.message || "";
            return msg.role === 'assistant' || msg.sender === 'ai' ? (
              <div key={msg.id} className="flex flex-col items-start space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img 
                      alt="Stewart" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida/ADBb0ujTfLt_Oxu2-zg2k2K2_sCLuMp1mymHIHEal9KjoeqM6w_C43uW-C0SZEG1d_YJH3YgBIRt_dFeggzjtZKQoDC0DnNkfCjEGqv0aQynHlBM2gIKuDPo8MeZg4t638nrIf5IYkjMJ-UP0J8Ntk-RXu3sPT8HPx67gZOgPXQvaEa5f85h6L64tutpEi8_6FksMFlwoaLgQJdQmahk8LPc39P0svJa4wFad2boK4eYUjpYBJ0hmvS71s007-ffiJlCl7mziXN2EuFmQH8"
                    />
                  </div>
                  <span className="font-label-caps text-[12px] font-semibold tracking-wider text-slate-stone">STEWART</span>
                </div>
                <div className="stewart-glass p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm min-h-[52px] flex items-center">
                  {textContent ? (
                    <p className="font-body-md text-[16px] text-[#041627] leading-relaxed whitespace-pre-wrap">
                      {textContent}
                      {isLoading && index === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-glacier-mint animate-pulse align-middle" />
                      )}
                    </p>
                  ) : (
                    <div className="flex gap-1.5 px-2 py-1 items-center h-full">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-end space-y-2 animate-fadeIn">
                <div className="bg-glacier-mint p-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-[0_4px_12px_rgba(127,255,212,0.3)]">
                  <p className="font-body-md text-[16px] text-midnight-fjord leading-relaxed whitespace-pre-wrap">{textContent}</p>
                </div>
                <span className="font-label-caps text-[12px] font-semibold tracking-wider text-slate-stone mr-1 uppercase">DU</span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="py-4 overflow-x-auto no-scrollbar flex-shrink-0">
          <div className="flex gap-2 whitespace-nowrap">
            <button 
              onClick={() => sendPrompt("Gibt es gute Restaurants in der Nähe?")} 
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95"
            >
              Restaurants in der Nähe?
            </button>
            <button 
              onClick={() => sendPrompt("Ich bräuchte einen Transfer zum Flughafen.")} 
              className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95"
            >
              Flughafen-Transfer
            </button>
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={onSubmit} className="relative mt-2 flex-shrink-0">
          <div className="bg-white rounded-[24px] shadow-lg border border-slate-100 flex items-center p-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-body-md text-[16px] text-[#041627] outline-none" 
              placeholder="Ask Stewart anything..." 
              type="text"
            />
            <button 
              type="submit" 
              disabled={!input || !input.trim() || isLoading} 
              className="w-10 h-10 bg-midnight-fjord text-glacier-mint rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                 <span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse"></span>
              ) : (
                <span className="material-symbols-outlined">arrow_upward</span>
              )}
            </button>
          </div>
        </form>
      </main>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
