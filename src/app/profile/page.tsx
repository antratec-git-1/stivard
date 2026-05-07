"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import TopAppBar from '@/components/TopAppBar';

type VibePill = {
  id: string;
  label: string;
  icon: string;
};

const VIBE_PILLS: VibePill[] = [
  { id: 'culinary', label: 'Kulinarik', icon: '🍝' },
  { id: 'culture', label: 'Kultur', icon: '🏛️' },
  { id: 'hidden', label: 'Geheimtipps', icon: '💎' },
  { id: 'nature', label: 'Natur', icon: '🌿' },
];

export default function ProfilePage() {
  const [activeVibes, setActiveVibes] = useState<Set<string>>(new Set(['culinary', 'hidden']));
  const [dislikes, setDislikes] = useState('Touristenfallen, lange Wartezeiten');
  const { location, refreshLocation } = useLocation();

  const toggleVibe = (id: string) => {
    setActiveVibes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const badgeText = location?.isHotelContext 
    ? "Gast im Nordic Fjord Hotel" 
    : `Aktuell in: ${location?.name || "Explorer Modus"}`;

  return (
    <div className="bg-[#F9FAFB] text-[#111827] min-h-screen pb-32 font-body-md antialiased">
      <TopAppBar />

      <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
        
        {/* 1. Header: Identität & Status */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border border-slate-200">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150" alt="Alexander" />
            </div>
            <div>
              <h1 className="font-semibold text-2xl tracking-tight">Alexander</h1>
              <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${location?.isHotelContext ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-midnight-fjord text-white'}`}>
                {badgeText}
              </span>
            </div>
          </div>
          <Link href="/profile/settings" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#111827] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </section>

        {/* 2. Sektion: „Mein Vibe“ (KI-Präferenzen) */}
        <section className="bg-white rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-glacier-mint" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              Mein Vibe
            </h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">KI-Sync Aktiv</span>
          </div>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Deine Präferenzen formen Stewarts Empfehlungen. Tippe, um deinen Vibe anzupassen.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {VIBE_PILLS.map(pill => {
              const isActive = activeVibes.has(pill.id);
              return (
                <button
                  key={pill.id}
                  onClick={() => toggleVibe(pill.id)}
                  className={`
                    py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]
                    ${isActive 
                      ? 'bg-glacier-mint/20 text-[#00513d] border border-glacier-mint/30 shadow-inner' 
                      : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'}
                  `}
                >
                  <span className="text-base">{pill.icon}</span>
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ich mag keine...</label>
            <div className="relative">
              <input 
                type="text" 
                value={dislikes}
                onChange={(e) => setDislikes(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm text-[#111827] focus:ring-2 focus:ring-glacier-mint outline-none transition-all"
                placeholder="Touristenfallen, laute Orte..."
              />
              <span className="absolute right-3 top-3 material-symbols-outlined text-slate-400 text-[20px]">edit</span>
            </div>
          </div>
        </section>

        {/* 3. Sektion: „Meine Reise-Zentrale“ (Activity Hub) */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg px-2">Meine Reise-Zentrale</h2>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2 -mx-2">
            {/* Ticket Card (GetYourGuide Style) */}
            <div className="min-w-[260px] bg-white rounded-[12px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 flex-shrink-0">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider bg-[#FF5722]/10 px-2 py-1 rounded-md">GetYourGuide</span>
                <span className="material-symbols-outlined text-slate-300">confirmation_number</span>
              </div>
              <h3 className="font-semibold text-[15px] mb-1">Fjord Safari Classic</h3>
              <p className="text-xs text-slate-500 mb-4">Morgen, 09:00 - 12:00 Uhr • 2 Pers.</p>
              <button className="w-full py-2.5 bg-[#111827] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                Ticket öffnen
              </button>
            </div>

            {/* Merkliste Card (TripAdvisor Style) */}
            <div className="min-w-[260px] bg-white rounded-[12px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 flex-shrink-0 flex gap-4">
              <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80" alt="Restaurant" className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[#00aa6c] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex text-[#00aa6c]">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>
                    <span className="material-symbols-outlined text-[12px]">circle</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">128</span>
                </div>
                <h3 className="font-semibold text-sm leading-tight mb-1">The Glass Atelier</h3>
                <p className="text-[10px] text-slate-500 mb-3">Fine Dining • 1.2km</p>
                <button className="text-xs font-semibold text-[#111827] flex items-center gap-1 hover:text-glacier-mint transition-colors">
                  Auf Karte zeigen
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Sektion: „Betriebswirtschaftlicher Mehrwert“ */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg px-2">Hotel Services</h2>
          
          {/* Upsell Banner (Gutschein) */}
          <div className="bg-gradient-to-br from-midnight-fjord to-[#2a435d] rounded-[12px] p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-glacier-mint/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-1 bg-white/10 text-white/90 text-[10px] font-bold tracking-widest rounded mb-2 uppercase border border-white/20">
                  Exklusiv für dich
                </span>
                <h3 className="text-white font-semibold text-base mb-1">10% auf Spa-Behandlungen</h3>
                <p className="text-white/70 text-xs">Nur heute Nachmittag gültig.</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-glacier-mint flex items-center justify-center text-midnight-fjord hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(127,255,212,0.3)]">
                <span className="material-symbols-outlined">redeem</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Loyalty Card */}
            <div className="bg-white rounded-[12px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-slate-500">workspace_premium</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Status</span>
              <h4 className="font-semibold text-sm text-[#111827]">Stivard Silver</h4>
            </div>

            {/* Language Select */}
            <div className="bg-white rounded-[12px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2">KI Sprache</span>
              <div className="relative">
                <select className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-[#111827] focus:outline-none focus:ring-1 focus:ring-glacier-mint">
                  <option>Deutsch</option>
                  <option>English</option>
                  <option>Svenska</option>
                  <option>Norsk</option>
                </select>
                <span className="absolute right-2 top-2.5 material-symbols-outlined text-[16px] text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Sektion: „Support & Information“ (Legal & Info) */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg px-2">Support & Info</h2>
          <div className="bg-white rounded-[12px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50">
            <Link href="/about" className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-midnight-fjord/5 flex items-center justify-center text-midnight-fjord">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                </div>
                <span className="text-sm font-medium">Über STIVARD</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-midnight-fjord transition-colors">chevron_right</span>
            </Link>
            
            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-midnight-fjord/5 flex items-center justify-center text-midnight-fjord">
                  <span className="material-symbols-outlined text-[18px]">contact_support</span>
                </div>
                <span className="text-sm font-medium">Hilfe & Support</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-midnight-fjord transition-colors">chevron_right</span>
            </button>

            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-midnight-fjord/5 flex items-center justify-center text-midnight-fjord">
                  <span className="material-symbols-outlined text-[18px]">policy</span>
                </div>
                <span className="text-sm font-medium">Datenschutz & AGB</span>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-midnight-fjord transition-colors">chevron_right</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
