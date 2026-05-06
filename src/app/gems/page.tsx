import React from 'react';
import Link from 'next/link';
import TopAppBar from '@/components/TopAppBar';
import { supabase } from '@/lib/supabase';
import DynamicWidget from '@/components/DynamicWidget';

export default async function GemsPage() {
  let widgets: any[] = [];
  let debugInfo = {
    isConfigured: !!supabase,
    error: null as string | null,
    dataCount: 0
  };

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('partner_widgets')
        .select('*')
        .eq('active', true)
        .eq('page_slug', 'gems');
        
      if (error) {
        debugInfo.error = error.message;
      } else if (data) {
        widgets = data;
        debugInfo.dataCount = data.length;
      }
    }
  } catch (e: any) {
    debugInfo.error = e.message || "Unknown catch error";
  }

  return (
    <>
      <TopAppBar title="PARTNER & SERVICES" />

      <main className="pt-24 pb-32 px-6 max-w-container-max mx-auto min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col items-start mb-8 mt-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-white flex items-center justify-center">
              <img className="w-8 h-8 object-contain" src="/logo.png" alt="Stivard Logo" />
            </div>
            <h1 className="font-display-lg text-[26px] text-midnight-fjord font-bold leading-tight">Partner & Services</h1>
          </div>
          <p className="text-[14.5px] text-slate-stone leading-relaxed">
            Entdecke exklusive Angebote unserer globalen Partner, kuratiert für deine Reise.
          </p>
        </div>

        {/* Debug Info (Temporarily added for troubleshooting) */}
        <div className="mb-8 p-4 bg-slate-800 text-white rounded-xl text-xs font-mono overflow-x-auto">
          <p className="font-bold mb-2">🔍 Supabase Debug Info:</p>
          <p>Configured: {debugInfo.isConfigured ? 'Yes' : 'No'}</p>
          <p>Data Count: {debugInfo.dataCount}</p>
          {debugInfo.error && <p className="text-red-400 mt-2">Error: {debugInfo.error}</p>}
        </div>

        {/* Dynamic Partner Widgets (CMS) */}
        {widgets.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-glacier-mint">auto_awesome</span>
              <h2 className="text-[20px] font-bold text-midnight-fjord">Partner Highlights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget) => (
                <div key={widget.id} className="bg-white p-5 rounded-[24px] nordic-shadow border border-slate-100 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-secondary-container text-midnight-fjord text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {widget.title}
                    </span>
                    <span className="material-symbols-outlined text-slate-300 text-[20px]">bolt</span>
                  </div>
                  <DynamicWidget htmlCode={widget.embed_code} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Light Card */}
          <div className="bg-white p-5 rounded-[24px] nordic-shadow border border-slate-100 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-secondary-container text-midnight-fjord text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Official Partner
              </span>
              <div className="flex items-center gap-1 text-on-tertiary-container font-bold text-[10px] uppercase tracking-wide">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified
              </div>
            </div>
            
            <div className="w-full h-32 bg-surface-container-low rounded-2xl mb-4 flex items-center justify-center">
              <img className="w-16 h-16 object-contain mix-blend-multiply opacity-80" src="/logo.png" alt="Partner Logo" />
            </div>

            <div className="flex items-center gap-1 text-on-tertiary-container font-bold text-[10px] tracking-wider mb-2 uppercase">
              <span className="material-symbols-outlined text-[14px] fill-current">bolt</span>
              Top-Deal
            </div>
            
            <h2 className="text-[20px] font-bold text-midnight-fjord leading-snug mb-2">
              Exklusive Hotel-<br/>Angebote
            </h2>
            <p className="text-[13px] text-slate-stone leading-relaxed mb-6">
              Spare bis zu 15% auf ausgewählte Unterkünfte weltweit als STIVARD Mitglied.
            </p>
            
            <button className="w-full bg-glacier-mint text-midnight-fjord font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              Unterkünfte finden
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </button>
          </div>

          {/* Dark Card */}
          <div className="bg-midnight-fjord p-5 rounded-[24px] shadow-lg flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Official Partner
              </span>
              <span className="material-symbols-outlined text-glacier-mint text-[20px]">star</span>
            </div>
            
            <div className="w-full h-32 bg-white/5 rounded-2xl mb-4 flex items-center justify-center border border-white/10">
              <div className="bg-white p-2 rounded-xl">
                <img className="w-10 h-10 object-contain mix-blend-multiply" src="/logo.png" alt="Partner Logo" />
              </div>
            </div>

            <div className="flex items-center gap-1 text-glacier-mint font-bold text-[10px] tracking-wider mb-2 uppercase">
              <span className="material-symbols-outlined text-[14px] fill-current">bolt</span>
              Top-Deal
            </div>
            
            <h2 className="text-[20px] font-bold text-white leading-snug mb-2">
              Beste Erlebnisse in<br/>Stockholm
            </h2>
            <p className="text-[13px] text-slate-300 leading-relaxed mb-6">
              Handverlesene Touren und Aktivitäten mit exklusivem Express-Check-in.
            </p>
            
            <button className="w-full bg-white text-midnight-fjord font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              Erlebnisse buchen
              <span className="material-symbols-outlined text-[18px]">map</span>
            </button>
          </div>
        </div>

        {/* Weitere Services */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-bold text-midnight-fjord">Weitere Services</h3>
            <button className="text-[13px] text-on-tertiary-container font-medium hover:underline flex items-center">
              Alle anzeigen <span className="material-symbols-outlined text-[16px] ml-0.5">chevron_right</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Item 1 */}
            <div className="bg-white p-4 rounded-2xl nordic-shadow border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-glacier-mint/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[22px]">health_and_safety</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-midnight-fjord">Reiseschutz</span>
                <span className="text-[12px] text-slate-stone">Smart-Insurance Pakete</span>
              </div>
            </div>

            {/* Service Item 2 */}
            <div className="bg-white p-4 rounded-2xl nordic-shadow border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-glacier-mint/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[22px]">directions_car</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-midnight-fjord">Mobilität</span>
                <span className="text-[12px] text-slate-stone">Premium Mietwagen & Shuttles</span>
              </div>
            </div>

            {/* Service Item 3 */}
            <div className="bg-white p-4 rounded-2xl nordic-shadow border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-glacier-mint/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-tertiary-container text-[22px]">luggage</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-midnight-fjord">Gepäckservice</span>
                <span className="text-[12px] text-slate-stone">Door-to-Door Transport</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
