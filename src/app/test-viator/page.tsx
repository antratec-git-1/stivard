"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  CreditCard, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Compass,
  Image as ImageIcon,
  ExternalLink,
  Ticket,
  Plus,
  Check,
  Calendar,
  Activity,
  Wifi,
  WifiOff,
  Code
} from 'lucide-react';
import { searchViatorAction, testViatorConnection } from './actions';
import { supabase } from '@/lib/supabase';

const ALEXANDER_ID = '00000000-0000-0000-0000-000000000001';

type ViatorProduct = {
  productCode: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  duration: {
    fixedDurationInMinutes?: number;
    text?: string;
  };
  pricing: {
    summary: {
      fromPrice: number;
    };
  };
  productUrl: string;
};

type Trip = {
  id: string;
  name: string;
};

export default function ViatorTestPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ViatorProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [rawData, setRawData] = useState<any>(null);
  
  const [connStatus, setConnStatus] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  const [connError, setConnError] = useState<string | null>(null);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    const { data } = await supabase.from('trips').select('id, name').eq('user_id', ALEXANDER_ID);
    if (data && data.length > 0) {
      setTrips(data);
      setSelectedTripId(data[0].id);
    }
  }

  const handleTestConnection = async () => {
    setConnStatus('checking');
    setConnError(null);
    try {
      const res = await testViatorConnection();
      if (res.success) {
        setConnStatus('ok');
      } else {
        setConnStatus('fail');
        setConnError(`Status ${res.status}: ${res.message}`);
      }
    } catch (err: any) {
      setConnStatus('fail');
      setConnError(err.message);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setRawData(null);
    try {
      const data = await searchViatorAction(query);
      setRawData(data);
      
      // DEEP EXTRACTION LOGIC
      let rawProducts = [];
      if (data.searchTypes) {
        const productType = data.searchTypes.find((s: any) => s.searchType === "PRODUCTS");
        rawProducts = productType?.products || [];
      } else if (data.products) {
        rawProducts = data.products.results || data.products || [];
      } else if (data.data) {
        rawProducts = data.data.products || data.data || [];
      }
      
      const products = rawProducts.map((p: any) => ({
        productCode: p.productCode,
        title: p.title,
        description: p.description || p.shortDescription || '',
        image: p.images?.[0]?.variants?.find((v: any) => v.width >= 400)?.url || p.images?.[0]?.variants?.[0]?.url,
        rating: p.reviews?.combinedAverageRating || p.rating || 0,
        reviewsCount: p.reviews?.totalReviews || p.reviewsCount || 0,
        duration: p.itinerary?.duration || p.duration || {},
        pricing: p.pricing || { summary: { fromPrice: 0 } },
        productUrl: p.productUrl
      }));
      setResults(products);
    } catch (err: any) {
      console.error("Viator Search Error:", err);
      setError(err.message || "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }
  };

  const addToItinerary = async (product: ViatorProduct) => {
    if (!selectedTripId) return;
    setAddingId(product.productCode);
    try {
      const { error } = await supabase.from('itinerary_items').insert([{
        user_id: ALEXANDER_ID,
        trip_id: selectedTripId,
        type: 'gem',
        category: 'activity',
        title: product.title,
        description: product.description.substring(0, 200) + '...',
        start_time: new Date().toISOString(),
        status: 'confirmed',
        location_name: 'Viator Experience',
        external_url: product.productUrl
      }]);
      if (error) throw error;
      setAddedIds([...addedIds, product.productCode]);
    } catch (err) {
      console.error("Add error:", err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-midnight-fjord font-inter pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-glacier-mint/5 to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="w-16 h-16 bg-midnight-fjord rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-midnight-fjord/20"><Ticket className="w-8 h-8 text-glacier-mint" /></div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Viator Live-Center</h1>
          <p className="text-slate-400 font-medium max-w-xs mx-auto">V2 Production API • Berlin, Aachen & Weltweit</p>
        </motion.div>
      </header>

      <div className="max-w-md mx-auto px-6 -mt-8 relative z-20 space-y-4">
        {/* Status Check Card */}
        <div className="bg-white rounded-[28px] shadow-xl border border-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-glacier-mint" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Verbindung</h3>
            </div>
            {connStatus === 'ok' && <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5"><Wifi className="w-3 h-3" /> Online</div>}
            {connStatus === 'fail' && <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5"><WifiOff className="w-3 h-3" /> Fehler</div>}
            {connStatus === 'idle' && <div className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5">Bereit</div>}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleTestConnection}
              disabled={connStatus === 'checking'}
              className="flex-1 h-12 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-midnight-fjord transition-all flex items-center justify-center gap-2"
            >
              {connStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ping'}
            </button>
            <button 
              onClick={() => setShowRaw(!showRaw)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${showRaw ? 'bg-glacier-mint text-midnight-fjord' : 'bg-slate-50 text-slate-400'}`}
            >
              <Code className="w-5 h-5" />
            </button>
          </div>

          {connError && (
            <div className="p-3 bg-rose-50 rounded-xl text-[10px] font-bold text-rose-500 leading-relaxed border border-rose-100">{connError}</div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-[28px] shadow-2xl shadow-midnight-fjord/10 p-2 flex items-center gap-2 border border-white">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-slate-300" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Ort oder Tour suchen..." className="w-full py-4 text-sm font-bold bg-transparent outline-none placeholder:text-slate-300" />
          </div>
          <button onClick={handleSearch} disabled={loading} className="bg-midnight-fjord text-white px-6 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 min-w-[100px]">{loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Suchen'}</button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" /><p className="leading-tight">{error}</p></motion.div>
        )}

        {/* Raw Debug View */}
        <AnimatePresence>
          {showRaw && rawData && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-midnight-fjord text-glacier-mint p-4 rounded-3xl overflow-hidden shadow-2xl">
              <h4 className="text-[9px] font-black uppercase tracking-widest mb-3 opacity-50">Raw API Response</h4>
              <pre className="text-[10px] font-mono whitespace-pre-wrap h-64 overflow-y-auto no-scrollbar">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Section */}
      <div className="max-w-md mx-auto px-6 mt-12 space-y-6">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            results.map((product, idx) => (
              <motion.div key={product.productCode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-midnight-fjord/5 transition-all">
                <div className="aspect-[16/10] relative overflow-hidden">
                  {product.image ? (<img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />) : (<div className="w-full h-full bg-slate-100 flex items-center justify-center"><ImageIcon className="w-10 h-10 text-slate-200" /></div>)}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black">{Number(product.rating).toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-slate-400">({product.reviewsCount})</span>
                  </div>
                  <button 
                    onClick={() => addToItinerary(product)}
                    disabled={addingId === product.productCode || addedIds.includes(product.productCode)}
                    className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${addedIds.includes(product.productCode) ? 'bg-glacier-mint text-midnight-fjord' : 'bg-white text-midnight-fjord hover:bg-glacier-mint'}`}
                  >
                    {addingId === product.productCode ? <Loader2 className="w-5 h-5 animate-spin" /> : addedIds.includes(product.productCode) ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h2 className="font-bold text-base leading-tight group-hover:text-glacier-mint transition-colors">{product.title}</h2>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Ab</p>
                      <p className="text-lg font-black text-midnight-fjord">{product.pricing?.summary?.fromPrice ? `€${Math.round(product.pricing.summary.fromPrice)}` : 'Auf Anfrage'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-6 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase tracking-wider">{product.duration?.fixedDurationInMinutes ? `${Math.round(product.duration.fixedDurationInMinutes / 60)} Std` : product.duration?.text || 'Flexibel'}</span></div>
                    </div>
                    <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-glacier-mint text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all">Ansehen <ExternalLink className="w-3.5 h-3.5" /></a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : !loading && query && (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200"><Compass className="w-12 h-12 text-slate-200 mx-auto mb-4" /><p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Keine Ergebnisse gefunden</p></div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
