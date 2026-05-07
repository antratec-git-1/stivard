'use client';

import React from 'react';
import Link from 'next/link';
import TopAppBar from '@/components/TopAppBar';

const categories = [
  {
    id: 'gastronomy',
    title: 'The Perfect Plate',
    subLabel: 'KURATIERTE KULINARIK',
    image: '/images/hub/gastronomy.png',
    icon: 'restaurant',
    href: '/gastronomy'
  },
  {
    id: 'experiences',
    title: 'Entdecken',
    subLabel: 'INSIDER-ERLEBNISSE',
    image: '/images/hub/experiences.png',
    icon: 'explore',
    href: '/experiences'
  },
  {
    id: 'hotel',
    title: 'Mein Hotel',
    subLabel: 'SERVICES & WELLNESS',
    image: '/images/hub/hotel.png',
    icon: 'spa',
    href: '/hotel'
  },
  {
    id: 'mobility',
    title: 'Mobilität',
    subLabel: 'NAHTLOS UNTERWEGS',
    image: '/images/hub/mobility.png',
    icon: 'directions_car',
    href: '/mobility'
  }
];

export default function DiscoveryHub() {
  return (
    <div className="min-h-screen bg-cloud-white pb-24">
      {/* Top App Bar */}
      <TopAppBar 
        title="STIVARD" 
        subtitle={
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">location_on</span>
            Discovery Journey
          </span>
        }
      />

      <main className="pt-24 px-6 max-w-md mx-auto">
        {/* Welcome Section */}
        <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-label-caps text-slate-stone mb-1 font-medium tracking-widest uppercase">Guten Morgen</p>
          <h2 className="text-display-sm font-display-sm text-midnight-fjord leading-tight">
            Welcome to your discovery journey, Alexander
          </h2>
        </section>

        {/* 2x2 Category Grid */}
        <section className="grid grid-cols-2 gap-4 mb-12">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id}
              href={cat.href}
              className={`relative aspect-[4/5] rounded-[24px] overflow-hidden group shadow-lg shadow-midnight-fjord/5 transition-all duration-500 active:scale-95 hover:shadow-mint-glow/20 animate-in fade-in zoom-in-95 duration-500 delay-${index * 100}`}
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Midnight Fjord Overlay */}
              <div className="absolute inset-0 bg-midnight-fjord/30 group-hover:bg-midnight-fjord/20 transition-colors duration-500"></div>
              
              {/* Category Icon (Glacier Mint) */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-glacier-mint">
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              </div>

              {/* Content Area */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end">
                <p className="text-[9px] font-bold tracking-[0.15em] text-glacier-mint uppercase mb-1 drop-shadow-sm">
                  {cat.subLabel}
                </p>
                <h3 className="text-headline-sm font-headline-sm text-white leading-tight drop-shadow-md">
                  {cat.title}
                </h3>
              </div>
              
              {/* Tap Indicator (Mint Glow) - Visible on active state via CSS or just transition */}
              <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-glacier-mint/30 transition-opacity duration-200 pointer-events-none"></div>
            </Link>
          ))}
        </section>

        {/* AI Mascot Section (Stewart) */}
        <section className="relative flex flex-col items-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-[280px]">
            <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl rounded-bl-none shadow-xl border border-slate-100 animate-in slide-in-from-bottom-2 duration-500 delay-500">
              <p className="text-body-md text-midnight-fjord">
                Alexander, es wird bald regnen. Schau dir die Indoor-Erlebnisse an!
              </p>
            </div>
          </div>
          
          {/* Stewart FAB Unit */}
          <Link href="/chat" className="relative group active:scale-95 transition-transform duration-300">
            <div className="w-20 h-20 bg-white p-1 rounded-full shadow-2xl border-4 border-glacier-mint overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida/ADBb0ujTfLt_Oxu2-zg2k2K2_sCLuMp1mymHIHEal9KjoeqM6w_C43uW-C0SZEG1d_YJH3YgBIRt_dFeggzjtZKQoDC0DnNkfCjEGqv0aQynHlBM2gIKuDPo8MeZg4t638nrIf5IYkjMJ-UP0J8Ntk-RXu3sPT8HPx67gZOgPXQvaEa5f85h6L64tutpEi8_6FksMFlwoaLgQJdQmahk8LPc39P0svJa4wFad2boK4eYUjpYBJ0hmvS71s007-ffiJlCl7mziXN2EuFmQH8" 
                alt="Stewart"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Pulsing indicator */}
            <div className="absolute top-0 right-0 w-6 h-6 bg-glacier-mint rounded-full border-2 border-white flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-[14px] text-midnight-fjord font-bold">bolt</span>
            </div>
          </Link>
          
          <p className="mt-4 text-label-caps text-slate-stone text-center tracking-[0.2em]">Ask Stewart anything</p>
        </section>
      </main>
    </div>
  );
}
