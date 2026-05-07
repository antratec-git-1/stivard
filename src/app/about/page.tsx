import React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import TopAppBar from '@/components/TopAppBar';

interface ContentItem {
  section_key: string;
  content_de: string;
}

export default async function AboutPage() {
  const content: Record<string, string> = {};
  let errorMsg = null;

  if (!supabase) {
    errorMsg = 'Supabase ist in dieser Umgebung nicht konfiguriert.';
  } else {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('section_key, content_de')
        .in('section_key', ['about_hero_content', 'legal_imprint_data']);

      if (error) throw error;

      if (data) {
        (data as ContentItem[]).forEach(item => {
          content[item.section_key] = item.content_de;
        });
      }
    } catch (err: any) {
      console.error('Error fetching page content:', err);
      errorMsg = err.message || 'Fehler beim Laden der Inhalte.';
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-20">
      {/* Sticky Header with Back Button */}
      <div className="fixed top-0 left-0 w-full z-50">
        <TopAppBar 
          title="ABOUT US" 
          subtitle={
            <Link href="/" className="flex items-center gap-1 hover:text-glacier-mint transition-colors">
              <span className="material-symbols-outlined text-[12px]">arrow_back</span>
              Back to Discovery
            </Link>
          }
        />
      </div>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-8 text-red-800 text-sm flex items-start gap-4">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <div>
              <p className="font-bold mb-1">Fehler beim Laden</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Hero Section Card */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm mb-6 relative overflow-hidden border border-slate-100">
            {/* Glacier Mint Accent Strip */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#7FFFD4]"></div>
            
            <h1 className="font-bold text-[#041627] text-headline-md mb-6">Über STIVARD</h1>
            
            <div className="text-[#1a1c1c] text-body-lg leading-relaxed markdown-content">
              {content.about_hero_content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.about_hero_content}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-400 italic">Inhalt nicht gefunden oder Konfigurationsfehler.</p>
              )}
            </div>
          </div>
        </section>

        {/* Imprint Section Card */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm mb-6 border border-slate-100">
            <h2 className="font-bold text-[#041627] text-headline-sm mb-6">Impressum</h2>
            
            <div className="text-[#1a1c1c] text-body-md leading-relaxed markdown-content opacity-90">
              {content.legal_imprint_data ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.legal_imprint_data}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-400 italic">Impressumsdaten nicht gefunden oder Konfigurationsfehler.</p>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-slate-stone text-xs font-medium uppercase tracking-[0.2em] opacity-40">
            Stivard – Your Digital Concierge
          </p>
        </footer>

        {/* Custom styles for Markdown content */}
        <style dangerouslySetInnerHTML={{ __html: `
          .markdown-content p {
            margin-bottom: 1rem;
          }
          .markdown-content p:last-child {
            margin-bottom: 0;
          }
          .markdown-content strong {
            font-weight: 700;
            color: #041627;
          }
          .markdown-content h1, .markdown-content h2, .markdown-content h3 {
            font-weight: 700;
            color: #041627;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .markdown-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1rem;
          }
          .markdown-content li {
            margin-bottom: 0.25rem;
          }
        ` }} />
      </main>
    </div>
  );
}
