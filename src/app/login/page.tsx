"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (action: 'login' | 'register', e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (action === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Registrierung erfolgreich! Du bist jetzt eingeloggt.');
        setTimeout(() => router.push('/itinerary'), 1500);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/itinerary');
      }
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm p-8 border border-slate-100">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-glacier-mint/10 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-glacier-mint" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-midnight-fjord text-center mb-2 tracking-tight">Stivard</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Bitte melde dich an, um auf dein Itinerary zuzugreifen.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-glacier-mint/20 text-midnight-fjord rounded-2xl text-sm font-medium">
            {message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">E-Mail Adresse</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-midnight-fjord focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                placeholder="alexander@stivard.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Passwort</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-midnight-fjord focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={(e) => handleAuth('register', e)}
              disabled={isLoading}
              className="w-full py-4 bg-white border border-slate-200 text-midnight-fjord rounded-2xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Registrieren
            </button>
            <button
              onClick={(e) => handleAuth('login', e)}
              disabled={isLoading}
              className="w-full py-4 bg-midnight-fjord text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Login <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
