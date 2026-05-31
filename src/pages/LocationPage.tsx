import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../stores/useLocationStore';
import { Button } from '../components/ui/Button';
import { cities } from '../data/categories';

export function LocationPage() {
  const navigate = useNavigate();
  const { setCity, detectLocation, isLoading, selectedCity } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSelectCity(city: string) {
    setCity(city);
    navigate('/');
  }

  async function handleDetect() {
    await detectLocation();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full" />
          <div className="absolute bottom-0 left-4 w-20 h-20 bg-white rounded-full" />
        </div>
        <div className="relative">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl">📍</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Select Location</h1>
          <p className="text-emerald-100 mt-1">Choose your delivery city</p>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-slide-up">
          {/* Detect Location */}
          <Button
            id="detect-location"
            variant="outline"
            fullWidth
            size="lg"
            isLoading={isLoading}
            onClick={handleDetect}
            className="rounded-2xl mb-5"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            {isLoading ? 'Detecting...' : 'Use My Current Location'}
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR SELECT A CITY</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="location-search"
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
              aria-label="Search cities"
            />
          </div>

          {/* City list */}
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No cities found</p>
            ) : (
              filtered.map((city) => (
                <button
                  key={city}
                  id={`city-${city.toLowerCase()}`}
                  onClick={() => handleSelectCity(city)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700
                    ${selectedCity === city ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300' : 'bg-gray-50 text-gray-700 border-2 border-transparent'}`}
                  aria-pressed={selectedCity === city}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏙️</span>
                    <span>{city}</span>
                  </div>
                  {selectedCity === city && (
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="h-8" />
    </div>
  );
}
