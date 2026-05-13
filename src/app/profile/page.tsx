"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import TopAppBar from '@/components/TopAppBar';
import { supabase } from '@/lib/supabase';
import { Loader2, Settings, Brain, Heart, Ticket, Gift, Award, ChevronDown, Info, HelpCircle, ShieldCheck, Edit2, ChevronRight, LogOut } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [activeVibes, setActiveVibes] = useState<Set<string>>(new Set());
  const [dislikes, setDislikes] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const { location } = useLocation();
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
    if (userId) fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
        setActiveVibes(new Set(data.vibes || []));
        setDislikes(data.dislikes || '');
        setFullName(data.full_name || '');
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileField = async (fields: any) => {
    if (!userId) return;
    setSaving(true);
    try {
      await supabase
        .from('profiles')
        .update(fields)
        .eq('id', userId);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleVibe = (id: string) => {
    const next = new Set(activeVibes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveVibes(next);
    updateProfileField({ vibes: Array.from(next) });
  };

  const handleDislikesBlur = () => {
    updateProfileField({ dislikes });
  };

  const badgeText = location?.isHotelContext 
    ? "Gast im Nordic Fjord Hotel" 
    : `Aktuell in: ${location?.name || "Explorer Modus"}`;

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-glacier-mint animate-spin mb-4" />
        <p className="text-midnight-fjord font-bold text-sm">Profil wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] text-[#111827] min-h-screen pb-32 font-inter antialiased">
      <TopAppBar title="MEIN PROFIL" />

      <main className="pt-24 px-6 max-w-md mx-auto space-y-8">
        
        {/* 1. Header: Identität & Status */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <img 
                className="w-full h-full object-cover" 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"} 
                alt={profile?.full_name} 
              />
            </div>
            <div>
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => updateProfileField({ full_name: fullName.trim() })}
                className="font-bold text-2xl tracking-tight text-midnight-fjord bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-full placeholder:text-slate-300"
                placeholder="Dein Name..."
              />
              <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${location?.isHotelContext ? 'bg-glacier-mint text-midnight-fjord' : 'bg-midnight-fjord text-white'}`}>
                {badgeText}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} 
              className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-500 active:scale-95 transition-transform"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <Link href="/profile/settings" className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-midnight-fjord active:scale-95 transition-transform">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* 2. Sektion: „Mein Vibe“ (KI-Präferenzen) */}
        <section className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2 text-midnight-fjord">
              <Brain className="w-5 h-5 text-glacier-mint fill-glacier-mint" />
              Mein Vibe
            </h2>
            <div className="flex items-center gap-1.5">
              {saving && <Loader2 className="w-3 h-3 text-glacier-mint animate-spin" />}
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">DB Sync Aktiv</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
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
                    py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 active:scale-[0.95]
                    ${isActive 
                      ? 'bg-glacier-mint text-midnight-fjord shadow-lg shadow-mint-glow/10 border border-glacier-mint' 
                      : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'}
                  `}
                >
                  <span className="text-base">{pill.icon}</span>
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ich mag keine...</label>
            <div className="relative">
              <input 
                type="text" 
                value={dislikes}
                onChange={(e) => setDislikes(e.target.value)}
                onBlur={handleDislikesBlur}
                className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-sm text-midnight-fjord font-bold focus:ring-2 focus:ring-glacier-mint outline-none transition-all"
                placeholder="Z.B. Touristenfallen..."
              />
              <Edit2 className="absolute right-4 top-4 text-slate-300 w-4 h-4" />
            </div>
          </div>
        </section>

        {/* 3. Sektion: „Meine Reise-Zentrale“ */}
        <section className="space-y-4">
          <h2 className="font-bold text-lg px-2 text-midnight-fjord">Meine Reise-Zentrale</h2>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2 -mx-2">
            <div className="min-w-[280px] bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wider bg-[#FF5722]/10 px-2 py-1 rounded-lg">GetYourGuide</span>
                <Ticket className="w-5 h-5 text-slate-200" />
              </div>
              <h3 className="font-bold text-lg text-midnight-fjord mb-1 tracking-tight">Fjord Safari Classic</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">Morgen, 09:00 - 12:00 Uhr • 2 Pers.</p>
              <button className="w-full py-4 bg-midnight-fjord text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-midnight-fjord/10">
                Ticket öffnen
              </button>
            </div>

            <div className="min-w-[280px] bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex-shrink-0 flex gap-4">
              <div className="w-24 h-full rounded-2xl overflow-hidden flex-shrink-0 relative">
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80" alt="Restaurant" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm">
                  <Heart className="w-3.5 h-3.5 text-[#00aa6c] fill-current" />
                </div>
              </div>
              <div className="flex flex-col justify-center py-2">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-[#00aa6c] gap-0.5">
                    {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#00aa6c]" />)}
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold ml-1">128</span>
                </div>
                <h3 className="font-bold text-sm text-midnight-fjord leading-tight mb-1">The Glass Atelier</h3>
                <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">Fine Dining • 1.2km</p>
                <button className="text-[11px] font-bold text-midnight-fjord flex items-center gap-1 hover:text-glacier-mint transition-colors">
                  Details zeigen
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Sektion: Hotel Services */}
        <section className="space-y-4">
          <h2 className="font-bold text-lg px-2 text-midnight-fjord">Hotel Services</h2>
          
          <div className="bg-gradient-to-br from-midnight-fjord to-[#2a435d] rounded-[24px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-glacier-mint/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-1 bg-white/10 text-glacier-mint text-[10px] font-bold tracking-widest rounded mb-2 uppercase border border-white/10">
                  Exklusiv für dich
                </span>
                <h3 className="text-white font-bold text-lg mb-1 tracking-tight">10% auf Spa-Behandlungen</h3>
                <p className="text-white/60 text-xs font-medium">Nur heute Nachmittag gültig.</p>
              </div>
              <button className="w-14 h-14 rounded-full bg-glacier-mint flex items-center justify-center text-midnight-fjord hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(127,255,212,0.3)]">
                <Gift className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1 block">Dein Status</span>
                  <h4 className="font-bold text-sm text-midnight-fjord">{profile?.role === 'guest' ? 'Stivard Silver' : 'VIP Member'}</h4>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </div>
          </div>
        </section>

        {/* 5. Support */}
        <section className="space-y-4">
          <h2 className="font-bold text-lg px-2 text-midnight-fjord">Support & Info</h2>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50">
            <Link href="/about" className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-midnight-fjord/5 flex items-center justify-center text-midnight-fjord">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-midnight-fjord">Über STIVARD</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-midnight-fjord transition-all" />
            </Link>
            
            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 group text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-midnight-fjord/5 flex items-center justify-center text-midnight-fjord">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-midnight-fjord">Hilfe & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-midnight-fjord transition-all" />
            </button>

            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-midnight-fjord/5 flex items-center justify-center text-midnight-fjord">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-midnight-fjord">Datenschutz & AGB</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-midnight-fjord transition-all" />
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
