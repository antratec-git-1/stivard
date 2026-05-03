"use client";

import React from 'react';
import { useLocation } from '@/context/LocationContext';

// Open-Meteo WMO Weather interpretation codes
const getWeatherDetails = (code: number) => {
  if (code === 0) return { icon: 'sunny', recommendation: 'Perfekte Bedingungen für Outdoor-Aktivitäten. Stewart empfiehlt einen Spaziergang am Fjord.' };
  if (code >= 1 && code <= 3) return { icon: 'cloud', recommendation: 'Ein entspannter Tag. Perfekt für einen Besuch im Museum oder im Café.' };
  if (code >= 45 && code <= 48) return { icon: 'foggy', recommendation: 'Mystische Stimmung draußen. Mach es dir bei einem Tee im Hotel gemütlich.' };
  if (code >= 51 && code <= 67) return { icon: 'rainy', recommendation: 'Stewart empfiehlt heute das Indoor-Spa oder unsere exklusiven Indoor-Aktivitäten.' };
  if (code >= 71 && code <= 77) return { icon: 'cloudy_snowing', recommendation: 'Magische Schneelandschaft! Perfekte Bedingungen für Nordlichter heute Nacht.' };
  if (code >= 95 && code <= 99) return { icon: 'thunderstorm', recommendation: 'Bleib sicher im Trockenen. Ein guter Zeitpunkt für ein exzellentes Dinner im Hotel.' };
  return { icon: 'thermostat', recommendation: 'Das Wetter ist wechselhaft. Stewart hält dich auf dem Laufenden.' };
};

export default function WeatherWidget() {
  const { location, loading, error, refreshLocation } = useLocation();

  if (loading) {
    return (
      <div className="bg-midnight-fjord p-8 rounded-[32px] h-full flex flex-col justify-between shadow-xl animate-pulse min-h-[300px]">
        <div>
          <div className="h-4 w-24 bg-white/20 rounded mb-4"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-20 bg-white/20 rounded"></div>
            <div className="h-10 w-10 bg-white/20 rounded-full"></div>
          </div>
          <div className="h-3 w-full bg-white/20 rounded mb-2"></div>
          <div className="h-3 w-2/3 bg-white/20 rounded"></div>
        </div>
        <div className="w-full h-12 bg-white/20 rounded-2xl mt-6"></div>
      </div>
    );
  }

  if (error || !location || !location.weather) {
    return (
      <div className="bg-midnight-fjord p-8 rounded-[32px] h-full flex flex-col justify-between shadow-xl min-h-[300px]">
        <div>
          <span className="font-label-caps text-glacier-mint/60 mb-2 block uppercase">Weather Service</span>
          <p className="text-white/60 font-body-md">Wetterdaten derzeit nicht verfügbar. Bitte probiere es später erneut.</p>
        </div>
        <button onClick={refreshLocation} className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl active:scale-95 transition-transform mt-6 hover:bg-white/20">Neu laden</button>
      </div>
    );
  }

  const { icon, recommendation } = getWeatherDetails(location.weather.code);

  return (
    <div className="bg-midnight-fjord p-8 rounded-[32px] h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl min-h-[300px] relative group">
      <button 
        onClick={refreshLocation} 
        className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        title="Wetter & Ort aktualisieren"
      >
        <span className="material-symbols-outlined text-[20px]">refresh</span>
      </button>
      
      <div>
        <span className="font-label-caps text-glacier-mint/90 mb-2 block uppercase tracking-widest text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          {location.name}
        </span>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl font-bold text-white">{location.weather.temp}°C</span>
          <span className="material-symbols-outlined text-glacier-mint text-4xl">{icon}</span>
        </div>
        <p className="text-white/80 font-body-md text-sm leading-relaxed">
          {recommendation}
        </p>
      </div>
      <button className="w-full py-4 bg-glacier-mint text-midnight-fjord font-bold rounded-2xl active:scale-95 transition-transform mt-6 hover:shadow-[0_0_15px_rgba(127,255,212,0.3)]">
        Reserve My Spot
      </button>
    </div>
  );
}
