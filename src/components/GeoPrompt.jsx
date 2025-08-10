'use client';

import { useState, useEffect } from 'react';
import { useGeo } from './GeoContext';

export default function GeoPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { loading, prompted, detectGeolocation } = useGeo();

  useEffect(() => {
    // Show prompt after a delay if geolocation hasn't been detected
    const timer = setTimeout(() => {
      if (!prompted && !loading) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [prompted, loading]);

  const handleAllowLocation = () => {
    setShowPrompt(false);
    detectGeolocation();
  };

  const handleDecline = () => {
    setShowPrompt(false);
    // Use IP geolocation as fallback
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        // This would trigger the geo context update
        console.log('Using IP geolocation fallback:', data);
      })
      .catch(() => {
        console.log('Falling back to default location');
      });
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Enable Location Services</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          We'd like to access your location to show you products available in your area, 
          local pricing, and shipping options. This helps us provide you with the most 
          relevant shopping experience.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={handleAllowLocation}
            className="btn-primary flex-1"
          >
            Allow Location
          </button>
          <button
            onClick={handleDecline}
            className="btn-secondary flex-1"
          >
            No Thanks
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          You can change this setting at any time in your browser preferences.
        </p>
      </div>
    </div>
  );
}

