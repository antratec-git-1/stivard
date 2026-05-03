import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-12 md:py-24 max-w-[1200px] mx-auto overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-glacier-mint/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary-fixed/30 rounded-full blur-[100px]"></div>
      
      {/* Top Left Logo */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 z-50 flex items-center gap-2">
        <img src="/logo.png" alt="Stivard Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain mix-blend-multiply" />
        <span className="text-lg font-bold tracking-tighter text-midnight-fjord">STIVARD</span>
      </div>

      {/* Top Section: Brand Identity */}
      <header className="w-full flex flex-col items-center z-10 pt-8">
        <div className="mb-4">
          <span className="text-label-caps font-label-caps text-slate-stone uppercase tracking-[0.2em]">Premium Hospitality</span>
        </div>
        <h1 className="text-display-lg font-display-lg text-midnight-fjord tracking-tighter uppercase">STIVARD</h1>
      </header>
      
      {/* Central Mascot Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 space-y-8">
        <div className="relative group">
          {/* Floating Decorative Pebbles (Brand Anchor) */}
          <div className="absolute -top-4 -left-8 w-12 h-10 bg-glacier-mint/40 pebble-shape blur-sm animate-pulse"></div>
          <div className="absolute bottom-12 -right-6 w-8 h-8 bg-midnight-fjord/5 pebble-shape blur-[2px]"></div>
          <div className="w-64 h-64 md:w-80 md:h-80 relative overflow-hidden pebble-shape shadow-2xl shadow-midnight-fjord/10 bg-white">
            <img 
              alt="Stewart the digital concierge" 
              className="w-full h-full object-cover transform scale-110 group-hover:scale-105 transition-transform duration-700 ease-out" 
              src="https://lh3.googleusercontent.com/aida/ADBb0ujTfLt_Oxu2-zg2k2K2_sCLuMp1mymHIHEal9KjoeqM6w_C43uW-C0SZEG1d_YJH3YgBIRt_dFeggzjtZKQoDC0DnNkfCjEGqv0aQynHlBM2gIKuDPo8MeZg4t638nrIf5IYkjMJ-UP0J8Ntk-RXu3sPT8HPx67gZOgPXQvaEa5f85h6L64tutpEi8_6FksMFlwoaLgQJdQmahk8LPc39P0svJa4wFad2boK4eYUjpYBJ0hmvS71s007-ffiJlCl7mziXN2EuFmQH8"
            />
          </div>
          {/* Soft Glow behind Mascot */}
          <div className="absolute inset-0 bg-glacier-mint/20 blur-3xl -z-10 rounded-full"></div>
        </div>
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="text-headline-md font-headline-md text-midnight-fjord">Welcome to STIVARD</h2>
          <p className="text-body-lg font-body-lg text-slate-stone">Your personal digital concierge, redefining the art of high-end service.</p>
        </div>
      </div>
      
      {/* Bottom Section: CTA and Navigation Guidance */}
      <footer className="w-full flex flex-col items-center z-10 space-y-8">
        {/* Progress Indicator (The Varde) */}
        <div className="flex space-x-3 items-center">
          <div className="w-4 h-3 bg-glacier-mint pebble-shape shadow-sm shadow-glacier-mint/50"></div>
          <div className="w-3 h-2 bg-surface-variant pebble-shape"></div>
          <div className="w-3 h-2 bg-surface-variant pebble-shape"></div>
        </div>
        <div className="w-full max-w-xs">
          <Link href="/chat" className="w-full py-5 bg-glacier-mint hover:bg-glacier-mint/90 text-midnight-fjord font-headline-sm rounded-full shadow-lg shadow-mint-glow transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
            Get Started
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        {/* Nordic Minimalist Detail */}
        <div className="flex items-center space-x-6 text-slate-stone/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="text-label-caps font-label-caps">Secure</span>
          </div>
          <div className="w-1 h-1 bg-slate-stone/30 rounded-full"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="text-label-caps font-label-caps">Verified</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
