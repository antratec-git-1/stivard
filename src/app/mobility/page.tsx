'use client';

import React from 'react';
import TopAppBar from '@/components/TopAppBar';

export default function MobilityPage() {
  return (
    <div className="min-h-screen bg-cloud-white pb-24">
      <TopAppBar 
        title="MOBILITÄT" 
        subtitle={
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">directions_car</span>
            Nahtlos Unterwegs
          </span>
        }
      />

      <main className="pt-24 px-6 max-w-md mx-auto">
        <section className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-display-sm font-display-sm text-midnight-fjord mb-4">Mobilität</h2>
          <p className="text-body-lg text-slate-stone leading-relaxed">
            Deine nahtlose Mobilität – von Shuttles bis zu exklusiven Mietwagen – wird hier bald verfügbar sein.
          </p>
        </section>

        {/* Placeholder for content */}
        <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-300">
          <span className="material-symbols-outlined text-[48px] mb-2">commute</span>
          <p className="text-label-caps font-medium">Coming Soon</p>
        </div>
      </main>
    </div>
  );
}
