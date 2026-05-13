"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopAppBar from '@/components/TopAppBar';
import { supabase } from '@/lib/supabase';
import { Loader2, Globe, Bell, Ruler, Brain, Trash2, LogOut, ChevronRight, Check, MapPin } from 'lucide-react';

const LANGUAGES = [
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'sv-SE', label: 'Svenska', flag: '🇸🇪' },
  { code: 'nb-NO', label: 'Norsk', flag: '🇳🇴' },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);
  const [aiPersonalization, setAiPersonalization] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState('de-DE');
  const [homeAddress, setHomeAddress] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUserId(session.user.id);
      }
    };
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login');
      else setUserId(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (userId) fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('language, home_address')
        .eq('id', userId)
        .single();
      
      if (data) {
        setLanguage(data.language || 'de-DE');
        setHomeAddress(data.home_address || '');
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressBlur = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await supabase
        .from('profiles')
        .update({ home_address: homeAddress.trim() })
        .eq('id', userId);
    } catch (err) {
      console.error("Address update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateLanguage = async (code: string) => {
    if (!userId) return;
    setLanguage(code);
    setIsLangOpen(false);
    setSaving(true);
    try {
      await supabase
        .from('profiles')
        .update({ language: code })
        .eq('id', userId);
    } catch (err) {
      console.error("Language update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-glacier-mint animate-spin mb-4" />
        <p className="text-midnight-fjord font-bold text-sm">Einstellungen werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] text-[#111827] min-h-screen pb-32 font-inter antialiased relative">
      
      <TopAppBar title="EINSTELLUNGEN" />

      <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
        
        {/* Sync Indicator */}
        <div className="h-4 flex items-center justify-end px-2">
          {saving && (
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 text-glacier-mint animate-spin" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speichere...</span>
            </div>
          )}
        </div>

        {/* 2. Sektion: Aufenthalt & Hotel */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 pl-2">Aktueller Kontext</h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 p-6">
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-midnight-fjord">
                <Globe className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Aufenthalt</p>
                <p className="font-bold text-sm text-midnight-fjord">Nordic Fjord Hotel</p>
              </div>
            </div>
            <div className="flex justify-between items-center px-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Abreise</p>
                <p className="font-bold text-sm text-midnight-fjord">05. Mai 2026</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Zimmer</p>
                <p className="font-bold text-sm text-midnight-fjord">304</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sektion: Persönliches (Home Address) */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 pl-2">Persönliches</h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-midnight-fjord mt-1">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Heimatadresse</p>
                <textarea
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  onBlur={handleAddressBlur}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium text-midnight-fjord focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all resize-none placeholder:text-slate-300"
                  placeholder="Z.B. Musterstraße 1, 10115 Berlin"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sektion: System */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 pl-2">System</h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
            
            {/* Language Selection */}
            <div className="border-b border-slate-50">
              <div 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-slate-300" />
                  <span className="font-bold text-sm text-midnight-fjord">Sprache</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-sm font-bold text-midnight-fjord">{currentLang.label} {currentLang.flag}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isLangOpen ? 'rotate-90' : ''}`} />
                </div>
              </div>
              
              {/* Language Dropdown (Nordic Style) */}
              {isLangOpen && (
                <div className="bg-slate-50/50 px-5 pb-5 pt-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  {LANGUAGES.map((lang) => (
                    <div 
                      key={lang.code}
                      onClick={() => updateLanguage(lang.code)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        language === lang.code ? 'bg-white shadow-sm ring-1 ring-glacier-mint/20' : 'hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{lang.flag}</span>
                        <span className={`text-sm ${language === lang.code ? 'font-bold text-midnight-fjord' : 'font-medium text-slate-500'}`}>
                          {lang.label}
                        </span>
                      </div>
                      {language === lang.code && <Check className="w-4 h-4 text-glacier-mint" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-5 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="font-bold text-sm text-midnight-fjord">Reise-Updates</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 focus:outline-none ${notifications ? 'bg-midnight-fjord shadow-lg shadow-midnight-fjord/10' : 'bg-slate-100'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            {/* Units */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <Ruler className="w-5 h-5 text-slate-300" />
                <div>
                  <p className="font-bold text-sm text-midnight-fjord">Metrische Einheiten</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Celsius / Kilometer</p>
                </div>
              </div>
              <button 
                onClick={() => setMetricUnits(!metricUnits)}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 focus:outline-none ${metricUnits ? 'bg-midnight-fjord shadow-lg shadow-midnight-fjord/10' : 'bg-slate-100'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all duration-300 ${metricUnits ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* 4. Sektion: Datenschutz & KI */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 pl-2">Datenschutz & KI</h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
            
            <div className="flex items-start justify-between p-6 border-b border-slate-50">
              <div className="flex gap-4 pr-4">
                <Brain className="w-5 h-5 text-slate-300 mt-1" />
                <div>
                  <p className="font-bold text-sm text-midnight-fjord">KI-Personalisierung</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed">
                    Ermöglicht Stivard, sich an deine Vorlieben für zukünftige Empfehlungen zu erinnern.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAiPersonalization(!aiPersonalization)}
                className={`w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0 focus:outline-none ${aiPersonalization ? 'bg-midnight-fjord shadow-lg shadow-midnight-fjord/10' : 'bg-slate-100'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 transition-all duration-300 ${aiPersonalization ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <button className="w-full text-left p-6 flex items-center gap-4 text-rose-500 hover:bg-rose-50 transition-colors font-bold text-sm">
              <Trash2 className="w-5 h-5" />
              <span>Chat-Verlauf zurücksetzen</span>
            </button>
          </div>
        </section>

        {/* 5. Sektion: Rechtliches & Info */}
        <section className="space-y-4">
          <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 overflow-hidden">
            <Link href="#" className="flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
              <span className="font-bold text-sm text-midnight-fjord">Datenschutz</span>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-midnight-fjord transition-all" />
            </Link>
            <Link href="#" className="flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
              <span className="font-bold text-sm text-midnight-fjord">AGB</span>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-midnight-fjord transition-all" />
            </Link>
            <Link href="#" className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
              <span className="font-bold text-sm text-midnight-fjord">Impressum</span>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-midnight-fjord transition-all" />
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center pt-4">
            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
              className="w-full h-16 rounded-[20px] bg-white border border-midnight-fjord text-midnight-fjord font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Abmelden
            </button>

            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-8">Stivard v1.0.4 – Made in Stockholm</p>
          </div>
        </section>

      </main>
    </div>
  );
}
