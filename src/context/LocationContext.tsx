"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

// Stockholm coordinates as our "Nordic Fjord Hotel" base
const HOTEL_COORDS = { lat: 59.3293, lon: 18.0686 };
const DISTANCE_THRESHOLD_METERS = 500;

export type WeatherInfo = {
  temp: number;
  code: number;
};

export type LocationState = {
  lat: number;
  lon: number;
  name: string;
  weather: WeatherInfo | null;
  isHotelContext: boolean;
};

interface LocationContextType {
  location: LocationState | null;
  loading: boolean;
  error: boolean;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Haversine formula to calculate distance in meters between two lat/lon points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const locationRef = useRef<LocationState | null>(null);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const performApiFetches = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      // 1. Reverse Geocoding via Nominatim
      let locName = "Nordic Fjord Hotel"; // Default fallback
      const distToHotel = getDistance(lat, lon, HOTEL_COORDS.lat, HOTEL_COORDS.lon);
      const isHotel = distToHotel <= DISTANCE_THRESHOLD_METERS;

      if (!isHotel) {
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            locName = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Explorer Region";
          }
        } catch (e) {
          console.warn("Geocoding failed, using generic name.", e);
          locName = "Explorer Region";
        }
      }

      // 2. Fetch weather (Open-Meteo)
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      if (!weatherRes.ok) throw new Error('Weather API error');
      
      const weatherData = await weatherRes.json();
      
      setLocation({
        lat,
        lon,
        name: locName,
        weather: {
          temp: Math.round(weatherData.current_weather.temperature),
          code: weatherData.current_weather.weathercode,
        },
        isHotelContext: isHotel
      });
      setError(false);
    } catch (err) {
      console.error("Error fetching location data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const checkLocation = useCallback(() => {
    if (!navigator.geolocation) {
      performApiFetches(HOTEL_COORDS.lat, HOTEL_COORDS.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = locationRef.current;
        
        // If we already have a location, check the delta distance
        if (currentLocation) {
          const delta = getDistance(currentLocation.lat, currentLocation.lon, latitude, longitude);
          if (delta > DISTANCE_THRESHOLD_METERS) {
            console.log(`Location changed by ${Math.round(delta)}m. Updating...`);
            performApiFetches(latitude, longitude);
          } else {
            console.log(`Location stable (delta ${Math.round(delta)}m). Skipping update.`);
          }
        } else {
          // Initial fetch
          performApiFetches(latitude, longitude);
        }
      },
      (error) => {
        console.warn("Geolocation denied or failed. Using hotel fallback.", error);
        performApiFetches(HOTEL_COORDS.lat, HOTEL_COORDS.lon);
      },
      { timeout: 5000 }
    );
  }, []);

  // Initial fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      checkLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkLocation]); // Run once on mount

  // On-Focus listener
  useEffect(() => {
    const onFocus = () => {
      console.log("App resumed. Checking location...");
      checkLocation();
    };

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [checkLocation]);

  const refreshLocation = () => {
    setLocation(null); // Optional: clear state to show loader
    checkLocation();
  };

  return (
    <LocationContext.Provider value={{ location, loading, error, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
