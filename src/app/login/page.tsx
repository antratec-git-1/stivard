'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopAppBar from '@/components/TopAppBar';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '4321') {
      // Set cookie for 1 hour
      const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
      document.cookie = `stivard_auth=true; path=/; expires=${expires}; SameSite=Lax`;
      
      // Redirect to affiliate manager
      router.push('/affiliate');
      router.refresh(); // Refresh to ensure middleware sees the cookie
    } else {
      setError('Ungültiges Passwort. Bitte versuche es erneut.');
    }
  };

  return (
    <>
      <TopAppBar title="AUTHENTICATION" />
      
      <main className="min-h-screen flex items-center justify-center p-6 bg-cloud-white">
        <div className="w-full max-w-md bg-white p-10 rounded-[40px] nordic-shadow border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-midnight-fjord flex items-center justify-center text-white mb-8">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          
          <h1 className="font-display-lg text-headline-md text-midnight-fjord mb-2 text-center">Manager Login</h1>
          <p className="text-slate-stone text-sm text-center mb-8">Bitte gib dein Zugangspasswort ein, um fortzufahren.</p>
          
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div className="space-y-2">
              <label className="font-label-caps text-[10px] text-slate-stone block ml-1">PASSWORT</label>
              <input 
                type="password"
                required
                autoFocus
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all font-mono"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-xs text-center font-medium">{error}</p>
            )}
            
            <button 
              type="submit"
              className="w-full py-4 bg-midnight-fjord text-white rounded-full font-label-caps text-label-caps hover:shadow-lg transition-all active:scale-[0.98] mt-2"
            >
              ZUGANG FREISCHALTEN
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-50 w-full text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              STIVARD SECURE ACCESS
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
