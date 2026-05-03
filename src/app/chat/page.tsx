"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      sender: 'ai',
      message: 'God dag! I am Stewart, your digital concierge. How may I assist you with your premium travel arrangements or property management today?',
      timestamp: '10:23 AM'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        message: 'Certainly. I can coordinate a premium electric sedan for your transfer. Would you prefer the Tesla Model S or the Audi e-tron GT for your journey to the city center?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="text-on-background min-h-screen bg-cloud-white">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 flex-shrink-0">
              <img 
                alt="Stivard Logo" 
                className="w-full h-full object-contain mix-blend-multiply" 
                src="/logo.png"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-[#1A2B3C] dark:text-white">STIVARD</h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Chat with Stewart</p>
            </div>
          </div>
          <button className="text-[#1A2B3C] dark:text-slate-100 active:scale-95 duration-200 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      {/* Main Canvas: Chat Interface */}
      <main className="pt-20 pb-32 px-4 max-w-md mx-auto chat-container flex flex-col h-[calc(100vh-144px)]">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-6 py-4 scroll-smooth">
          {messages.map((msg) => (
            msg.sender === 'ai' ? (
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
                <div className="stewart-glass p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                  <p className="font-body-md text-[16px] text-[#041627] leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-end space-y-2 animate-fadeIn">
                <div className="bg-glacier-mint p-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-[0_4px_12px_rgba(127,255,212,0.3)]">
                  <p className="font-body-md text-[16px] text-midnight-fjord leading-relaxed">{msg.message}</p>
                </div>
                <span className="font-label-caps text-[12px] font-semibold tracking-wider text-slate-stone mr-1 uppercase">{msg.timestamp}</span>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="py-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 whitespace-nowrap">
            <button onClick={() => { setInput("Tesla Model S"); handleSend(); }} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95">Tesla Model S</button>
            <button onClick={() => { setInput("Audi e-tron GT"); handleSend(); }} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95">Audi e-tron GT</button>
            <button onClick={() => { setInput("What's the price difference?"); handleSend(); }} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95">What's the price difference?</button>
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="relative mt-2">
          <div className="bg-white rounded-[24px] shadow-lg border border-slate-100 flex items-center p-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-body-md text-[16px] text-[#041627] outline-none" 
              placeholder="Ask Stewart anything..." 
              type="text"
            />
            <button type="submit" disabled={!input.trim()} className="w-10 h-10 bg-midnight-fjord text-glacier-mint rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50">
              <span className="material-symbols-outlined">arrow_upward</span>
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
