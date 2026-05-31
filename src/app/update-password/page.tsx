"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, ArrowRight, KeyRound } from 'lucide-react';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const exchangeCode = async () => {
      // Check for PKCE code in URL parameters
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        setIsLoading(true);
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setIsLoading(false);
        if (error) {
          setError('Fehler beim Überprüfen des Reset-Links: ' + error.message);
          return;
        }
        // Remove code from URL to prevent reusing it
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Also listen for implicit flow (hash fragment)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && !window.location.hash) {
          setError('Kein gültiger Reset-Link gefunden. Bitte fordere einen neuen Link an.');
        }
      }
    };
    
    exchangeCode();
    
    // Subscribe to auth state changes to clear errors if session is established
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        setError(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      
      // Successfully updated, redirect to itinerary
      router.push('/itinerary');
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren des Passworts.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm p-8 border border-slate-100">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-glacier-mint/10 rounded-2xl flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-glacier-mint" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-midnight-fjord text-center mb-2 tracking-tight">Neues Passwort</h1>
        <p className="text-slate-500 text-center mb-8 text-sm">Bitte gib dein neues Passwort ein.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleUpdatePassword}>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Neues Passwort</label>
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

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Passwort wiederholen</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-midnight-fjord focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-midnight-fjord text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Passwort speichern <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
