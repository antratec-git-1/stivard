"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TopAppBar from '@/components/TopAppBar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Bed, 
  Compass, 
  Utensils, 
  Car, 
  Plus, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  List, 
  Sparkles,
  MapPin,
  Clock,
  Ticket,
  X,
  Plane,
  Train,
  Check,
  ArrowRight,
  Home,
  Edit3,
  Trash2,
  ChevronDown,
  Globe,
  Briefcase
} from 'lucide-react';

const ALEXANDER_ID = '00000000-0000-0000-0000-000000000001';

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
  category: 'hotel' | 'activity' | 'food' | 'transport' | 'leisure';
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  location_name?: string;
  place_id?: string;
  external_url?: string;
  status: string;
  trip_id: string;
};

const CATEGORY_ICONS: Record<string, any> = {
  hotel: Bed,
  activity: Compass,
  food: Utensils,
  transport: Car,
  leisure: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  hotel: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  activity: 'bg-midnight-fjord text-white border-midnight-fjord',
  food: 'bg-amber-50 text-amber-700 border-amber-100',
  transport: 'bg-glacier-mint/10 text-midnight-fjord border-glacier-mint/30',
  leisure: 'bg-rose-50 text-rose-700 border-rose-100',
};

export default function ItineraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTripPickerOpen, setIsTripPickerOpen] = useState(false);
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [mainCategory, setMainCategory] = useState<'transport' | 'hotel' | 'activity'>('transport');
  const [newTitle, setNewTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newStartDate, setNewStartDate] = useState('2026-05-12');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newEndDate, setNewEndDate] = useState('2026-05-12');
  const [subCategory, setSubCategory] = useState<'car' | 'plane' | 'train' | 'hotel' | 'activity' | 'food' | 'leisure'>('car');
  
  const [newTripName, setNewTripName] = useState('');
  const [newTripStart, setNewTripStart] = useState('2026-06-01');
  const [newTripEnd, setNewTripEnd] = useState('2026-06-10');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (currentTrip) {
      fetchItinerary();
    }
  }, [currentTrip]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', ALEXANDER_ID)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setTrips(data);
        // Try to keep the same trip if we're just refreshing, otherwise pick the first
        if (!currentTrip) setCurrentTrip(data[0]);
      }
    } catch (err) {
      console.error("Fetch trips error:", err);
    } finally {
      // Ensure loading is false even if we have trips, fetchItinerary will handle its own loading if needed
      if (!currentTrip) setLoading(false);
    }
  };

  const fetchItinerary = async () => {
    if (!currentTrip) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', currentTrip.id)
        .order('start_time', { ascending: true });

      if (data) {
        const aiSlot: ItineraryItem = {
          id: 'ai-slot-1',
          type: 'ai_slot',
          category: 'food',
          title: 'AI-FREISLOT?',
          description: "Stewart empfiehlt: [Lokal in der Nähe]",
          start_time: `${currentTrip.start_date.split('T')[0]}T17:00:00`,
          status: 'pending',
          trip_id: currentTrip.id
        };
        setItems([...data, aiSlot]);
      }
    } catch (err) {
      console.error("Fetch itinerary error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    if (!newTripName) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('trips').insert([{
        user_id: ALEXANDER_ID,
        name: newTripName,
        start_date: newTripStart,
        end_date: newTripEnd,
        status: 'active'
      }]).select();

      if (data) {
        setTrips([data[0], ...trips]);
        setCurrentTrip(data[0]);
        setIsNewTripModalOpen(false);
        setIsTripPickerOpen(false);
      }
    } catch (err) {
      console.error("Create trip error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = () => {
    if (!currentTrip) return;
    setEditingItem(null);
    setNewTitle('');
    setNewStartTime('09:00');
    setNewStartDate(currentTrip.start_date.split('T')[0]);
    setNewEndTime('10:00');
    setNewEndDate(currentTrip.start_date.split('T')[0]);
    setMainCategory('transport');
    setSubCategory('car');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ItineraryItem) => {
    if (item.type === 'ai_slot') return;
    setEditingItem(item);
    setNewTitle(item.title);
    
    if (item.start_time.includes('T')) {
      const parts = item.start_time.split('T');
      setNewStartDate(parts[0]);
      setNewStartTime(parts[1].substring(0, 5));
    }
    if (item.end_time?.includes('T')) {
      const parts = item.end_time.split('T');
      setNewEndDate(parts[0]);
      setNewEndTime(parts[1].substring(0, 5));
    }
    
    const cat = item.category;
    if (cat === 'hotel') setMainCategory('hotel');
    else if (['activity', 'food', 'leisure'].includes(cat)) setMainCategory('activity');
    else setMainCategory('transport');
    
    setSubCategory(cat as any);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!newTitle || !currentTrip) return;
    setIsSaving(true);
    const start_time = `${newStartDate}T${newStartTime}:00`;
    const end_time = `${newEndDate}T${newEndTime}:00`;

    const itemData = {
      user_id: ALEXANDER_ID,
      trip_id: currentTrip.id,
      type: 'booked',
      category: mainCategory === 'hotel' ? 'hotel' : subCategory === 'car' || subCategory === 'plane' || subCategory === 'train' ? 'transport' : subCategory,
      title: newTitle,
      description: mainCategory === 'hotel' ? 'Aufenthalt' : mainCategory === 'activity' ? 'Erlebnis' : 'Transfer',
      start_time,
      end_time,
      status: 'confirmed',
      location_name: mainCategory === 'hotel' ? 'Hotel' : mainCategory === 'activity' ? 'Event / Ort' : 'Transfer'
    };

    try {
      if (editingItem) {
        await supabase.from('itinerary_items').update(itemData).eq('id', editingItem.id);
      } else {
        await supabase.from('itinerary_items').insert([itemData]);
      }
      await fetchItinerary();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save item error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      await supabase.from('itinerary_items').delete().eq('id', editingItem.id);
      await fetchItinerary();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Delete item error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date('2026-05-12');
    const isToday = d.toDateString() === today.toDateString();
    return isToday ? `HEUTE, ${d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })}` : d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  const formatTime = (dateStr: string) => {
    if (dateStr.includes('T')) return dateStr.split('T')[1].substring(0, 5);
    const d = new Date(dateStr);
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const groupedItems = items.reduce((groups: any, item) => {
    const date = new Date(item.start_time).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});

  const getDayIndex = (dateStr: string) => {
    const d = new Date(dateStr);
    let day = d.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getMinuteOffset = (dateStr: string) => {
    const d = new Date(dateStr);
    return (d.getHours() - 8) * 60 + d.getMinutes();
  };

  const getDurationMinutes = (item: ItineraryItem) => {
    if (!item.end_time) return 60;
    const start = new Date(item.start_time).getTime();
    const end = new Date(item.end_time).getTime();
    return (end - start) / (1000 * 60);
  };

  const getOverlapInfo = (item: ItineraryItem, allItems: ItineraryItem[]) => {
    const start = new Date(item.start_time).getTime();
    const end = item.end_time ? new Date(item.end_time).getTime() : start + 3600000;
    const day = new Date(item.start_time).toDateString();
    const isHotel = item.category === 'hotel';

    const overlaps = allItems.filter(other => {
      if (other.id === item.id) return false;
      if (new Date(other.start_time).toDateString() !== day) return false;
      if (isHotel !== (other.category === 'hotel')) return false;
      const oStart = new Date(other.start_time).getTime();
      const oEnd = other.end_time ? new Date(other.end_time).getTime() : oStart + 3600000;
      return (start < oEnd && end > oStart);
    });

    if (overlaps.length === 0) return { offset: 0, total: 1 };
    const sorted = [item, ...overlaps].sort((a, b) => a.id.localeCompare(b.id));
    return { offset: sorted.findIndex(i => i.id === item.id), total: sorted.length };
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center"><Loader2 className="w-8 h-8 text-glacier-mint animate-spin" /></div>;
  }

  return (
    <div className="bg-[#F9FAFB] text-[#111827] min-h-screen pb-32 font-inter antialiased">
      {/* Dynamic Header with Trip Picker */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="cursor-pointer group" onClick={() => setIsTripPickerOpen(true)}>
          <div className="flex items-center gap-1">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Journey</span>
             <ChevronDown className="w-3 h-3 text-slate-300 group-hover:text-glacier-mint transition-colors" />
          </div>
          <h1 className="text-xl font-bold text-midnight-fjord tracking-tight flex items-center gap-2">
            {currentTrip?.name || 'MY TRIPS'}
          </h1>
        </div>
        <div className="bg-slate-100 p-1 rounded-full flex relative w-24 h-9">
          <motion.div className="absolute bg-white rounded-full shadow-sm h-7" initial={false} animate={{ x: viewMode === 'list' ? 0 : 44 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ width: 'calc(50% - 4px)' }} />
          <button onClick={() => setViewMode('list')} className={`flex-1 flex items-center justify-center relative z-10 ${viewMode === 'list' ? 'text-midnight-fjord' : 'text-slate-400'}`}><List className="w-3.5 h-3.5" /></button>
          <button onClick={() => setViewMode('grid')} className={`flex-1 flex items-center justify-center relative z-10 ${viewMode === 'grid' ? 'text-midnight-fjord' : 'text-slate-400'}`}><CalendarIcon className="w-3.5 h-3.5" /></button>
        </div>
      </header>

      <main className="pt-28 px-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">Aufenthalt</div>
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">Aktivität</div>
              </div>

              {Object.keys(groupedItems).length === 0 && !loading && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200"><Compass className="w-8 h-8" /></div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Noch nichts geplant</h3>
                  <p className="text-xs text-slate-300 mt-2">Starte deine Planung für diese Reise.</p>
                </div>
              )}

              {Object.keys(groupedItems).map((dateKey) => {
                const dayItems = groupedItems[dateKey] as ItineraryItem[];
                const hotelItems = dayItems.filter(i => i.category === 'hotel');
                const actionItems = dayItems.filter(i => i.category !== 'hotel');

                return (
                  <section key={dateKey} className="relative">
                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 text-center sticky top-24 z-20 py-2 bg-[#F9FAFB]/90 backdrop-blur-sm rounded-full">{formatDate(dayItems[0].start_time)}</h2>
                    <div className="flex gap-4 relative items-stretch">
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-100 -translate-x-1/2"></div>
                      <div className="flex-1 space-y-3">
                        {hotelItems.length > 0 ? (
                          hotelItems.map((item) => (
                            <div key={item.id} className="h-full flex flex-col">
                              <div onClick={() => openEditModal(item)} className="flex-1 group rounded-[24px] p-4 shadow-sm border transition-all active:scale-[0.98] bg-white border-slate-100 cursor-pointer flex flex-col justify-between min-h-[140px]">
                                <div>
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-1.5 overflow-hidden"><Clock className="w-3 h-3 flex-shrink-0 text-slate-300" /><span className="text-[9px] font-black tracking-tight text-midnight-fjord whitespace-nowrap">{formatShortDate(item.start_time)} {formatTime(item.start_time)} – {formatShortDate(item.end_time!)} {formatTime(item.end_time!)}</span></div>
                                    <Edit3 className="w-3 h-3 text-slate-200 group-hover:text-glacier-mint transition-colors flex-shrink-0" />
                                  </div>
                                  <div className="flex gap-3 items-start">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0"><Bed className="w-5 h-5" /></div>
                                    <div className="flex-1 min-w-0"><h3 className="font-bold text-[13px] leading-tight mb-1 text-midnight-fjord">{item.title}</h3><p className="text-[11px] text-slate-400 font-medium line-clamp-3 leading-tight">{item.description}</p></div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-300 mt-4 pt-3 border-t border-slate-50"><MapPin className="w-3 h-3" /><span className="text-[10px] font-bold truncate">{item.location_name}</span></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full min-h-[140px] rounded-[24px] border border-dashed border-slate-100 bg-slate-50/10 flex items-center justify-center"><span className="text-[8px] font-bold text-slate-200 uppercase tracking-widest">Stay</span></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        {actionItems.map((item) => (
                          <div key={item.id} className="relative z-10">
                            <div className={`group rounded-[20px] p-3 shadow-sm border transition-all active:scale-[0.98] bg-white border-slate-100 ${item.type === 'ai_slot' ? 'bg-gradient-to-br from-white to-slate-50 border-glacier-mint/30 border-dashed' : ''}`}>
                              <div onClick={() => openEditModal(item)} className="cursor-pointer">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-1.5 overflow-hidden"><Clock className={`w-3 h-3 flex-shrink-0 ${item.type === 'ai_slot' ? 'text-glacier-mint' : 'text-slate-300'}`} /><span className={`text-[9px] font-black tracking-tight whitespace-nowrap overflow-hidden text-ellipsis ${item.type === 'ai_slot' ? 'text-glacier-mint' : 'text-midnight-fjord'}`}>{item.category === 'transport' && `${formatShortDate(item.start_time)} `}{formatTime(item.start_time)}{item.end_time ? ` – ${item.category === 'transport' ? `${formatShortDate(item.end_time)} ` : ''}${formatTime(item.end_time)}` : ''}</span></div>
                                  {item.type !== 'ai_slot' && <Edit3 className="w-3 h-3 text-slate-200 group-hover:text-glacier-mint transition-colors flex-shrink-0" />}
                                </div>
                                <div className="flex gap-2.5 items-start mb-2">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.category === 'food' ? 'bg-amber-50 text-amber-500' : item.category === 'leisure' ? 'bg-rose-50 text-rose-500' : item.type === 'ai_slot' ? 'bg-glacier-mint/10 text-glacier-mint' : 'bg-slate-50 text-slate-400'}`}>{React.createElement(CATEGORY_ICONS[item.category] || Compass, { className: "w-4 h-4" })}</div>
                                  <div className="flex-1 min-w-0"><h3 className={`font-bold text-[12px] leading-tight mb-0.5 truncate ${item.type === 'ai_slot' ? 'text-midnight-fjord italic' : 'text-midnight-fjord'}`}>{item.title}</h3><p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-tight">{item.description}</p></div>
                                </div>
                              </div>
                              {item.type === 'ai_slot' ? <Link href="/experiences?category=food" className="w-full h-8 bg-glacier-mint text-midnight-fjord rounded-xl text-[9px] font-black flex items-center justify-center gap-1 hover:opacity-90 transition-all mt-2 uppercase tracking-wider">Buchen</Link> : <div className="flex items-center gap-1.5 text-slate-300 mt-2 pt-2 border-t border-slate-50"><MapPin className="w-3 h-3" /><span className="text-[9px] font-bold truncate">{item.location_name}</span></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="grid grid-cols-8 border-b border-slate-50">
                 <div className="p-4 border-r border-slate-50 bg-slate-50/50"></div>
                 {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, idx) => (
                   <div key={day} className="p-4 text-center border-r border-slate-50 last:border-r-0">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</p>
                     <p className={`text-xs font-bold mt-1 ${idx === 1 ? 'text-glacier-mint' : 'text-midnight-fjord'}`}>{11 + idx}</p>
                   </div>
                 ))}
               </div>
               <div className="relative h-[800px] overflow-y-auto no-scrollbar">
                 {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((hour) => (
                   <div key={hour} className="grid grid-cols-8 border-b border-slate-50 h-20">
                     <div className="p-3 border-r border-slate-50 bg-slate-50/30 flex items-start justify-center"><span className="text-[10px] font-bold text-slate-300">{hour}:00</span></div>
                     {[1,2,3,4,5,6,7].map((col) => <div key={col} className="border-r border-slate-50 last:border-r-0 relative"><div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-50/50 -translate-x-1/2"></div></div>)}
                   </div>
                 ))}
                 <div className="absolute inset-0 left-[12.5%] pointer-events-none">
                    {items.map((item) => {
                      const isHotel = item.category === 'hotel';
                      const dayIdx = getDayIndex(item.start_time);
                      const minuteOffset = getMinuteOffset(item.start_time);
                      const duration = getDurationMinutes(item);
                      const { offset, total } = getOverlapInfo(item, items);
                      const top = (minuteOffset / 60) * 80;
                      const height = (duration / 60) * 80;
                      const dayWidth = 100 / 7;
                      const subColumnWidth = dayWidth / 2;
                      const itemWidth = subColumnWidth / total;
                      const left = (dayIdx * dayWidth) + (isHotel ? 0 : subColumnWidth) + (offset * itemWidth);
                      return (
                        <div key={item.id} onClick={() => openEditModal(item)} className="absolute p-0.5 pointer-events-auto transition-all cursor-pointer" style={{ top: `${top}px`, left: `${left}%`, width: `${itemWidth}%`, height: `${height}px`, zIndex: isHotel ? 10 : 20 }}>
                          <div className={`w-full h-full rounded-xl border p-1.5 shadow-sm flex flex-col overflow-hidden ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.activity} ${item.type === 'ai_slot' ? 'border-dashed border-glacier-mint/50' : ''}`}>
                            <div className="flex items-center justify-between gap-1 mb-1"><div className="flex items-center gap-1 truncate">{React.createElement(CATEGORY_ICONS[item.category] || Compass, { className: "w-2.5 h-2.5 flex-shrink-0" })}<span className="text-[7px] font-bold uppercase truncate">{item.title}</span></div></div>
                            {height > 30 && <p className="text-[6px] font-medium leading-tight opacity-70 line-clamp-2">{formatTime(item.start_time)}</p>}
                          </div>
                        </div>
                      );
                    })}
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={openAddModal} className="fixed bottom-32 right-6 w-14 h-14 bg-midnight-fjord text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50 shadow-midnight-fjord/30"><Plus className="w-6 h-6" /></button>

        {/* TRIP PICKER OVERLAY */}
        <AnimatePresence>
          {isTripPickerOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTripPickerOpen(false)} className="fixed inset-0 bg-midnight-fjord/60 backdrop-blur-md z-[60]" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-y-0 right-0 w-[85%] bg-white z-[70] shadow-2xl p-8 flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <div><h2 className="text-2xl font-bold text-midnight-fjord tracking-tight">Meine Reisen</h2><p className="text-xs text-slate-400 font-medium mt-1">Verwalte deine Abenteuer</p></div>
                  <button onClick={() => setIsTripPickerOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><X className="w-5 h-5 text-slate-400" /></button>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
                  {trips.map(trip => (
                    <button key={trip.id} onClick={() => { setCurrentTrip(trip); setIsTripPickerOpen(false); }} className={`w-full p-5 rounded-[28px] border-2 transition-all flex items-start gap-4 text-left ${currentTrip?.id === trip.id ? 'bg-midnight-fjord border-midnight-fjord text-white shadow-xl shadow-midnight-fjord/20' : 'bg-slate-50 border-transparent text-midnight-fjord hover:bg-slate-100'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTrip?.id === trip.id ? 'bg-white/10 text-glacier-mint' : 'bg-white text-slate-400 shadow-sm'}`}><Globe className="w-5 h-5" /></div>
                      <div className="flex-1">
                        <p className="font-bold text-[14px] leading-tight mb-1">{trip.name}</p>
                        <p className={`text-[10px] font-medium opacity-60 uppercase tracking-wider`}>{formatShortDate(trip.start_date)} – {formatShortDate(trip.end_date)}</p>
                      </div>
                      {currentTrip?.id === trip.id && <Check className="w-4 h-4 text-glacier-mint mt-1" />}
                    </button>
                  ))}
                  <button onClick={() => setIsNewTripModalOpen(true)} className="w-full p-6 rounded-[28px] border-2 border-dashed border-slate-200 flex flex-col items-center gap-3 text-slate-300 hover:border-glacier-mint hover:text-glacier-mint transition-all">
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neue Reise planen</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* NEW TRIP MODAL */}
        <AnimatePresence>
          {isNewTripModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewTripModalOpen(false)} className="fixed inset-0 bg-midnight-fjord/40 backdrop-blur-sm z-[80]" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[90] px-6 pt-8 pb-12 shadow-2xl">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                <h2 className="text-xl font-bold text-midnight-fjord mb-6">Neues Abenteuer starten</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name der Reise</label>
                    <input type="text" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} placeholder="z.B. Sommer in Island" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-midnight-fjord outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start</label><input type="date" value={newTripStart} onChange={(e) => setNewTripStart(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-xs font-bold text-midnight-fjord outline-none" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ende</label><input type="date" value={newTripEnd} onChange={(e) => setNewTripEnd(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-xs font-bold text-midnight-fjord outline-none" /></div>
                  </div>
                  <button onClick={handleCreateTrip} disabled={isSaving || !newTripName} className="w-full h-16 bg-midnight-fjord text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5 text-glacier-mint" />REISE ANLEGEN</>}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ITINERARY ITEM MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-midnight-fjord/40 backdrop-blur-sm z-[60]" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[70] px-6 pt-8 pb-12 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-start mb-6">
                  <div><h2 className="text-xl font-bold text-midnight-fjord mb-1">{editingItem ? 'Eintrag bearbeiten' : 'Eintrag hinzufügen'}</h2><p className="text-xs text-slate-400 font-medium">Plan für {currentTrip?.name}</p></div>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    {[{ id: 'transport', icon: Car, label: 'Mobilität' }, { id: 'hotel', icon: Bed, label: 'Aufenthalt' }, { id: 'activity', icon: Compass, label: 'Aktivität' }].map(cat => (
                      <button key={cat.id} onClick={() => { setMainCategory(cat.id as any); setSubCategory(cat.id === 'transport' ? 'car' : cat.id === 'hotel' ? 'hotel' : 'activity'); }} className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${mainCategory === cat.id ? 'bg-glacier-mint/10 border-glacier-mint text-midnight-fjord' : 'bg-slate-50 border-transparent text-slate-300'}`}><cat.icon className="w-5 h-5" /><span className="text-[9px] font-black uppercase tracking-wider">{cat.label}</span></button>
                    ))}
                  </div>
                  {mainCategory === 'activity' && <div className="flex gap-2">{[{ id: 'activity', icon: Compass, label: 'Sightseeing' }, { id: 'food', icon: Utensils, label: 'Kulinarik' }, { id: 'leisure', icon: Sparkles, label: 'Freizeit' }].map(cat => (<button key={cat.id} onClick={() => setSubCategory(cat.id as any)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black flex items-center justify-center gap-2 transition-all ${subCategory === cat.id ? 'bg-midnight-fjord text-white shadow-lg shadow-midnight-fjord/20' : 'bg-slate-100 text-slate-400'}`}><cat.icon className="w-3.5 h-3.5" /><span className="uppercase tracking-wider">{cat.label}</span></button>)) }</div>}
                  {mainCategory === 'transport' && <div className="flex gap-2">{[{ id: 'car', icon: Car, label: 'Taxi' }, { id: 'plane', icon: Plane, label: 'Flug' }, { id: 'train', icon: Train, label: 'Zug' }].map(cat => (<button key={cat.id} onClick={() => setSubCategory(cat.id as any)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black flex items-center justify-center gap-2 transition-all ${subCategory === cat.id ? 'bg-midnight-fjord text-white' : 'bg-slate-100 text-slate-400'}`}><cat.icon className="w-3.5 h-3.5" /> <span className="uppercase tracking-wider">{cat.label}</span></button>)) }</div>}
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Titel</label><input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titel eingeben" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-midnight-fjord focus:ring-2 focus:ring-glacier-mint outline-none transition-all" /></div>
                  <div className="bg-slate-50/50 p-4 rounded-[24px] space-y-4"><div className="text-[9px] font-black text-glacier-mint uppercase tracking-widest ml-1">Beginn / Check-in</div><div className="grid grid-cols-2 gap-3"><input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="w-full bg-white border-none rounded-xl py-3 px-3 text-xs font-bold text-midnight-fjord outline-none" /><input type="time" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full bg-white border-none rounded-xl py-3 px-3 text-xs font-bold text-midnight-fjord outline-none" /></div></div>
                  <div className="bg-slate-50/50 p-4 rounded-[24px] space-y-4"><div className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">Ende / Check-out</div><div className="grid grid-cols-2 gap-3"><input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} className="w-full bg-white border-none rounded-xl py-3 px-3 text-xs font-bold text-midnight-fjord outline-none" /><input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full bg-white border-none rounded-xl py-3 px-3 text-xs font-bold text-midnight-fjord outline-none" /></div></div>
                  <div className="flex gap-3">{editingItem && <button onClick={handleDeleteItem} disabled={isSaving} className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center active:scale-95 transition-all">{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-6 h-6" />}</button>}<button onClick={handleSaveItem} disabled={isSaving || !newTitle} className="flex-1 h-16 bg-midnight-fjord text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-midnight-fjord/20">{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5 text-glacier-mint" />{editingItem ? 'SPEICHERN' : 'HINZUFÜGEN'}</>}</button></div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
