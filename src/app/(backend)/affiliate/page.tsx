import React from 'react';
import Link from 'next/link';

export default function AffiliatePage() {
  return (
    <>
      {/* TopAppBar Section */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-contain mix-blend-multiply" src="/logo.png" alt="Stivard Logo" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#1A2B3C] dark:text-white uppercase">STIVARD</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link className="font-sans font-semibold tracking-tight text-lg text-slate-500 hover:opacity-80 transition-opacity" href="/dashboard">Overview</Link>
            <Link className="font-sans font-semibold tracking-tight text-lg text-slate-500 hover:opacity-80 transition-opacity" href="#">Analytics</Link>
            <Link className="font-sans font-semibold tracking-tight text-lg text-[#1A2B3C] hover:opacity-80 transition-opacity" href="/affiliate">Partners</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#1A2B3C] text-2xl active:scale-95 duration-200">notifications</button>
            <div className="material-symbols-outlined text-[#1A2B3C] text-3xl active:scale-95 duration-200">account_circle</div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-container-max mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-lg gap-4">
          <div>
            <h1 className="font-display-lg text-display-lg text-midnight-fjord mb-2">Affiliate Manager</h1>
            <p className="font-body-lg text-body-lg text-slate-stone">Precision monitoring for your B2B partner ecosystem.</p>
          </div>
          <button className="bg-glacier-mint text-midnight-fjord px-8 py-3 rounded-full font-label-caps text-label-caps flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            INVITE NEW PARTNER
          </button>
        </div>

        {/* Bento Grid: Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-stack-lg">
          {/* Revenue Overview (Large Card) */}
          <div className="md:col-span-2 glass-card p-stack-md rounded-[32px] nordic-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-label-caps text-label-caps text-slate-stone">REVENUE OVERVIEW</span>
                <h2 className="font-headline-md text-headline-md mt-1">€142,850.00</h2>
              </div>
              <div className="bg-glacier-mint/20 text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold">+12.4%</div>
            </div>
            {/* Mock Bar Chart Visualization */}
            <div className="flex items-end justify-between h-48 gap-2 px-2">
              <div className="w-full bg-slate-200 rounded-t-lg h-2/3 hover:bg-glacier-mint transition-colors"></div>
              <div className="w-full bg-slate-200 rounded-t-lg h-1/2 hover:bg-glacier-mint transition-colors"></div>
              <div className="w-full bg-slate-200 rounded-t-lg h-3/4 hover:bg-glacier-mint transition-colors"></div>
              <div className="w-full bg-midnight-fjord rounded-t-lg h-full transition-colors"></div>
              <div className="w-full bg-slate-200 rounded-t-lg h-5/6 hover:bg-glacier-mint transition-colors"></div>
              <div className="w-full bg-slate-200 rounded-t-lg h-2/3 hover:bg-glacier-mint transition-colors"></div>
              <div className="w-full bg-slate-200 rounded-t-lg h-4/5 hover:bg-glacier-mint transition-colors"></div>
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-slate-stone font-medium">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="glass-card p-stack-md rounded-[32px] nordic-shadow flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-slate-stone">CONVERSION RATE</span>
              <h2 className="font-headline-sm text-headline-sm mt-1">18.2%</h2>
            </div>
            <div className="relative h-24 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90">
                <circle className="text-slate-100" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-glacier-mint" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray="213.6" strokeDashoffset="38" strokeWidth="8"></circle>
              </svg>
              <span className="absolute font-semibold text-xs">Peak</span>
            </div>
            <p className="text-xs text-slate-stone">Above average industry benchmark by 4.2%</p>
          </div>

          {/* Booking Stats */}
          <div className="glass-card p-stack-md rounded-[32px] nordic-shadow flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-slate-stone">ACTIVE BOOKINGS</span>
              <h2 className="font-headline-sm text-headline-sm mt-1">842</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-stone">Airport Transfer</span>
                <span className="text-xs font-semibold">412</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-midnight-fjord h-full w-[65%]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-stone">Private Dining</span>
                <span className="text-xs font-semibold">218</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-glacier-mint h-full w-[35%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Partner Network */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-headline-sm">Partner Network</h3>
              <button className="text-midnight-fjord text-xs font-semibold flex items-center gap-1">VIEW ALL <span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
            <div className="bg-white rounded-[32px] overflow-hidden nordic-shadow border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">PARTNER NAME</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">TIER</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">VOLUME</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">COMMISSION</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center font-bold text-xs text-midnight-fjord">SL</div>
                        <span className="font-medium">SkyLounge Premium</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-midnight-fjord text-white text-[10px] rounded-full">PLATINUM</span></td>
                    <td className="px-6 py-4 text-sm font-medium">€42,100</td>
                    <td className="px-6 py-4"><span className="text-on-tertiary-container font-semibold">15%</span></td>
                    <td className="px-6 py-4 text-right"><span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center font-bold text-xs text-midnight-fjord">VH</div>
                        <span className="font-medium">Vardø Heritage</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-slate-200 text-midnight-fjord text-[10px] rounded-full">GOLD</span></td>
                    <td className="px-6 py-4 text-sm font-medium">€28,450</td>
                    <td className="px-6 py-4"><span className="text-on-tertiary-container font-semibold">12%</span></td>
                    <td className="px-6 py-4 text-right"><span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center font-bold text-xs text-midnight-fjord">NA</div>
                        <span className="font-medium">Nordic Atlas</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-slate-200 text-midnight-fjord text-[10px] rounded-full">GOLD</span></td>
                    <td className="px-6 py-4 text-sm font-medium">€15,200</td>
                    <td className="px-6 py-4"><span className="text-on-tertiary-container font-semibold">12%</span></td>
                    <td className="px-6 py-4 text-right"><span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-headline-sm">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-glacier-mint/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-midnight-fjord">flight_takeoff</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">New Booking: LHR Transfer</p>
                  <p className="text-xs text-slate-stone">Ref: #88291 • Partner: SkyLounge</p>
                  <p className="text-xs mt-2 text-on-tertiary-container font-medium">Earned: €42.50</p>
                </div>
                <span className="ml-auto text-[10px] text-slate-400">2m ago</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400">verified_user</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Partner Onboarded</p>
                  <p className="text-xs text-slate-stone">Helsinki Executive Services</p>
                  <p className="text-xs mt-2 text-midnight-fjord opacity-60">Pending KYC verification</p>
                </div>
                <span className="ml-auto text-[10px] text-slate-400">1h ago</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-glacier-mint/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-midnight-fjord">restaurant</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Private Chef Reserved</p>
                  <p className="text-xs text-slate-stone">Ref: #88289 • Partner: Vardø Heritage</p>
                  <p className="text-xs mt-2 text-on-tertiary-container font-medium">Earned: €128.00</p>
                </div>
                <span className="ml-auto text-[10px] text-slate-400">4h ago</span>
              </div>
            </div>
            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold hover:border-glacier-mint hover:text-midnight-fjord transition-colors">
              DOWNLOAD PDF REPORT
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
