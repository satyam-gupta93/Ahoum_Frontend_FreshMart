import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import { useLocationStore } from '../../stores/useLocationStore';
import { useState } from 'react';

export function TopNav() {
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const [searchVal, setSearchVal] = useState('');

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/search');
    }
  }

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" id="nav-logo" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="text-xl font-bold text-emerald-600">FreshMart</span>
          </Link>

          {/* Location */}
          {selectedCity && (
            <button
              onClick={() => navigate('/location')}
              className="hidden lg:flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors flex-shrink-0"
              id="nav-location"
              aria-label="Change delivery location"
            >
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{selectedCity}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="desktop-search"
                type="search"
                placeholder="Search for groceries, fruits, vegetables..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                aria-label="Search products"
              />
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <NavLink
              to="/favorites"
              id="nav-favorites-desktop"
              aria-label="Favorites"
              className={({ isActive }) =>
                `p-2 rounded-xl transition-all ${isActive ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </NavLink>

            <NavLink
              to="/cart"
              id="nav-cart-desktop"
              aria-label={`Cart, ${totalItems} items`}
              className={({ isActive }) =>
                `relative p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/profile"
              id="nav-profile-desktop"
              aria-label="Profile"
              className={({ isActive }) =>
                `p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
