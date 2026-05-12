"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Bed, Compass, Utensils, Car, Plus, Calendar as CalendarIcon, 
  List, Sparkles, MapPin, Clock, X, Plane, Train, Check, Trash2, 
  ChevronDown, Globe, AlertTriangle, Search, Navigation, ArrowRight,
  ArrowDownLeft, ArrowUpRight
} from 'lucide-react';

const ALEXANDER_ID = '00000000-0000-0000-0000-000000000001';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

type ViewMode = 'list' | 'grid';

type Trip = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
};

type ItineraryItem = {
  id: string;
  type: 'booked' | 'gem' | 'ai_slot';
  category: 'hotel' | 'activity' | 'food' | 'transport' | 'leisure' | 'car_rental';
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  location_name?: string;
  start_location_name?: string;
  start_location_lat?: number;
  start_location_lng?: number;
  end_location_name?: string;
  end_location_lat?: number;
  end_location_lng?: number;
  status: string;
  trip_id: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  hotel: 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm',
  activity: 'bg-midnight-fjord text-white border-midnight-fjord shadow-md',
  food: 'bg-amber-50 text-amber-700 border-amber-100 shadow-sm',
  transport: 'bg-slate-50 text-slate-700 border-slate-100 shadow-sm',
  car_rental: 'bg-glacier-mint/10 text-midnight-fjord border-glacier-mint/30 shadow-sm',
  leisure: 'bg-rose-50 text-rose-700 border-rose-100 shadow-sm',
};

type ExplodedItem = ItineraryItem & { 
  display_start: string; 
  display_end: string; 
  is_fragment: boolean; 
  fragment_id: string;
  is_first_fragment: boolean;
  is_last_fragment: boolean;
};

function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (window.google?.maps?.places) { setIsLoaded(true); return; }
    const existingScript = document.getElementById('google-maps-sdk');
    if (existingScript) {
      const checkLoaded = setInterval(() => { if (window.google?.maps?.places) { setIsLoaded(true); clearInterval(checkLoaded); } }, 100);
      return () => clearInterval(checkLoaded);
    }
    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);
  return isLoaded;
}

function LocationAutocomplete({ label, value, onChange, placeholder, icon: Icon, isLoaded }: any) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  useEffect(() => {
    if (isLoaded && !autocompleteService.current && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyElement = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyElement);
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    onChange({ name: query });
    if (!isLoaded || query.length < 3 || !autocompleteService.current) { setSuggestions([]); return; }
    autocompleteService.current.getPlacePredictions({ input: query, language: 'de' }, (predictions: any) => { if (predictions) { setSuggestions(predictions); setIsOpen(true); } });
  };

  const handleSelect = (prediction: any) => {
    setIsOpen(false);
    if (!placesService.current) return;
    placesService.current.getDetails({ placeId: prediction.place_id, fields: ['name', 'formatted_address', 'geometry', 'address_components'] }, (result: any) => {
      if (result) {
        const cityComp = result.address_components.find((c: any) => c.types.includes('locality'));
        const countryComp = result.address_components.find((c: any) => c.types.includes('country'));
        const cityName = cityComp ? cityComp.long_name : '';
        const countryName = countryComp ? countryComp.long_name : '';
        let fullName = result.name;
        if (cityName && !fullName.includes(cityName)) fullName += `, ${cityName}`;
        if (countryName && !fullName.includes(countryName)) fullName += `, ${countryName}`;
        onChange({ name: fullName || result.formatted_address, lat: result.geometry.location.lat(), lng: result.geometry.location.lng(), address: result.formatted_address });
      }
    });
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <input type="text" value={value?.name || ''} onChange={(e) => handleSearch(e.target.value)} onFocus={() => suggestions.length > 0 && setIsOpen(true)} placeholder={isLoaded ? placeholder : 'Lädt...'} className="w-full bg-slate-50/50 rounded-[20px] py-5 pl-12 pr-6 font-bold text-midnight-fjord outline-none border-2 border-transparent focus:border-glacier-mint transition-all" />
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-glacier-mint" />
      </div>
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute z-[100] left-0 right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden max-h-[240px] overflow-y-auto no-scrollbar">
            {suggestions.map((s: any) => (
              <button key={s.place_id} onClick={() => handleSelect(s)} className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                <MapPin className="w-4 h-4 text-slate-300 group-hover:text-glacier-mint transition-colors" />
                <div className="flex flex-col"><span className="text-xs font-bold text-midnight-fjord truncate">{s.structured_formatting.main_text}</span><span className="text-[10px] text-slate-400 truncate">{s.structured_formatting.secondary_text}</span></div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ItineraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const isMapsLoaded = useGoogleMaps();
  
  const [showHotel, setShowHotel] = useState(true);
  const [showCar, setShowCar] = useState(true);
  const [showOther, setShowOther] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTripPickerOpen, setIsTripPickerOpen] = useState(false);
  const [isNewTripFormOpen, setIsNewTripFormOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [mainCategory, setMainCategory] = useState<'transport' | 'hotel' | 'car_rental'>('transport');
  const [subCategory, setSubCategory] = useState<'car' | 'plane' | 'train' | 'activity' | 'food'>('car');
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newStartDate, setNewStartDate] = useState('2026-05-12');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newEndDate, setNewEndDate] = useState('2026-05-12');
  const [startLocation, setStartLocation] = useState<any>({ name: '' });
  const [endLocation, setEndLocation] = useState<any>({ name: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchTrips(); }, []);
  useEffect(() => { if (currentTrip) fetchItinerary(); }, [currentTrip]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('trips').select('*').eq('user_id', ALEXANDER_ID).order('created_at', { ascending: false });
      if (data) { setTrips(data); if (data.length > 0 && (!currentTrip || !data.find(t => t.id === currentTrip.id))) setCurrentTrip(data[0]); else if (data.length === 0) setCurrentTrip(null); }
    } finally { setLoading(false); }
  };

  const fetchItinerary = async () => {
    if (!currentTrip) return;
    setLoading(true);
    try {
      const { data } = await supabase.from('itinerary_items').select('*').eq('trip_id', currentTrip.id).order('start_time', { ascending: true });
      if (data) setItems(data);
    } finally { setLoading(false); }
  };

  const handleCreateTrip = async () => {
    if (!newTripName.trim()) return;
    setIsSaving(true);
    const newTrip = { user_id: ALEXANDER_ID, name: newTripName.trim(), start_date: new Date().toISOString(), end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'planned' };
    try {
      const { data } = await supabase.from('trips').insert([newTrip]).select();
      if (data && data.length > 0) { await fetchTrips(); setCurrentTrip(data[0]); setNewTripName(''); setIsNewTripFormOpen(false); setIsTripPickerOpen(false); }
    } finally { setIsSaving(false); }
  };

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;
    setIsSaving(true);
    try { await supabase.from('itinerary_items').delete().eq('trip_id', tripToDelete.id); await supabase.from('trips').delete().eq('id', tripToDelete.id); await fetchTrips(); setTripToDelete(null); } finally { setIsSaving(false); }
  };

  const openAddModal = (initialDate?: string, initialLocation?: any) => {
    if (!currentTrip) return;
    setEditingItem(null); setNewTitle(''); setMainCategory('transport'); setSubCategory('car');
    
    let baseDate = currentTrip.start_date.split('T')[0];
    if (initialDate) {
      const d = new Date(initialDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      baseDate = `${y}-${m}-${day}`;
    }
    
    setNewStartDate(baseDate); setNewEndDate(baseDate);
    setNewStartTime('09:00'); setNewEndTime('10:00'); 
    
    if (initialLocation) { setStartLocation({ ...initialLocation }); setMainCategory('transport'); setSubCategory('activity'); }
    else { setStartLocation({ name: '' }); }
    
    setEndLocation({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ItineraryItem) => {
    setEditingItem(item); setNewTitle(item.title);
    setNewStartDate(item.start_time.split('T')[0]); setNewStartTime(item.start_time.split('T')[1].substring(0, 5));
    if (item.end_time) { setNewEndDate(item.end_time.split('T')[0]); setNewEndTime(item.end_time.split('T')[1].substring(0, 5)); }
    setStartLocation({ name: item.start_location_name || item.location_name || '', lat: item.start_location_lat, lng: item.start_location_lng });
    setEndLocation({ name: item.end_location_name || '', lat: item.end_location_lat, lng: item.end_location_lng });
    if (item.category === 'hotel') setMainCategory('hotel'); else if (item.category === 'car_rental') setMainCategory('car_rental');
    else { setMainCategory('transport'); const cat = item.category as any; setSubCategory(cat === 'transport' ? 'car' : (['car','plane','train','activity','food'].includes(cat) ? cat : 'activity')); }
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!newTitle || !currentTrip) return;
    setIsSaving(true);
    const start_time = `${newStartDate}T${newStartTime}:00`;
    const end_time = `${newEndDate}T${newEndTime}:00`;
    let category: any = mainCategory;
    if (mainCategory === 'transport') category = (subCategory === 'car' || subCategory === 'plane' || subCategory === 'train') ? 'transport' : subCategory;
    const itemData = {
      user_id: ALEXANDER_ID, trip_id: currentTrip.id, type: 'booked', category, title: newTitle, description: mainCategory === 'car_rental' ? 'Mietwagen' : mainCategory === 'hotel' ? 'Aufenthalt' : 'Logistik / Event',
      start_time, end_time, status: 'confirmed', start_location_name: startLocation.name, start_location_lat: startLocation.lat, start_location_lng: startLocation.lng,
      end_location_name: (mainCategory === 'transport' && ['car','plane','train'].includes(subCategory)) ? endLocation.name : null,
      end_location_lat: (mainCategory === 'transport' && ['car','plane','train'].includes(subCategory)) ? endLocation.lat : null,
      end_location_lng: (mainCategory === 'transport' && ['car','plane','train'].includes(subCategory)) ? endLocation.lng : null
    };
    try { if (editingItem) await supabase.from('itinerary_items').update(itemData).eq('id', editingItem.id); else await supabase.from('itinerary_items').insert([itemData]); await fetchItinerary(); setIsModalOpen(false); } finally { setIsSaving(false); }
  };

  const handleDeleteItem = async () => { if (!editingItem) return; setIsSaving(true); try { await supabase.from('itinerary_items').delete().eq('id', editingItem.id); await fetchItinerary(); setIsModalOpen(false); } finally { setIsSaving(false); } };

  const explodedItems = useMemo(() => {
    const result: ExplodedItem[] = [];
    items.forEach(item => {
      const start = new Date(item.start_time); const end = item.end_time ? new Date(item.end_time) : start;
      const startDay = new Date(start); startDay.setHours(0,0,0,0);
      const endDay = new Date(end); endDay.setHours(0,0,0,0);
      if (startDay.getTime() === endDay.getTime()) {
        result.push({ ...item, display_start: item.start_time, display_end: item.end_time || item.start_time, is_fragment: false, fragment_id: item.id, is_first_fragment: true, is_last_fragment: true });
      } else {
        let loopDate = new Date(startDay);
        while (loopDate <= endDay) {
          const isFirstDay = loopDate.getTime() === startDay.getTime();
          const isLastDay = loopDate.getTime() === endDay.getTime();
          const y = loopDate.getFullYear(); const m = String(loopDate.getMonth() + 1).padStart(2, '0'); const d = String(loopDate.getDate()).padStart(2, '0'); const dateStr = `${y}-${m}-${d}`;
          let dStart = `${dateStr}T00:00:00`; let dEnd = `${dateStr}T23:59:59`;
          if (isFirstDay) dStart = item.start_time; if (isLastDay) dEnd = item.end_time!;
          result.push({ ...item, display_start: dStart, display_end: dEnd, is_fragment: true, fragment_id: `${item.id}-${loopDate.getTime()}`, is_first_fragment: isFirstDay, is_last_fragment: isLastDay });
          loopDate.setDate(loopDate.getDate() + 1);
        }
      }
    });
    return result;
  }, [items]);

  const visibleExplodedItems = useMemo(() => explodedItems.filter(item => { if (!item.category) return false; if (item.category === 'hotel') return showHotel; if (item.category === 'car_rental') return showCar; return showOther; }), [explodedItems, showHotel, showCar, showOther]);
  const groupedItems = useMemo(() => visibleExplodedItems.reduce((groups: any, item) => { const dateKey = new Date(item.display_start).toDateString(); if (!groups[dateKey]) groups[dateKey] = []; groups[dateKey].push(item); return groups; }, {}), [visibleExplodedItems]);
  const activeColumnCount = [showHotel, showCar, showOther].filter(Boolean).length || 1;
  const gridColsClass = activeColumnCount === 3 ? 'grid-cols-3' : activeColumnCount === 2 ? 'grid-cols-2' : 'grid-cols-1';
  const showEndLocationField = (mainCategory === 'transport' && ['car', 'plane', 'train'].includes(subCategory));

  return (
    <div className="bg-[#F9FAFB] text-[#111827] min-h-screen pb-32 font-inter antialiased overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="cursor-pointer group" onClick={() => setIsTripPickerOpen(true)}>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Journey <ChevronDown className="w-3 h-3" /></div>
            <h1 className="text-xl font-bold text-midnight-fjord tracking-tight">{currentTrip?.name || 'KEINE REISE'}</h1>
          </div>
          {currentTrip && (
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-1 rounded-full flex gap-1 shadow-inner">
                 <button onClick={() => setShowHotel(!showHotel)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${showHotel ? 'bg-white text-midnight-fjord shadow-sm' : 'text-slate-400 opacity-60'}`}><Bed className="w-4 h-4" /><span className="text-[10px] font-black uppercase">Stay</span></button>
                 <button onClick={() => setShowCar(!showCar)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${showCar ? 'bg-white text-midnight-fjord shadow-sm' : 'text-slate-400 opacity-60'}`}><Car className="w-4 h-4" /><span className="text-[10px] font-black uppercase">Car</span></button>
                 <button onClick={() => setShowOther(!showOther)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${showOther ? 'bg-white text-midnight-fjord shadow-sm' : 'text-slate-400 opacity-60'}`}><Compass className="w-4 h-4" /><span className="text-[10px] font-black uppercase">Logistics</span></button>
              </div>
              <div className="bg-slate-100 p-1 rounded-full flex relative w-24 h-9">
                <motion.div className="absolute bg-white rounded-full shadow-sm h-7" animate={{ x: viewMode === 'list' ? 0 : 44 }} style={{ width: 'calc(50% - 4px)' }} />
                <button onClick={() => setViewMode('list')} className={`flex-1 flex items-center justify-center relative z-10 ${viewMode === 'list' ? 'text-midnight-fjord' : 'text-slate-400'}`}><List className="w-3.5 h-3.5" /></button>
                <button onClick={() => setViewMode('grid')} className={`flex-1 flex items-center justify-center relative z-10 ${viewMode === 'grid' ? 'text-midnight-fjord' : 'text-slate-400'}`}><CalendarIcon className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="pt-28 px-4 max-w-5xl mx-auto">
        {!currentTrip ? (<div className="py-40 text-center"><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Globe className="w-10 h-10 text-slate-200" /></div><h2 className="text-2xl font-black text-midnight-fjord mb-4">Bereit für das nächste Abenteuer?</h2><p className="text-slate-400 mb-10 max-w-xs mx-auto">Klicke oben links auf den Namen, um eine neue Reise anzulegen.</p><button onClick={() => setIsTripPickerOpen(true)} className="px-10 py-5 bg-midnight-fjord text-white rounded-full font-bold shadow-xl">REISE STARTEN</button></div>) : (
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className={`grid ${gridColsClass} gap-6 mb-4 px-2 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest`}>{showHotel && <div>Aufenthalt</div>}{showCar && <div>Mietwagen</div>}{showOther && <div>Logistik & Aktivitäten</div>}</div>
                {Object.keys(groupedItems).sort((a,b) => new Date(a).getTime() - new Date(b).getTime()).map(dateKey => {
                  const dayItems = groupedItems[dateKey] as ExplodedItem[];
                  const hotelForDay = dayItems.find(i => i.category === 'hotel');
                  const hotelLocation = hotelForDay ? { name: hotelForDay.start_location_name, lat: hotelForDay.start_location_lat, lng: hotelForDay.start_location_lng } : null;
                  return (
                    <section key={dateKey} className="relative">
                      <div className="flex items-center justify-center gap-4 mb-8 sticky top-24 z-20">
                        <div className="h-[1px] flex-1 bg-slate-100" />
                        <div className="flex items-center gap-3 bg-[#F9FAFB]/90 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-100 shadow-sm">
                          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{new Date(dateKey).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}</h2>
                          <button onClick={() => openAddModal(dateKey, hotelLocation)} className="px-3 py-1 bg-glacier-mint/10 text-midnight-fjord rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-glacier-mint/20 transition-all flex items-center gap-1">
                            <Plus className="w-2.5 h-2.5 text-glacier-mint" /> Neues Event
                          </button>
                        </div>
                        <div className="h-[1px] flex-1 bg-slate-100" />
                      </div>
                      <div className={`grid ${gridColsClass} gap-6 items-stretch`}>
                        {showHotel && <div className="flex flex-col gap-3">{dayItems.filter(i => i.category === 'hotel').map(item => (<div key={item.fragment_id} onClick={() => openEditModal(item)} className={`rounded-[24px] p-4 shadow-sm border bg-white border-slate-100 min-h-[160px] cursor-pointer hover:border-glacier-mint transition-all ${!item.is_first_fragment ? 'rounded-t-none border-t-0 opacity-80' : ''} ${!item.is_last_fragment ? 'rounded-b-none border-b-0 shadow-none' : ''}`}><h3 className="font-bold text-[11px] mb-1 leading-tight">{item.title}</h3><div className="flex items-start gap-1 text-[8px] text-slate-400 mt-2"><MapPin className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" /><span className="leading-relaxed">{item.start_location_name || 'Kein Ort'}</span></div></div>))}</div>}
                        {showCar && <div className="flex flex-col gap-3">{dayItems.filter(i => i.category === 'car_rental').map(item => (<div key={item.fragment_id} onClick={() => openEditModal(item)} className={`rounded-[24px] p-4 shadow-sm border bg-white border-glacier-mint/20 min-h-[160px] cursor-pointer hover:border-glacier-mint transition-all ${!item.is_first_fragment ? 'rounded-t-none border-t-0 opacity-80' : ''} ${!item.is_last_fragment ? 'rounded-b-none border-b-0 shadow-none' : ''}`}><h3 className="font-bold text-[11px] mb-1 leading-tight">{item.title}</h3><div className="flex items-start gap-1 text-[8px] text-slate-400 mt-2"><MapPin className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" /><span className="leading-relaxed">{item.start_location_name || 'Mietstation'}</span></div></div>))}</div>}
                        {showOther && <div className="flex flex-col gap-3">{dayItems.filter(i => !['hotel', 'car_rental'].includes(i.category)).map(item => {
                          const isTransport = item.category === 'transport';
                          const labelPrefix = isTransport ? (item.is_first_fragment ? 'Abfahrt: ' : 'Ankunft: ') : '';
                          const locName = (isTransport && !item.is_first_fragment) ? (item.end_location_name || item.start_location_name) : item.start_location_name;
                          const secondLoc = (isTransport && item.is_first_fragment) ? item.end_location_name : null;
                          return (
                            <div key={item.fragment_id} onClick={() => openEditModal(item)} className="rounded-[20px] p-4 shadow-sm border bg-white border-slate-100 flex flex-col justify-between min-h-[80px] cursor-pointer hover:border-glacier-mint transition-all">
                              <h3 className="font-bold text-[11px] mb-2 leading-tight">{item.title}</h3>
                              <div className="space-y-2">
                                <div className="flex items-start gap-1 text-[8px] text-midnight-fjord font-medium">
                                  {item.is_first_fragment ? <ArrowUpRight className="w-2.5 h-2.5 text-glacier-mint mt-0.5 flex-shrink-0" /> : <ArrowDownLeft className="w-2.5 h-2.5 text-indigo-400 mt-0.5 flex-shrink-0" />}
                                  <div className="flex flex-col gap-1">
                                    <span className="leading-tight"><span className="opacity-50 font-normal">{labelPrefix}</span>{locName || 'Ort wählen'}</span>
                                    {secondLoc && <div className="flex items-center gap-1 mt-1 text-slate-400"><ArrowRight className="w-2 h-2" />{secondLoc}</div>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-40 text-[8px]"><Clock className="w-2 h-2" />{item.display_start.split('T')[1].substring(0,5)}</div>
                              </div>
                            </div>
                          );
                        })}</div>}
                      </div>
                    </section>
                  );
                })}
              </motion.div>
            ) : (<div className="p-20 text-center text-slate-300">Gitter-Logik wird verfeinert...</div>)}
          </AnimatePresence>
        )}

        {currentTrip && <button onClick={() => openAddModal()} className="fixed bottom-32 left-1/2 -translate-x-1/2 w-16 h-16 bg-midnight-fjord text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all shadow-midnight-fjord/40 border-4 border-white/20"><Plus className="w-8 h-8" /></button>}

        {/* ITEM MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-midnight-fjord/40 backdrop-blur-sm z-[60]" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[70] px-8 pt-10 pb-12 shadow-2xl max-h-[95vh] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-8">
                  <div><h2 className="text-2xl font-black text-midnight-fjord">{editingItem ? 'Eintrag bearbeiten' : 'Eintrag hinzufügen'}</h2><p className="text-xs font-medium text-slate-400 mt-1">Plan für {currentTrip?.name}</p></div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-10">
                  <div className="grid grid-cols-3 gap-4">
                    {[{ id: 'hotel', label: 'AUFENTHALT', icon: Bed }, { id: 'car_rental', label: 'MIETWAGEN', icon: Car }, { id: 'transport', label: 'LOGISTIK & EVENT', icon: Compass }].map(cat => (
                      <button key={cat.id} onClick={() => { setMainCategory(cat.id as any); setSubCategory(cat.id === 'transport' ? 'car' : 'activity'); }} className={`flex flex-col items-center justify-center py-8 rounded-[24px] border-2 transition-all gap-3 ${mainCategory === cat.id ? 'bg-glacier-mint/5 border-glacier-mint text-midnight-fjord' : 'bg-slate-50/50 border-transparent text-slate-300'}`}>
                        {React.createElement(cat.icon, { className: `w-6 h-6 ${mainCategory === cat.id ? 'text-glacier-mint' : ''}` })}
                        <span className="text-[10px] font-black tracking-widest">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  {mainCategory === 'transport' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-5 gap-2">
                      {[{ id: 'car', label: 'TAXI', icon: Car }, { id: 'plane', label: 'FLUG', icon: Plane }, { id: 'train', label: 'ZUG', icon: Train }, { id: 'activity', label: 'EVENT', icon: Compass }, { id: 'food', label: 'ESSEN', icon: Utensils }].map(sub => (
                        <button key={sub.id} onClick={() => setSubCategory(sub.id as any)} className={`flex items-center justify-center gap-1.5 py-4 rounded-[16px] border-2 transition-all ${subCategory === sub.id ? 'bg-midnight-fjord border-midnight-fjord text-white' : 'bg-slate-50/50 border-transparent text-slate-400'}`}>
                          {React.createElement(sub.icon, { className: "w-3 h-3" })}
                          <span className="text-[8px] font-black tracking-tight">{sub.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                  <div className="space-y-6">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">TITEL</label><input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titel eingeben" className="w-full bg-slate-50/50 rounded-[20px] py-6 px-8 text-lg font-bold text-midnight-fjord outline-none border-2 border-transparent focus:border-glacier-mint transition-all" /></div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <LocationAutocomplete label={showEndLocationField ? 'ABFAHRTSORT' : 'ORT'} value={startLocation} onChange={setStartLocation} placeholder="Ort suchen..." icon={MapPin} isLoaded={isMapsLoaded} />
                      {showEndLocationField && <LocationAutocomplete label="ANKUNFTSORT" value={endLocation} onChange={setEndLocation} placeholder="Zielort suchen..." icon={Navigation} isLoaded={isMapsLoaded} />}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">BEGINN</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="w-full bg-slate-50/50 p-5 rounded-[20px] font-bold text-midnight-fjord outline-none" />
                          <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <input type="time" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full bg-slate-50/50 p-5 rounded-[20px] font-bold text-midnight-fjord outline-none" />
                          <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">ENDE</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} className="w-full bg-slate-50/50 p-5 rounded-[20px] font-bold text-midnight-fjord outline-none" />
                          <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full bg-slate-50/50 p-5 rounded-[20px] font-bold text-midnight-fjord outline-none" />
                          <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">{editingItem && <button onClick={handleDeleteItem} className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[28px] flex items-center justify-center shadow-sm"><Trash2 className="w-8 h-8" /></button>}<button onClick={handleSaveItem} disabled={isSaving || !newTitle} className="flex-1 h-20 bg-midnight-fjord text-white rounded-[28px] font-black text-lg flex items-center justify-center gap-3 hover:bg-midnight-fjord/90 transition-all shadow-xl shadow-midnight-fjord/20">{isSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Check className="w-7 h-7 text-glacier-mint" /> EINTRAG SPEICHERN</>}</button></div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isTripPickerOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsTripPickerOpen(false); setIsNewTripFormOpen(false); }} className="fixed inset-0 bg-midnight-fjord/60 backdrop-blur-md z-[60]" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-y-0 right-0 w-[85%] max-w-md bg-white z-[70] p-8 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-10"><h2 className="text-2xl font-bold text-midnight-fjord">Meine Reisen</h2><button onClick={() => setIsTripPickerOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X className="w-4 h-4" /></button></div>
                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10">
                  {trips.map(trip => (
                    <div key={trip.id} className="relative group">
                       <button onClick={() => { setCurrentTrip(trip); setIsTripPickerOpen(false); }} className={`w-full p-5 rounded-[28px] border-2 text-left transition-all ${currentTrip?.id === trip.id ? 'bg-midnight-fjord text-white border-midnight-fjord shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}><div className="flex items-center justify-between pr-8"><div><p className="font-bold">{trip.name}</p><p className={`text-[10px] mt-1 ${currentTrip?.id === trip.id ? 'text-glacier-mint/80' : 'text-slate-400'}`}>{new Date(trip.start_date).toLocaleDateString('de-DE')}</p></div>{currentTrip?.id === trip.id && <div className="w-2 h-2 rounded-full bg-glacier-mint shadow-[0_0_8px_rgba(89,251,211,0.8)]" />}</div></button>
                       <button onClick={(e) => { e.stopPropagation(); setTripToDelete(trip); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100">
                  {!isNewTripFormOpen ? (<button onClick={() => setIsNewTripFormOpen(true)} className="w-full py-5 rounded-[24px] bg-glacier-mint/10 border-2 border-dashed border-glacier-mint/30 text-midnight-fjord font-bold flex items-center justify-center gap-2 hover:bg-glacier-mint/20 transition-all"><Plus className="w-5 h-5 text-glacier-mint" /> NEUE REISE ANLEGEN</button>) : (<div className="space-y-4 bg-slate-50 p-6 rounded-[28px]"><input autoFocus type="text" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} placeholder="Name der Reise" className="w-full bg-white border-2 border-transparent focus:border-glacier-mint p-4 rounded-xl font-bold outline-none" /><div className="flex gap-2"><button onClick={() => setIsNewTripFormOpen(false)} className="px-4 py-4 rounded-xl bg-white text-slate-400 font-bold">Abbrechen</button><button onClick={handleCreateTrip} disabled={!newTripName.trim() || isSaving} className="flex-1 py-4 rounded-xl bg-midnight-fjord text-white font-bold flex items-center justify-center gap-2">{isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 text-glacier-mint" /> ERSTELLEN</>}</button></div></div>)}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>{tripToDelete && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTripToDelete(null)} className="fixed inset-0 bg-midnight-fjord/80 backdrop-blur-md z-[100]" /><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[40px] z-[110] p-10 text-center shadow-2xl"><div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8"><AlertTriangle className="w-10 h-10 text-rose-500" /></div><h2 className="text-2xl font-black text-midnight-fjord mb-4">Reise löschen?</h2><p className="text-slate-500 text-sm mb-10">Wirklich "{tripToDelete.name}" unwiderruflich löschen?</p><div className="space-y-3"><button onClick={handleDeleteTrip} disabled={isSaving} className="w-full py-5 bg-rose-500 text-white rounded-[24px] font-bold shadow-lg flex items-center justify-center gap-2">{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'JA, ALLES LÖSCHEN'}</button><button onClick={() => setTripToDelete(null)} className="w-full py-5 bg-slate-50 text-slate-400 rounded-[24px] font-bold">ABBRECHEN</button></div></motion.div></>)}</AnimatePresence>
      </main>
    </div>
  );
}
