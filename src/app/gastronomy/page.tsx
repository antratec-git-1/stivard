'use client';

import React, { useState } from 'react';
import TopAppBar from '@/components/TopAppBar';

const intentChips = [
  { id: 'romantic', label: 'Romantic' },
  { id: 'business', label: 'Business' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'hidden-gems', label: 'Hidden Gems' },
  { id: 'quiet-luxury', label: 'Quiet Luxury' },
  { id: 'family', label: 'Family' },
];

const restaurants = [
  {
    id: 1,
    name: 'Fjord Tapas',
    image: '/images/restaurants/fjord_dish.png',
    rating: 4.5,
    price: '€€',
    distance: '4 min walk',
    description: 'Modern interpretation of local seafood.',
  },
  {
    id: 2,
    name: 'Aurum Bar',
    image: '/images/restaurants/aurum_bar.png',
    rating: 5.0,
    price: '€€€',
    distance: '8 min walk',
    description: 'Award-winning mixology and golden ambiance.',
  }
];

export default function GastronomyPage() {
  const [activeChip, setActiveChip] = useState('quiet-luxury');

  return (
    <div className="min-h-screen bg-cloud-white pb-24">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <TopAppBar 
          title="THE PERFECT PLATE" 
          subtitle={
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">restaurant</span>
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
                className={`px-4 py-2 rounded-full text-label-caps transition-all duration-300 ${
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
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer">
            <img 
              src="/images/restaurants/lumi_hero.png" 
              alt="Lumi Restaurant" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-fjord/80 via-midnight-fjord/20 to-transparent"></div>
            
            {/* Badge */}
            <div className="absolute top-6 left-6 bg-[#79f9ce] text-midnight-fjord px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              STIVARD'S PICK
            </div>

            {/* Content Area */}
            <div className="absolute bottom-0 left-0 w-full p-8">
              <h3 className="text-display-sm font-display-sm text-white mb-2">Lumi</h3>
              
              {/* AI Explanation Bubble */}
              <div className="bg-midnight-fjord/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-bl-none max-w-[240px]">
                <p className="text-white/90 text-body-sm leading-relaxed italic">
                  "Alexander, passend zu deinem Wunsch nach 'Quiet Luxury' ist das 'Lumi' heute perfekt."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant List */}
        <section className="space-y-6">
          <h4 className="text-label-caps text-slate-stone font-bold tracking-widest">Kuratierte Liste</h4>
          
          <div className="space-y-4">
            {restaurants.map((resto) => (
              <div 
                key={resto.id}
                className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-50 shadow-sm hover:shadow-md hover:bg-[#f3f3f3] transition-all duration-300 group cursor-pointer"
              >
                {/* Left: Thumbnail */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={resto.image} 
                    alt={resto.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Center: Info */}
                <div className="flex-grow">
                  <h5 className="text-headline-sm font-headline-sm text-midnight-fjord leading-tight">{resto.name}</h5>
                  
                  {/* TripAdvisor Bubbles Placeholder */}
                  <div className="flex gap-0.5 my-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-2.5 h-2.5 rounded-full ${i <= resto.rating ? 'bg-[#00af87]' : 'bg-slate-200'}`}
                      ></div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-slate-stone text-body-xs">
                    <span className="font-bold">{resto.price}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span>{resto.distance}</span>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex-shrink-0">
                  <button className="w-12 h-12 rounded-full bg-glacier-mint text-midnight-fjord flex items-center justify-center shadow-lg shadow-mint-glow/20 active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Text */}
        <p className="text-center text-body-xs text-slate-stone/40 py-8">
          Preise und Verfügbarkeit in Echtzeit.
        </p>

      </main>
    </div>
  );
}
