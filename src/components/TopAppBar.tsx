import React from 'react';
import Link from 'next/link';

interface TopAppBarProps {
  title?: string;
  subtitle?: React.ReactNode;
}

export default function TopAppBar({
  title = "STIVARD",
  subtitle
}: TopAppBarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <div className="flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-10 h-10 flex-shrink-0">
            <img 
              alt="Stivard Logo" 
              className="w-full h-full object-contain mix-blend-multiply" 
              src="/logo.png"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-[#1A2B3C] dark:text-white uppercase">{title}</h1>
            {subtitle && (
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest flex items-center gap-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <Link href="/profile" className="text-[#1A2B3C] dark:text-slate-100 active:scale-95 duration-200 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-[32px]">account_circle</span>
        </Link>
      </div>
    </nav>
  );
}
