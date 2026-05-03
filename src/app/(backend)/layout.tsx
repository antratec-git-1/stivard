import React from 'react';

export default function BackendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cloud-white font-body-md text-midnight-fjord antialiased min-h-screen">
      {children}
    </div>
  );
}
