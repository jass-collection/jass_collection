'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const GeoContext = createContext();

export function useGeo() {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error('useGeo must be used within a GeoProvider');
  }
  return context;
}

export function GeoProvider({ children }) {
  const [geoData, setGeoData] = useState({
    country: null,
    countryCode: null,
    state: null,
    currency: 'USD',
    symbol: '$',
    states: [],
    loading: true,
    prompted: false
  });

  const detectGeolocation = async () => {
    try {
      // Try browser geolocation first
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await fetchLocationData(position.coords.latitude, position.coords.longitude);
          },
          async () => {
            // Fallback to IP geolocation
            await fetchLocationDataByIP();
          }
        );
      } else {
        await fetchLocationDataByIP();
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      // Default to US
      setDefaultLocation();
    }
  };

  const fetchLocationData = async (lat, lon) => {
    try {
      const response = await fetch(`https://ipapi.co/json/`);
      const data = await response.json();
      await updateLocationFromData(data);
    } catch (error) {
      console.error('Location fetch error:', error);
      setDefaultLocation();
    }
  };

  const fetchLocationDataByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      await updateLocationFromData(data);
    } catch (error) {
      console.error('IP location fetch error:', error);
      setDefaultLocation();
    }
  };

  const updateLocationFromData = async (data) => {
    try {
      const countriesResponse = await fetch('/api/countries');
      const countries = await countriesResponse.json();
      
      const countryCode = data.country_code;
      const countryData = countries[countryCode];
      
      if (countryData) {
        setGeoData(prev => ({
          ...prev,
          country: countryData.name,
          countryCode: countryCode,
          currency: countryData.currency,
          symbol: countryData.symbol,
          states: countryData.states,
          state: data.region || countryData.states[0],
          loading: false,
          prompted: true
        }));
      } else {
        setDefaultLocation();
      }
    } catch (error) {
      console.error('Country data fetch error:', error);
      setDefaultLocation();
    }
  };

  const setDefaultLocation = () => {
    setGeoData(prev => ({
      ...prev,
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
      symbol: '$',
      states: [],
      loading: false,
      prompted: true
    }));
  };

  const updateState = (newState) => {
    setGeoData(prev => ({
      ...prev,
      state: newState
    }));
  };

  useEffect(() => {
    detectGeolocation();
  }, []);

  return (
    <GeoContext.Provider value={{
      ...geoData,
      updateState,
      detectGeolocation
    }}>
      {children}
    </GeoContext.Provider>
  );
}

