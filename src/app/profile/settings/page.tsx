"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import TopAppBar from '@/components/TopAppBar';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);
  const [aiPersonalization, setAiPersonalization] = useState(true);

  return (
    <div className="bg-[#F9FAFB] text-[#111827] min-h-screen pb-32 font-body-md antialiased relative">
      
      <TopAppBar title="EINSTELLUNGEN" />

      <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
        
        {/* 2. Sektion: Aufenthalt & Hotel (Kontext) */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">Aktueller Kontext</h2>
          <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 p-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-midnight-fjord">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Aufenthalt</p>
                <p className="font-semibold text-sm">Nordic Fjord Hotel</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Abreise</p>
                <p className="font-medium text-sm">05. Mai 2026</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-0.5">Zimmer</p>
                <p className="font-medium text-sm">304</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sektion: App-Konfiguration (System) */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">System</h2>
          <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
            
            {/* Language */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">language</span>
                <span className="font-medium text-sm">Sprache</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="text-sm">Deutsch 🇩🇪</span>
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">notifications</span>
                <span className="font-medium text-sm">Reise-Updates</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${notifications ? 'bg-midnight-fjord' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300 ${notifications ? 'translate-x-5.5 left-[2px]' : 'translate-x-0 left-[2px]'}`}></div>
              </button>
            </div>

            {/* Units */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">straighten</span>
                <div>
                  <p className="font-medium text-sm">Metrische Einheiten</p>
                  <p className="text-[10px] text-slate-500">Celsius / Kilometer</p>
                </div>
              </div>
              <button 
                onClick={() => setMetricUnits(!metricUnits)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${metricUnits ? 'bg-midnight-fjord' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300 ${metricUnits ? 'translate-x-5.5 left-[2px]' : 'translate-x-0 left-[2px]'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* 4. Sektion: Datenschutz & KI (Privacy) */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">Datenschutz & KI</h2>
          <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
            
            {/* AI Personalization */}
            <div className="flex items-start justify-between p-4 border-b border-slate-100">
              <div className="flex gap-3 pr-4">
                <span className="material-symbols-outlined text-slate-400 mt-0.5">psychology</span>
                <div>
                  <p className="font-medium text-sm">KI-Personalisierung erlauben</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Ermöglicht Stivard, sich an deine Vorlieben für zukünftige Empfehlungen zu erinnern.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAiPersonalization(!aiPersonalization)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 focus:outline-none ${aiPersonalization ? 'bg-midnight-fjord' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300 ${aiPersonalization ? 'translate-x-5.5 left-[2px]' : 'translate-x-0 left-[2px]'}`}></div>
              </button>
            </div>

            {/* Clear History */}
            <button className="w-full text-left p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors">
              <span className="material-symbols-outlined">delete</span>
              <span className="font-medium text-sm">Chat-Verlauf zurücksetzen</span>
            </button>
          </div>
        </section>

        {/* BWL-Tipp: Stivard für mein Unternehmen */}
        <section>
          <Link href="#" className="block bg-gradient-to-r from-slate-800 to-midnight-fjord rounded-[12px] p-5 shadow-md relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 bg-white/10 text-white/90 text-[9px] font-bold tracking-widest rounded mb-1.5 uppercase">
                  Für Unternehmer
                </span>
                <h3 className="text-white font-semibold text-sm mb-0.5">Stivard für dein Hotel?</h3>
                <p className="text-white/60 text-[11px]">Biete deinen Gästen denselben Service.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </Link>
        </section>

        {/* 5. Sektion: Rechtliches & Info */}
        <section>
          <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden mb-6">
            <Link href="#" className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <span className="font-medium text-sm">Datenschutz</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
            </Link>
            <Link href="#" className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <span className="font-medium text-sm">AGB</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
            </Link>
            <Link href="#" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <span className="font-medium text-sm">Impressum</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Logout Button */}
            <button className="w-full py-3.5 rounded-xl border border-[#111827] bg-white text-[#111827] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Abmelden
            </button>

            {/* Version */}
            <p className="text-[10px] text-slate-400 font-medium">Stivard v1.0.4 – Made with ☕ in Stockholm</p>
          </div>
        </section>

      </main>
    </div>
  );
}
