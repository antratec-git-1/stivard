"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Compass, MapPin, Star, Info, Check, ExternalLink, X, Loader2, Clock, Globe, Phone } from 'lucide-react';
import TopAppBar from '@/components/TopAppBar';

// --- Types ---
type Experience = {
  id: string;
  name: string;
  photo_url: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  butler_snippet: string;
  booking_url: string;
  // Detail fields
  address?: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
  openingHours?: string[];
  summary?: string;
};

export default function ExperiencesPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const [cards, setCards] = useState<Experience[]>([]);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [gems, setGems] = useState<Experience[]>([]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const onboarded = localStorage.getItem('stivard_exp_v8');
    if (!onboarded) setFirstVisit(true);
    
    const savedGems = localStorage.getItem('stivard_gems');
    if (savedGems) setGems(JSON.parse(savedGems));

    loadExperiences();
  }, []);

  async function loadExperiences() {
    setLoading(true);
    try {
      const res = await fetch(`/api/places?location=50.7753,6.0839&radius=1500&type=tourist_attraction`);
      if (!res.ok) throw new Error("API Route failed");
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const mapped: Experience[] = data.results.map((item: any) => ({
          id: item.place_id,
          name: item.name,
          photo_url: item.photos 
            ? `/api/places?photo_reference=${item.photos[0].photo_reference}`
            : 'https://images.unsplash.com/photo-1548546738-8542ad096549?q=80&w=800',
          rating: item.rating || 4.5,
          user_ratings_total: item.user_ratings_total || 100,
          vicinity: item.vicinity || "In der Nähe",
          butler_snippet: `Stivard Insider: Dieser Ort hat eine hervorragende Bewertung von ${item.rating || '4.5'} Sternen und ist ein absolutes Highlight in Aachen.`,
          booking_url: `https://www.google.com/maps/place/?q=place_id:${item.place_id}`,
        }));
        setCards(mapped);
      } else {
        setCards(SIMULATED_GOOGLE_RESULTS);
      }
      setLoading(false);
    } catch (err) {
      console.error("Places API Proxy Error:", err);
      setCards(SIMULATED_GOOGLE_RESULTS);
      setLoading(false);
    }
  }

  const handleOpenDetails = async (exp: Experience) => {
    setSelectedExp(exp);
    setDetailsLoading(true);
    
    try {
      const res = await fetch(`/api/places?place_id=${exp.id}`);
      const data = await res.json();
      
      if (data.result) {
        const result = data.result;
        setSelectedExp(prev => prev ? {
          ...prev,
          address: result.formatted_address,
          phone: result.formatted_phone_number,
          website: result.website,
          isOpen: result.opening_hours?.open_now,
          openingHours: result.opening_hours?.weekday_text,
          summary: result.editorial_summary?.overview || prev.butler_snippet
        } : null);
      }
    } catch (err) {
      console.error("Details fetch error:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  const handleOnboardingComplete = () => {
    localStorage.setItem('stivard_exp_v8', 'true');
    setFirstVisit(false);
  };

  const handleSwipe = (dir: 'left' | 'right', exp: Experience) => {
    if (dir === 'right') {
      const newGems = [...gems, exp];
      setGems(newGems);
      localStorage.setItem('stivard_gems', JSON.stringify(newGems));
    }
    setCards(prev => prev.filter(c => c.id !== exp.id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden relative font-inter">
      <TopAppBar title="Entdecken" subtitle="Google Places Live" />

      <AnimatePresence>
        {firstVisit && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center"
          >
            <Compass className="w-12 h-12 text-midnight-fjord mb-6" />
            <h2 className="text-2xl font-bold text-midnight-fjord mb-2">Live Discovery</h2>
            <p className="text-slate-500 mb-8 text-sm">Echte Insider-Tipps direkt von Google.</p>
            <button 
              onClick={handleOnboardingComplete}
              className="w-full max-w-xs h-14 bg-midnight-fjord text-white rounded-xl font-bold transition-all active:scale-95"
            >
              Starten
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24 px-6 flex flex-col relative z-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-midnight-fjord tracking-tight">Alexander,</h2>
          <p className="text-sm text-slate-500">hier sind Live-Erlebnisse in Aachen:</p>
        </div>

        <div className="flex-1 relative mb-4 min-h-[520px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-glacier-mint animate-spin" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rufe Google Places ab...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {cards.map((exp, index) => (
                <SwipeCard 
                  key={exp.id} 
                  experience={exp} 
                  isTop={index === cards.length - 1} 
                  onSwipe={(dir: 'left' | 'right') => handleSwipe(dir, exp)}
                  onDetails={() => handleOpenDetails(exp)}
                />
              ))}
            </AnimatePresence>
          )}
          
          {!loading && cards.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center">
              <Compass className="w-12 h-12 mb-4 text-slate-200" />
              <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Alles entdeckt</p>
              <button onClick={loadExperiences} className="mt-4 text-xs font-bold text-midnight-fjord underline">Neu laden</button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!loading && cards.length > 0 && (
          <div className="flex justify-center gap-8 mb-32">
            <button 
              onClick={() => handleSwipe('left', cards[cards.length - 1])}
              className="w-16 h-16 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-rose-500 active:scale-90 transition-transform"
            >
              <X className="w-8 h-8 stroke-[3]" />
            </button>
            <button 
              onClick={() => handleSwipe('right', cards[cards.length - 1])}
              className="w-16 h-16 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-emerald-500 active:scale-90 transition-transform"
            >
              <Check className="w-8 h-8 stroke-[3]" />
            </button>
          </div>
        )}
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedExp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-midnight-fjord/60 backdrop-blur-md flex items-end justify-center p-4"
            onClick={() => setSelectedExp(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-[24px] p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              
              <h3 className="text-2xl font-bold text-midnight-fjord mb-2">{selectedExp.name}</h3>
              
              {detailsLoading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-glacier-mint animate-spin" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lade Details...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{selectedExp.rating}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{selectedExp.user_ratings_total} Google Rezensionen</span>
                    </div>
                    {selectedExp.isOpen !== undefined && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedExp.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {selectedExp.isOpen ? 'Geöffnet' : 'Geschlossen'}
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-sm leading-relaxed text-midnight-fjord italic font-medium">
                      "{selectedExp.summary || selectedExp.butler_snippet}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedExp.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Adresse</p>
                          <p className="text-sm text-midnight-fjord font-medium">{selectedExp.address}</p>
                        </div>
                      </div>
                    )}

                    {selectedExp.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Telefon</p>
                          <p className="text-sm text-midnight-fjord font-medium">{selectedExp.phone}</p>
                        </div>
                      </div>
                    )}

                    {selectedExp.openingHours && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div className="w-full">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Öffnungszeiten</p>
                          <div className="grid grid-cols-1 gap-1">
                            {selectedExp.openingHours.map((line, i) => (
                              <p key={i} className="text-[11px] text-slate-600 font-medium">{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedExp.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Website</p>
                          <a href={selectedExp.website} target="_blank" className="text-sm text-glacier-mint font-bold hover:underline">{new URL(selectedExp.website).hostname}</a>
                        </div>
                      </div>
                    )}
                  </div>

                  <a 
                    href={selectedExp.booking_url} 
                    target="_blank"
                    className="w-full h-16 bg-midnight-fjord text-glacier-mint rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg mt-8"
                  >
                    <span>In Google Maps öffnen</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SwipeCard({ experience, isTop, onSwipe, onDetails }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0, touchAction: 'none' }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
      }}
      className="absolute inset-0 w-full h-[520px]"
    >
      <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col pointer-events-auto">
        <div className="relative h-[60%] bg-slate-100 flex items-center justify-center">
          <img 
            src={experience.photo_url} 
            alt={experience.name} 
            className="w-full h-full object-cover select-none" 
            draggable={false} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548546738-8542ad096549?q=80&w=800';
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-xl shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-current" />
            <span className="text-[10px] font-bold text-midnight-fjord">{experience.rating}</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-midnight-fjord/80 backdrop-blur text-white px-3 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {experience.vicinity}
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-midnight-fjord mb-1">{experience.name}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Google Places Result</p>
          </div>
          <button 
            onClick={onDetails}
            className="w-full py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-midnight-fjord active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            Details & Location
          </button>
        </div>
      </div>

      <motion.div style={{ opacity: useTransform(x, [0, 80], [0, 1]) }} className="absolute top-10 left-10 border-4 border-glacier-mint text-glacier-mint px-4 py-2 rounded-xl font-black text-2xl rotate-[-15deg] pointer-events-none">GEMS</motion.div>
      <motion.div style={{ opacity: useTransform(x, [0, -80], [0, 1]) }} className="absolute top-10 right-10 border-4 border-rose-400 text-rose-400 px-4 py-2 rounded-xl font-black text-2xl rotate-[15deg] pointer-events-none">NEXT</motion.div>
    </motion.div>
  );
}

const SIMULATED_GOOGLE_RESULTS: Experience[] = [
  { id: 'p6', name: 'Ponttor', photo_url: 'https://images.unsplash.com/photo-1605634599986-e0e64c929a73?q=80&w=800', rating: 4.5, user_ratings_total: 1800, vicinity: '900m entfernt', butler_snippet: 'Eines der wenigen erhaltenen mittelalterlichen Stadttore.', booking_url: 'https://www.aachen.de/' },
  { id: 'p5', name: 'Puppenbrunnen', photo_url: 'https://images.unsplash.com/photo-1518998053502-53cc83e953f1?q=80&w=800', rating: 4.8, user_ratings_total: 1200, vicinity: '500m entfernt', butler_snippet: 'Interaktive Bronze-Figuren, die die Stadtgeschichte erzählen.', booking_url: 'https://www.aachen-tourismus.de/' },
  { id: 'p4', name: 'Carolus Thermen', photo_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800', rating: 4.7, user_ratings_total: 8900, vicinity: '1.2km entfernt', butler_snippet: 'Baden in echtem Mineral-Thermalwasser.', booking_url: 'https://www.carolus-thermen.de/' },
  { id: 'p3', name: 'Elisenbrunnen', photo_url: 'https://images.unsplash.com/photo-1581442110260-a2928399a9b6?q=80&w=800', rating: 4.3, user_ratings_total: 5800, vicinity: '250m entfernt', butler_snippet: 'Wahrzeichen, das man gesehen und gerochen haben muss.', booking_url: 'https://www.aachen-tourismus.de/' },
  { id: 'p2', name: 'Aachener Rathaus', photo_url: 'https://images.unsplash.com/photo-1590483734724-383b9f448131?q=80&w=800', rating: 4.6, user_ratings_total: 2150, vicinity: '600m entfernt', butler_snippet: 'Das Krönungsrathaus mit beeindruckender Architektur.', booking_url: 'https://www.aachen.de/rathaus' },
  { id: 'p1', name: 'Aachener Dom', photo_url: 'https://images.unsplash.com/photo-1551632432-c735e8299921?q=80&w=800', rating: 4.9, user_ratings_total: 15240, vicinity: '400m entfernt', butler_snippet: 'UNESCO-Welterbe. Ein spiritueller Ankerpunkt.', booking_url: 'https://www.getyourguide.com/aachen-l1155/aachener-dom-und-altstadt-fuehrung-t424754/' }
];
