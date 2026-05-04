import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stivard | AI Concierge",
  description: "Hyper-lokale Empfehlungen für Hotelgäste in Echtzeit.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#1A2B3C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

import BottomNav from "@/components/BottomNav";
import { LocationProvider } from "@/context/LocationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script 
          {...{"nowprocket": ""}} 
          data-noptimize="1" 
          data-cfasync="false" 
          data-wpfc-render="false" 
          {...{"seraph-accel-crit": "1"}} 
          data-no-defer="1"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                  var script = document.createElement("script");
                  script.async = 1;
                  script.src = 'https://emrldco.com/NTI1MTkz.js?t=525193';
                  document.head.appendChild(script);
              })();
            `
          }}
        />
      </head>
      <body className="bg-cloud-white font-body-md text-midnight-fjord antialiased">
        <LocationProvider>
          {children}
          <BottomNav />
        </LocationProvider>
      </body>
    </html>
  );
}
