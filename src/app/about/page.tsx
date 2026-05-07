'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import TopAppBar from '@/components/TopAppBar';

interface ContentItem {
  section_key: string;
  content_de: string;
}

export default function AboutPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('section_key, content_de')
          .in('section_key', ['about_hero_content', 'legal_imprint_data']);

        if (error) throw error;

        const contentMap = (data as ContentItem[]).reduce((acc, item) => {
          acc[item.section_key] = item.content_de;
          return acc;
        }, {} as Record<string, string>);

        setContent(contentMap);
      } catch (err) {
        console.error('Error fetching page content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

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
        {/* Hero Section Card */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm mb-6 relative overflow-hidden border border-slate-100">
            {/* Glacier Mint Accent Strip */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#7FFFD4]"></div>
            
            <h1 className="font-bold text-[#041627] text-headline-md mb-6">Über STIVARD</h1>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
              </div>
            ) : (
              <div className="text-[#1a1c1c] text-body-lg leading-relaxed markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.about_hero_content || 'Inhalt wird geladen...'}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        {/* Imprint Section Card */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="bg-white rounded-[1.5rem] p-8 shadow-sm mb-6 border border-slate-100">
            <h2 className="font-bold text-[#041627] text-headline-sm mb-6">Impressum</h2>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse"></div>
              </div>
            ) : (
              <div className="text-[#1a1c1c] text-body-md leading-relaxed markdown-content opacity-90">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.legal_imprint_data || 'Impressumsdaten werden geladen...'}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        {/* Custom styles for Markdown content inside the page component or global CSS */}
        <style jsx global>{`
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
        `}</style>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-slate-stone text-xs font-medium uppercase tracking-[0.2em] opacity-40">
            Stivard – Your Digital Concierge
          </p>
        </footer>
      </main>
    </div>
  );
}
