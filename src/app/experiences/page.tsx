'use client';

import React from 'react';
import TopAppBar from '@/components/TopAppBar';

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-cloud-white pb-24">
      <TopAppBar 
        title="ENTDECKEN" 
        subtitle={
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">explore</span>
            Insider-Erlebnisse
          </span>
        }
      />

      <main className="pt-24 px-6 max-w-md mx-auto">
        <section className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-display-sm font-display-sm text-midnight-fjord mb-4">Entdecken</h2>
          <p className="text-body-lg text-slate-stone leading-relaxed">
            Entdecke bald handverlesene Insider-Erlebnisse und verborgene Schätze.
          </p>
        </section>

        {/* Placeholder for content */}
        <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-300">
          <span className="material-symbols-outlined text-[48px] mb-2">map</span>
          <p className="text-label-caps font-medium">Coming Soon</p>
        </div>
      </main>
    </div>
  );
}
