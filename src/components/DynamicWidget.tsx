'use client';

import React, { useEffect, useRef } from 'react';

export default function DynamicWidget({ htmlCode }: { htmlCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !htmlCode) return;

    // Clear container
    containerRef.current.innerHTML = '';

    // Create a temporary element to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = htmlCode;

    // Extract scripts and non-script elements
    const scripts = Array.from(temp.querySelectorAll('script'));
    
    // Append non-script elements first
    const range = document.createRange();
    const fragment = range.createContextualFragment(htmlCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, ""));
    containerRef.current.appendChild(fragment);

    // Manually create and append scripts to ensure execution
    scripts.forEach((oldScript) => {
      try {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // If it's an inline script, check if it's accidentally containing HTML
        const content = oldScript.textContent || '';
        if (content.trim().startsWith('<')) {
          console.error('DynamicWidget: Script tag contains HTML, skipping execution.', content);
          return;
        }
        
        newScript.textContent = content;
        containerRef.current?.appendChild(newScript);
      } catch (err) {
        console.error('DynamicWidget: Error executing script', err);
      }
    });
  }, [htmlCode]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[100px] overflow-hidden rounded-[16px]"
    />
  );
}
