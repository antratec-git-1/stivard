"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import TopAppBar from '@/components/TopAppBar';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: 'God dag! Ich bin Stewart, dein digitaler Concierge. Wie darf ich deinen Aufenthalt heute noch exklusiver gestalten?',
};

function generateUniqueId() {
  return Date.now().toString();
}

function getCurrentTimestamp() {
  return Date.now();
}

export default function ChatPage() {
  const { location } = useLocation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load
  useEffect(() => {
    const savedChats = localStorage.getItem('stivard_chats_v1');
    const lastChatId = localStorage.getItem('stivard_active_chat_id');
    
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setTimeout(() => {
          setChats(parsedChats);
          
          if (lastChatId) {
            const lastChat = parsedChats.find((c: Chat) => c.id === lastChatId);
            if (lastChat) {
              setActiveChatId(lastChatId);
              setMessages(lastChat.messages);
            } else {
              // If last chat not found, start new
              const newId = generateUniqueId();
              setActiveChatId(newId);
            }
          } else {
            const newId = generateUniqueId();
            setActiveChatId(newId);
          }
          setIsLoaded(true);
        }, 0);
      } catch (e) {
        console.error("Could not parse chat archive", e);
        setTimeout(() => setIsLoaded(true), 0);
      }
    } else {
      const newId = generateUniqueId();
      setTimeout(() => {
        setActiveChatId(newId);
        setIsLoaded(true);
      }, 0);
    }
  }, []);

  // 2. Save current chat state to archive
  useEffect(() => {
    if (!isLoaded || !activeChatId) return;

    // Don't save empty chats (only initial message)
    if (messages.length <= 1) return;

    const userMsg = messages.find(m => m.role === 'user');
    const userContent = userMsg ? userMsg.content : '';
    const title = userContent ? (userContent.substring(0, 30) + (userContent.length > 30 ? '...' : '')) : 'Neuer Chat';
    
    const newChat: Chat = {
      id: activeChatId,
      title,
      messages,
      updatedAt: getCurrentTimestamp()
    };

    setTimeout(() => {
      setChats(prev => {
        const existingIndex = prev.findIndex(c => c.id === activeChatId);
        let nextChats;
        if (existingIndex >= 0) {
          nextChats = [...prev];
          nextChats[existingIndex] = newChat;
        } else {
          nextChats = [newChat, ...prev];
        }
        localStorage.setItem('stivard_chats_v1', JSON.stringify(nextChats));
        return nextChats;
      });
    }, 0);

    localStorage.setItem('stivard_active_chat_id', activeChatId);
  }, [messages, activeChatId, isLoaded]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewChat = () => {
    const newId = generateUniqueId();
    setActiveChatId(newId);
    setMessages([INITIAL_MESSAGE]);
    setIsArchiveOpen(false);
    localStorage.setItem('stivard_active_chat_id', newId);
  };

  const loadChat = (chat: Chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    setIsArchiveOpen(false);
    localStorage.setItem('stivard_active_chat_id', chat.id);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem('stivard_chats_v1', JSON.stringify(next));
      return next;
    });
    if (activeChatId === id) {
      startNewChat();
    }
  };

  const sendRequest = async (userText: string) => {
    if (!userText.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    const newMessages = [...messages, userMsg];
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

      if (!response.ok) throw new Error('Network response was not ok');

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

  return (
    <div className="h-screen flex flex-col bg-cloud-white overflow-hidden relative">
      <TopAppBar 
        title="Chat"
        subtitle={isLoading ? (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined animate-hourglass text-[14px]">hourglass_empty</span>
            <span>Stewart erstellt Antwort...</span>
          </div>
        ) : 'Digitaler Concierge'}
        leftElement={
          <button 
            onClick={() => setIsArchiveOpen(true)}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-midnight-fjord active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">history</span>
          </button>
        }
        rightElement={
          <button 
            onClick={startNewChat}
            className="w-10 h-10 rounded-full bg-glacier-mint shadow-sm flex items-center justify-center text-midnight-fjord active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        }
      />

      {/* Archive Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isArchiveOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-midnight-fjord/40 backdrop-blur-sm" onClick={() => setIsArchiveOpen(false)}></div>
        <div className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isArchiveOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display-sm text-xl font-bold text-midnight-fjord uppercase tracking-tighter">Archiv</h2>
              <button onClick={() => setIsArchiveOpen(false)} className="material-symbols-outlined text-slate-stone">close</button>
            </div>

            <button onClick={startNewChat} className="w-full py-3 bg-glacier-mint/20 text-midnight-fjord rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-6 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[18px]">add</span> Neuer Chat
            </button>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
              {chats.length === 0 ? (
                <div className="text-center py-12 opacity-30">
                  <span className="material-symbols-outlined text-[48px] mb-2">auto_awesome</span>
                  <p className="text-[12px] font-bold uppercase tracking-widest">Keine Chats gespeichert</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div 
                    key={chat.id} 
                    onClick={() => loadChat(chat)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group flex justify-between items-center ${activeChatId === chat.id ? 'border-glacier-mint bg-glacier-mint/5 ring-1 ring-glacier-mint' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
                  >
                    <div className="overflow-hidden mr-2">
                      <p className="text-[13px] font-bold text-midnight-fjord truncate">{chat.title}</p>
                      <p className="text-[10px] text-slate-stone uppercase tracking-wide font-semibold mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <button onClick={(e) => deleteChat(e, chat.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-stone opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Container */}
      <div className="flex-1 overflow-y-auto pt-20 pb-44 px-4 scroll-smooth no-scrollbar relative z-10">
        <div className="max-w-md mx-auto space-y-6 py-4">
          {messages.map((msg, index) => (
            msg.role === 'assistant' ? (
              <div key={msg.id} className="flex flex-col items-start space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100">
                    <img alt="Stewart" className="w-full h-full object-cover" src="/images/stewart.png" />
                  </div>
                  <span className="font-label-caps text-[12px] font-semibold tracking-wider text-slate-stone">STEWART</span>
                </div>
                <div className="stewart-glass p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm min-h-[52px] flex items-center">
                  <div className="font-body-md text-[16px] text-[#041627] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                    {isLoading && index === messages.length - 1 && !msg.content && (
                       <span className="flex gap-1.5 px-2 py-1 items-center h-full">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                    {isLoading && index === messages.length - 1 && msg.content && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-glacier-mint animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-end space-y-2 animate-fadeIn">
                <div className="bg-glacier-mint p-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-[0_4px_12px_rgba(127,255,212,0.3)]">
                  <p className="font-body-md text-[16px] text-midnight-fjord leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="font-label-caps text-[12px] font-semibold tracking-wider text-slate-stone mr-1 uppercase">DU</span>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Controls - Lifted above BottomNav */}
      <div className="fixed bottom-[96px] left-0 w-full z-40 pointer-events-none px-4">
        <div className="max-w-md mx-auto pointer-events-auto flex flex-col gap-4">
          {messages.length <= 1 && (
            <div className="overflow-x-auto no-scrollbar flex gap-2 pb-1">
              <button onClick={() => sendRequest("Gibt es gute Restaurants in der Nähe?")} className="px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95 shadow-sm whitespace-nowrap">
                Restaurants in der Nähe?
              </button>
              <button onClick={() => sendRequest("Ich bräuchte einen Transfer zum Flughafen.")} className="px-4 py-2 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-slate-stone font-label-caps text-[11px] hover:border-glacier-mint transition-colors active:scale-95 shadow-sm whitespace-nowrap">
                Flughafen-Transfer
              </button>
            </div>
          )}

          <form onSubmit={onSubmit} className="relative w-full">
            <div className="bg-white rounded-[24px] shadow-2xl border border-slate-100 flex items-center p-2 focus-within:ring-2 focus-within:ring-glacier-mint/30 transition-all h-[56px]">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-body-md text-[16px] text-[#041627] outline-none" 
                placeholder="Frag Stewart..." 
                type="text"
              />
              <button 
                type="submit" 
                disabled={!input || !input.trim() || isLoading} 
                className="w-10 h-10 bg-midnight-fjord text-glacier-mint rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50 flex-shrink-0"
              >
                {isLoading ? (
                  <span className="w-2 h-2 rounded-full bg-glacier-mint animate-pulse"></span>
                ) : (
                  <span className="material-symbols-outlined">arrow_upward</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes hourglassFlip {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(180deg); }
          50% { transform: rotate(180deg); }
          90% { transform: rotate(360deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-hourglass {
          display: inline-block;
          animation: hourglassFlip 2s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .stewart-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
