import React from 'react';
import Link from 'next/link';
import WeatherWidget from '@/components/WeatherWidget';

export default function DashboardPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-container-max mx-auto">
          {/* Varde Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Stivard Logo" className="w-8 h-8 object-contain mix-blend-multiply" />
            <span className="text-xl font-bold tracking-tighter text-[#1A2B3C] dark:text-white ml-2">STIVARD</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-midnight-fjord font-semibold font-body-md" href="/dashboard">Discovery</Link>
            <Link className="text-slate-500 hover:opacity-80 transition-opacity font-body-md" href="#">Reservations</Link>
            <Link className="text-slate-500 hover:opacity-80 transition-opacity font-body-md" href="/chat">Concierge</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">search</button>
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white hover:opacity-80 transition-opacity active:scale-95 duration-200 cursor-pointer">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ujTfLt_Oxu2-zg2k2K2_sCLuMp1mymHIHEal9KjoeqM6w_C43uW-C0SZEG1d_YJH3YgBIRt_dFeggzjtZKQoDC0DnNkfCjEGqv0aQynHlBM2gIKuDPo8MeZg4t638nrIf5IYkjMJ-UP0J8Ntk-RXu3sPT8HPx67gZOgPXQvaEa5f85h6L64tutpEi8_6FksMFlwoaLgQJdQmahk8LPc39P0svJa4wFad2boK4eYUjpYBJ0hmvS71s007-ffiJlCl7mziXN2EuFmQH8" alt="Profile" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-container-max mx-auto min-h-screen">
        {/* Welcome Section */}
        <section className="mb-stack-lg">
          <p className="font-label-caps text-on-tertiary-container uppercase tracking-widest mb-2">Personal Concierge</p>
          <h1 className="font-display-lg text-display-lg text-midnight-fjord mb-4">Welcome to your discovery journey, <span className="text-slate-stone">Alexander</span></h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
            Stewart has curated these exclusive Scandinavian experiences based on your preference for quiet luxury and artisanal craftsmanship.
          </p>
        </section>

        {/* Bento Grid: Hidden Gems */}
        <section className="mb-stack-lg">
          <div className="flex items-center justify-between mb-stack-md">
            <h2 className="font-headline-md text-headline-md">Hidden Gems</h2>
            <button className="text-midnight-fjord font-semibold flex items-center gap-1 group">
              View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Large Highlight Card */}
            <div className="md:col-span-8 group cursor-pointer">
              <div className="relative h-[440px] rounded-[32px] overflow-hidden pebble-shadow bg-white transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-fjord/80 via-transparent to-transparent z-10"></div>
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP2sSAXYzAfg5ncfGNi0xYX602hv_GUomYQVFT05b4qlM0XDTQm6cCbqQu0WQzuCt00lvJJmgLQtxLyajYYBQuJMAU-62uUkn5pxvUB8JEWA7xDC4O7j7oBcJCg2RQRr27PKXLmlKCFVErC74yvXi4qfzwihvJkBIlaFEnS628JKBk8_HlfhtG4Dj_SbDW4dFNO_Cwu9WSagTo3R8XPOwPT5le1H45zcJ_muvEDKVfy0q9U20MOIQh0jYTMOUJcjsMcMslKT8U8l_k" alt="The Glass Atelier" />
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                  <span className="inline-block px-3 py-1 bg-glacier-mint/90 text-midnight-fjord font-label-caps rounded-full mb-4 glass-effect">EXCLUSIVE ACCESS</span>
                  <h3 className="font-headline-md text-headline-md text-white mb-2">The Glass Atelier: Private Viewing</h3>
                  <p className="text-white/80 font-body-md max-w-md">An intimate evening at the Stockholm Archive, featuring unreleased collections from master Nordic blowers.</p>
                </div>
              </div>
            </div>

            {/* Vertical Card */}
            <div className="md:col-span-4 group cursor-pointer">
              <div className="relative h-[440px] rounded-[32px] overflow-hidden pebble-shadow bg-white transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-fjord/60 via-transparent to-transparent z-10"></div>
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe5m-gMGN3PC97GELXhOnBfzfmPHnzTxWfW523DKeNnkJNbYXtJAvYyDM4toXeP8nX-xQUedFrI20eIq1n8nV1XNHm98w_uoTHPMSVvNCznPwjJ9ECdyUyxxhrw8L2jl4YENSiRGQjbR5aM353yE-vOsMT_SMWFDaT5eQOfxeMTYpMxUELgkB-tPXysTsK5H4NgDCMrdcOCijRJpPgX_QZbJlstrSBXiHIU9YEQQEdOiL8vRcfMChDzEbIbA4X-H6YqCJ70wcT7W9v" alt="Gastronomy" />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="font-headline-sm text-headline-sm text-white mb-2">Fjord-to-Table Gastronomy</h3>
                  <p className="text-white/80 font-body-md">Artisanal 12-course tasting menu at the edge of the world.</p>
                </div>
              </div>
            </div>

            {/* Smaller Bento Pieces */}
            <div className="md:col-span-4 group cursor-pointer">
              <div className="bg-white p-6 rounded-[32px] pebble-shadow h-full flex flex-col justify-between transition-all duration-300 hover:bg-glacier-mint/10">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center mb-4 text-midnight-fjord">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-midnight-fjord mb-2">Stewart's Secret: Archipelago Flight</h3>
                  <p className="text-secondary font-body-md">Private sea-plane transfer to a hidden island sauna, exclusively for Stivard guests.</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-semibold text-midnight-fjord">Book Now</span>
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">north_east</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 group cursor-pointer">
              <div className="relative h-[300px] rounded-[32px] overflow-hidden pebble-shadow bg-white">
                <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXiusTzHsOJi45bdEJrmUY5UugW-fIav4VAewx4GywQzf7tliab1-jWIGuiFkP0ZxHdlOI6uRTIMm4VWnVzEIwDaLXjPiuUGKUAXqi7SOVtV71qjTYe1QCXpgrPWbqUV4FvdFYJYdYgtz2yybHi3su1bNtK9RJqfHhRSGfkbzjBzj5kiNze59FZBZ-TpJATe4QcVhedNYit5fKVMpLtbORidiWaNRj9fT23P8qtYeQYSVb-ly8K1wncr17jxHWGUlfEqtniICxtkFo" alt="Silent Spa Sanctuary" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-20">
                  <h3 className="font-headline-sm text-white drop-shadow-md">Silent Spa Sanctuary</h3>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 group cursor-pointer">
              <WeatherWidget />
            </div>
          </div>
        </section>

        {/* Stewart Interaction Component */}
        <div className="fixed bottom-32 right-6 md:right-12 z-40 group">
          <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-white rounded-3xl pebble-shadow opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-none">
            <p className="text-sm font-medium leading-relaxed">"Alexander, I've noticed you enjoy minimalist design. Would you like to see our tour of the Alvar Aalto studio?"</p>
            <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-white rotate-45"></div>
          </div>
          <Link href="/chat" className="w-16 h-16 rounded-[22px] bg-midnight-fjord flex items-center justify-center mint-glow-effect hover:scale-105 active:scale-95 transition-all">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ujTfLt_Oxu2-zg2k2K2_sCLuMp1mymHIHEal9KjoeqM6w_C43uW-C0SZEG1d_YJH3YgBIRt_dFeggzjtZKQoDC0DnNkfCjEGqv0aQynHlBM2gIKuDPo8MeZg4t638nrIf5IYkjMJ-UP0J8Ntk-RXu3sPT8HPx67gZOgPXQvaEa5f85h6L64tutpEi8_6FksMFlwoaLgQJdQmahk8LPc39P0svJa4wFad2boK4eYUjpYBJ0hmvS71s007-ffiJlCl7mziXN2EuFmQH8" alt="Stewart" />
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
