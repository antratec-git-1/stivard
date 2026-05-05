'use client';

import React, { useEffect, useRef } from 'react';

export default function DynamicWidget({ htmlCode }: { htmlCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !htmlCode) return;

    // Erzeugt ein ausführbares DocumentFragment aus dem String
    const range = document.createRange();
    const fragment = range.createContextualFragment(htmlCode);

    // Container leeren und das neue Fragment injizieren
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(fragment);
  }, [htmlCode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[100px] overflow-hidden rounded-[16px]"
    />
  );
}
