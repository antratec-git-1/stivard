"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gem, MessageSquare, Calendar, Briefcase } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'GEMS', path: '/gems', icon: Gem },
    { name: 'STEWART', path: '/chat', icon: MessageSquare },
    { name: 'ITINERARY', path: '/itinerary', icon: Calendar },
    { name: 'MANAGER', path: '/affiliate', icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe">
      <div className="flex justify-around items-center px-2 pt-4 pb-8 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-300 ease-out flex-1 ${
                isActive 
                  ? 'text-midnight-fjord' 
                  : 'text-slate-300 hover:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-1.5 transition-all ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-glacier-mint rounded-full shadow-[0_0_8px_rgba(127,255,212,0.8)]" />
                )}
              </div>
              <span className={`text-[9px] font-bold tracking-[0.1em] transition-all ${isActive ? 'text-midnight-fjord' : 'text-slate-300'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
