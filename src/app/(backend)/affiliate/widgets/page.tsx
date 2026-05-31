'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TopAppBar from '@/components/TopAppBar';

interface PartnerWidget {
  id: string;
  title: string;
  page_slug: string;
  target_domain: string | null;
  embed_code: string;
  active: boolean;
  created_at: string;
}

export default function WidgetsManagerPage() {
  const [widgets, setWidgets] = useState<PartnerWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWidget, setEditingWidget] = useState<Partial<PartnerWidget> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchWidgets();
  }, []);

  async function fetchWidgets() {
    setLoading(true);
    if (!supabase) return;
    const { data, error } = await supabase
      .from('partner_widgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage({ type: 'error', text: 'Error fetching widgets: ' + error.message });
    } else {
      setWidgets(data || []);
    }
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingWidget) return;

    const { id, created_at, ...payload } = editingWidget as any;
    
    let error;
    if (id) {
      const { error: updateError } = await supabase
        .from('partner_widgets')
        .update(payload)
        .eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('partner_widgets')
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      setMessage({ type: 'error', text: 'Error saving widget: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Widget saved successfully' });
      setIsModalOpen(false);
      setEditingWidget(null);
      fetchWidgets();
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('Are you sure you want to delete this widget?')) return;

    const { error } = await supabase
      .from('partner_widgets')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: 'Error deleting widget: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Widget deleted successfully' });
      fetchWidgets();
    }
  };

  const openModal = (widget: Partial<PartnerWidget> = { title: '', page_slug: 'gems', active: true, embed_code: '' }) => {
    setEditingWidget(widget);
    setIsModalOpen(true);
  };

  return (
    <>
      <TopAppBar title="WIDGET ENGINE" />

      <main className="pt-24 pb-32 px-6 max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-lg gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/affiliate" className="text-slate-stone hover:text-midnight-fjord transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </Link>
              <h1 className="font-display-lg text-display-lg text-midnight-fjord">Partner Widgets</h1>
            </div>
            <p className="font-body-lg text-body-lg text-slate-stone">Manage dynamic 3rd-party integrations and affiliate embeds.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-midnight-fjord text-white px-8 py-3 rounded-full font-label-caps text-label-caps flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            CREATE NEW WIDGET
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-glacier-mint/20 text-on-tertiary-container' : 'bg-red-50 text-red-600'}`}>
            <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="font-medium">{message.text}</span>
            <button onClick={() => setMessage(null)} className="ml-auto material-symbols-outlined text-sm">close</button>
          </div>
        )}

        <div className="bg-white rounded-[32px] overflow-hidden nordic-shadow border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">TITLE & SLUG</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">DOMAIN</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone">STATUS</th>
                <th className="px-6 py-4 font-label-caps text-label-caps text-slate-stone text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-stone">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-glacier-mint border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading widgets...</span>
                    </div>
                  </td>
                </tr>
              ) : widgets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-stone">
                    No widgets found. Create your first one to get started.
                  </td>
                </tr>
              ) : (
                widgets.map((widget) => (
                  <tr key={widget.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-midnight-fjord">{widget.title}</span>
                        <span className="text-[10px] text-slate-stone font-mono uppercase tracking-wider">SLUG: {widget.page_slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-stone">{widget.target_domain || 'Global'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${widget.active ? 'bg-glacier-mint/20 text-on-tertiary-container' : 'bg-slate-200 text-slate-stone'}`}>
                        {widget.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(widget)}
                          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-midnight-fjord transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(widget.id)}
                          className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && editingWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-midnight-fjord/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[32px] nordic-shadow overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm">
                {editingWidget.id ? 'Edit Widget' : 'New Widget'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="material-symbols-outlined text-slate-400 hover:text-midnight-fjord transition-colors">close</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-slate-stone block">WIDGET TITLE</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                    value={editingWidget.title || ''}
                    onChange={e => setEditingWidget({...editingWidget, title: e.target.value})}
                    placeholder="e.g. Booking.com Search"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-slate-stone block">PAGE SLUG</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                    value={editingWidget.page_slug || ''}
                    onChange={e => setEditingWidget({...editingWidget, page_slug: e.target.value})}
                    placeholder="e.g. gems"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-slate-stone block">TARGET DOMAIN (OPTIONAL)</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                  value={editingWidget.target_domain || ''}
                  onChange={e => setEditingWidget({...editingWidget, target_domain: e.target.value})}
                  placeholder="e.g. partner-site.com"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-[10px] text-slate-stone block">EMBED CODE (HTML/JS)</label>
                <textarea 
                  required
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-glacier-mint/50 transition-all"
                  value={editingWidget.embed_code || ''}
                  onChange={e => setEditingWidget({...editingWidget, embed_code: e.target.value})}
                  placeholder="<script>...</script>"
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="active-check"
                  className="w-5 h-5 rounded border-slate-200 text-glacier-mint focus:ring-glacier-mint"
                  checked={editingWidget.active ?? true}
                  onChange={e => setEditingWidget({...editingWidget, active: e.target.checked})}
                />
                <label htmlFor="active-check" className="text-sm font-medium text-midnight-fjord">Widget is active</label>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-full font-label-caps text-label-caps hover:bg-slate-50 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-midnight-fjord text-white rounded-full font-label-caps text-label-caps hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  SAVE WIDGET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
