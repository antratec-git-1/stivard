import React from 'react';
import Link from 'next/link';
import TopAppBar from '@/components/TopAppBar';

export default function AboutPage() {
  return (
    <div className="bg-cloud-white text-midnight-fjord min-h-screen pb-32 font-body-md antialiased relative selection:bg-glacier-mint/30 selection:text-midnight-fjord">
      <TopAppBar title="ÜBER UNS" />

      <main className="pt-24 px-6 max-w-container-max mx-auto space-y-12 md:space-y-20">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center pt-8 md:pt-16 text-center">
          <div className="w-32 h-32 md:w-48 md:h-48 mb-8 relative drop-shadow-2xl opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500">
            <img 
              src="/logo.png" 
              alt="Stivard Logo" 
              className="w-full h-full object-contain mix-blend-multiply" 
            />
          </div>
          <span className="font-label-caps text-[10px] md:text-xs text-secondary uppercase tracking-[0.3em] mb-4">The Concierge Evolution</span>
          <h1 className="font-display-lg text-4xl md:text-6xl text-midnight-fjord mb-6 max-w-2xl leading-tight">
            Die Kunst des Reisens <br className="hidden md:block"/> neu definiert.
          </h1>
          <p className="font-body-lg text-lg text-secondary max-w-xl mx-auto leading-relaxed">
            Stivard vereint modernste Künstliche Intelligenz mit der zeitlosen Eleganz skandinavischen Designs, um Gastfreundschaft auf ein neues Level zu heben.
          </p>
        </section>

        {/* Vision Section */}
        <section className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[32px] pebble-shadow border border-slate-50 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-glacier-mint/10 rounded-full blur-3xl group-hover:bg-glacier-mint/20 transition-colors duration-700"></div>
          <h2 className="font-headline-md text-2xl md:text-3xl mb-4 text-[#1A2B3C] relative z-10">Unsere Vision</h2>
          <div className="w-12 h-1 bg-glacier-mint rounded-full mb-6 relative z-10"></div>
          <p className="text-secondary leading-relaxed md:text-lg relative z-10">
            In einer Welt, die immer lauter wird, schaffen wir Orte der Ruhe. Wir glauben daran, dass wahrer Luxus in der Stille, im Detail und in der perfekten, unaufdringlichen Vorahnung deiner Wünsche liegt. Stewart, dein persönlicher digitaler Concierge, lernt deine Präferenzen kennen und kuratiert Erlebnisse, die exakt auf deinen Vibe abgestimmt sind – diskret, präzise und mühelos.
          </p>
        </section>

        {/* Values Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="font-headline-md text-2xl md:text-3xl mb-8 text-center text-[#1A2B3C]">Unsere Werte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-[24px] pebble-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-midnight-fjord border border-slate-100">
                <span className="material-symbols-outlined text-[24px]">diamond</span>
              </div>
              <h3 className="font-headline-sm text-lg mb-3">Quiet Luxury</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Kein Überfluss, sondern Qualität. Wir fokussieren uns auf die essentiellen Details, die deinen Aufenthalt unvergesslich machen.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[24px] pebble-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-glacier-mint/10 rounded-2xl flex items-center justify-center mb-6 text-[#00513d] border border-glacier-mint/20">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <h3 className="font-headline-sm text-lg mb-3">Intuitive KI</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Technologie sollte unsichtbar sein. Unsere Systeme arbeiten im Hintergrund, um dir proaktiv den besten Service zu bieten.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[24px] pebble-shadow hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-midnight-fjord border border-slate-100">
                <span className="material-symbols-outlined text-[24px]">public</span>
              </div>
              <h3 className="font-headline-sm text-lg mb-3">Lokale Expertise</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Wir verbinden dich mit authentischen, skandinavischen Geheimtipps abseits der klassischen Touristenpfade.
              </p>
            </div>

          </div>
        </section>

        {/* Contact/Action Section */}
        <section className="max-w-2xl mx-auto text-center pt-8 pb-16 border-t border-slate-200/60">
          <p className="text-sm text-secondary mb-6">Möchtest du Stivard für dein eigenes Hotel nutzen?</p>
          <a href="mailto:contact@stivard.com" className="inline-flex items-center gap-2 bg-midnight-fjord text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 active:scale-95 transition-all shadow-md">
            <span className="material-symbols-outlined">mail</span>
            Kontakt aufnehmen
          </a>
        </section>

      </main>
    </div>
  );
}
