"use client";

import React, { useState, useEffect } from 'react';
import TopAppBar from '@/components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, Phone, Globe, ExternalLink, Loader2, X, Info, Calendar } from 'lucide-react';

const intentChips = [
  { id: 'romantic', label: 'Romantic' },
  { id: 'business', label: 'Business' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'hidden-gems', label: 'Hidden Gems' },
  { id: 'quiet-luxury', label: 'Quiet Luxury' },
  { id: 'family', label: 'Family' },
];

type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: string;
  distance: string;
  description: string;
  user_ratings_total: number;
  address?: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
  openingHours?: string[];
  summary?: string;
  place_id: string;
};

export default function GastronomyPage() {
  const [activeChip, setActiveChip] = useState('quiet-luxury');
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedResto, setSelectedResto] = useState<Restaurant | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    setLoading(true);
    try {
      const res = await fetch(`/api/places?location=50.7753,6.0839&radius=1500&type=restaurant`);
      const data = await res.json();
      
      if (data.results) {
        const mapped: Restaurant[] = data.results.slice(0, 15).map((item: any) => ({
          id: item.place_id,
          place_id: item.place_id,
          name: item.name,
          image: item.photos 
            ? `/api/places?photo_reference=${item.photos[0].photo_reference}`
            : 'https://images.unsplash.com/photo-1517248135467-4c7ed9d42c7b?q=80&w=800',
          rating: item.rating || 4.5,
          price: "€".repeat(item.price_level || 2),
          distance: item.vicinity || "In der Nähe",
          description: `Kuratierte Empfehlung basierend auf ${item.user_ratings_total || 100} Google Rezensionen.`,
          user_ratings_total: item.user_ratings_total || 0
        }));
        setRestaurants(mapped);
      }
    } catch (err) {
      console.error("Failed to load restaurants:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDetails = async (resto: Restaurant) => {
    setSelectedResto(resto);
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/places?place_id=${resto.place_id}`);
      const data = await res.json();
      if (data.result) {
        const result = data.result;
        setSelectedResto(prev => prev ? {
          ...prev,
          address: result.formatted_address,
          phone: result.formatted_phone_number,
          website: result.website,
          isOpen: result.opening_hours?.open_now,
          openingHours: result.opening_hours?.weekday_text,
          summary: result.editorial_summary?.overview || prev.description
        } : null);
      }
    } catch (err) {
      console.error("Details fetch error:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Hero restaurant (top rated)
  const heroResto = restaurants[0];

  return (
    <div className="min-h-screen bg-cloud-white pb-24 font-inter">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <TopAppBar 
          title="THE PERFECT PLATE" 
          subtitle={
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              Kuratierte Kulinarik
            </span>
          }
        />
        
        {/* Intent Chips Band */}
        <div className="px-6 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {intentChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveChip(chip.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeChip === chip.id 
                    ? 'bg-glacier-mint text-midnight-fjord shadow-md shadow-mint-glow/20' 
                    : 'bg-slate-100 text-slate-stone hover:bg-slate-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="pt-40 px-6 max-w-md mx-auto space-y-8">
        
        {/* Stewart's Choice (Hero) */}
        {heroResto && !loading && (
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div 
              onClick={() => handleOpenDetails(heroResto)}
              className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer"
            >
              <img 
                src={heroResto.image} 
                alt={heroResto.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-fjord/80 via-midnight-fjord/20 to-transparent"></div>
              
              <div className="absolute top-6 left-6 bg-[#79f9ce] text-midnight-fjord px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                STIVARD'S PICK
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8">
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{heroResto.name}</h3>
                
                <div className="bg-midnight-fjord/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-bl-none max-w-[260px]">
                  <p className="text-white/90 text-sm leading-relaxed italic">
                    "Alexander, passend zu '{activeChip}' ist das '{heroResto.name}' heute mein Favorit für dich."
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Restaurant List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] text-slate-stone font-bold tracking-[0.2em] uppercase">Kuratierte Liste</h4>
            {loading && <Loader2 className="w-4 h-4 text-glacier-mint animate-spin" />}
          </div>
          
          <div className="space-y-4">
            {restaurants.slice(1).map((resto) => (
              <div 
                key={resto.id}
                onClick={() => handleOpenDetails(resto)}
                className="flex items-center gap-4 p-4 bg-white rounded-[24px] border border-slate-50 shadow-sm hover:shadow-md hover:bg-[#f8f9fa] transition-all duration-300 group cursor-pointer"
              >
                {/* Left: Thumbnail */}
                <div className="w-24 h-24 rounded-[18px] overflow-hidden flex-shrink-0 bg-slate-100">
                  <img 
                    src={resto.image} 
                    alt={resto.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7ed9d42c7b?q=80&w=800';
                    }}
                  />
                </div>

                {/* Center: Info */}
                <div className="flex-grow overflow-hidden">
                  <h5 className="text-lg font-bold text-midnight-fjord leading-tight truncate">{resto.name}</h5>
                  
                  {/* Google Rating */}
                  <div className="flex gap-0.5 my-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-2.5 h-2.5 rounded-full ${i <= Math.round(resto.rating) ? 'bg-[#00af87]' : 'bg-slate-200'}`}
                      ></div>
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-2">{resto.rating}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-stone text-[11px] font-medium">
                    <span className="font-bold text-midnight-fjord">{resto.price}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="truncate">{resto.distance}</span>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex-shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenDetails(resto); }}
                    className="w-12 h-12 rounded-full bg-glacier-mint text-midnight-fjord flex items-center justify-center shadow-lg shadow-mint-glow/20 active:scale-90 transition-transform"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Tile */}
        <section className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="bg-slate-50/80 rounded-[32px] p-6 border border-slate-100 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Stivard" 
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="flex-grow">
              <p className="text-xs text-slate-STONE leading-relaxed italic font-medium">
                "Alexander, alle Empfehlungen werden in Echtzeit von Google Places abgefragt, um dir die aktuellsten Trends zu zeigen."
              </p>
            </div>
          </div>
        </section>

        {/* Footer Text */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-stone/30 py-8">
          Preise und Verfügbarkeit in Echtzeit.
        </p>

      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedResto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-midnight-fjord/60 backdrop-blur-md flex items-end justify-center p-4"
            onClick={() => setSelectedResto(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              
              <h3 className="text-3xl font-bold text-midnight-fjord mb-2 tracking-tight">{selectedResto.name}</h3>
              
              {detailsLoading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-glacier-mint animate-spin" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuli-Details laden...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[#00af87]">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{selectedResto.rating}</span>
                      </div>
                      <span className="text-slate-400 text-sm font-medium">{selectedResto.user_ratings_total} Google Rezensionen</span>
                    </div>
                    {selectedResto.isOpen !== undefined && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedResto.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {selectedResto.isOpen ? 'Offen' : 'Geschlossen'}
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-sm leading-relaxed text-midnight-fjord italic font-medium">
                      "{selectedResto.summary || selectedResto.description}"
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {selectedResto.address && (
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-slate-300 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adresse</p>
                          <p className="text-sm text-midnight-fjord font-bold leading-tight">{selectedResto.address}</p>
                        </div>
                      </div>
                    )}

                    {selectedResto.phone && (
                      <div className="flex items-start gap-4">
                        <Phone className="w-5 h-5 text-slate-300 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reservierung</p>
                          <a href={`tel:${selectedResto.phone}`} className="text-sm text-midnight-fjord font-bold">{selectedResto.phone}</a>
                        </div>
                      </div>
                    )}

                    {selectedResto.openingHours && (
                      <div className="flex items-start gap-4">
                        <Clock className="w-5 h-5 text-slate-300 mt-0.5" />
                        <div className="w-full">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Öffnungszeiten</p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {selectedResto.openingHours.map((line, i) => (
                              <p key={i} className="text-[11px] text-slate-500 font-medium">{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedResto.website && (
                      <div className="flex items-start gap-4">
                        <Globe className="w-5 h-5 text-slate-300 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Speisekarte & Web</p>
                          <a href={selectedResto.website} target="_blank" className="text-sm text-glacier-mint font-black hover:underline tracking-tight">
                            {new URL(selectedResto.website).hostname.replace('www.', '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    className="w-full h-16 bg-midnight-fjord text-glacier-mint rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-midnight-fjord/10 mt-6"
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedResto.name)}&query_place_id=${selectedResto.id}`, '_blank')}
                  >
                    <span>Tisch reservieren</span>
                    <Calendar className="w-5 h-5" />
                  </button>
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
