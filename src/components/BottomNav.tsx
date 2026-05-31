"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Handshake, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'HOME', path: '/itinerary', icon: Home, matchPaths: ['/', '/itinerary'] },
    { name: 'STEWART', path: '/chat', icon: MessageSquare, matchPaths: ['/chat'] },
    { name: 'PARTNERS', path: '/affiliate', icon: Handshake, matchPaths: ['/affiliate', '/experiences'] },
    { name: 'PROFILE', path: '/profile', icon: User, matchPaths: ['/profile'] },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#F9FAFB]/95 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.02)] pb-safe">
      <div className="flex justify-around items-center px-4 py-3.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.matchPaths.some(p => pathname === p || (p !== '/' && pathname.startsWith(p)));
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className="flex flex-col items-center gap-1.5 transition-all active:scale-95 duration-300"
            >
              <div 
                className={`w-16 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#e2ede7] text-[#00aa6c]' 
                    : 'text-slate-400 hover:text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              </div>
              <span 
                className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-[#00aa6c]' : 'text-slate-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
