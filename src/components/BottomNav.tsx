"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on the landing page
  if (pathname === '/') {
    return null;
  }

  const navItems = [
    { name: 'HOME', path: '/dashboard', icon: 'grid_view' },
    { name: 'GEMS', path: '/gems', icon: 'explore' },
    { name: 'STEWART', path: '/chat', icon: 'smart_toy' },
    { name: 'MANAGER', path: '/affiliate', icon: 'work' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center px-4 pt-3 pb-6 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center transition-colors active:scale-90 duration-300 ease-out ${
                isActive 
                  ? 'text-glacier-mint' 
                  : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined mb-1 text-[28px]">{item.icon}</span>
              <span className="font-sans text-[11px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
