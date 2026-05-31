import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { ProductCard } from '../components/shared/ProductCard';
import { ProductCardSkeleton } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { categories } from '../data/categories';
import { SortOption } from '../types';
import type { ProductCategory } from '../types';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';

  const { searchProducts, filteredProducts, isLoading, filters, setFilter, resetFilters, fetchProducts } = useProductStore();
  const [query, setQuery] = useState(initialQ);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  function handleCategorySelect(catName: ProductCategory | null) {
    setFilter({ category: catName });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Search header */}
      <div className="md:hidden sticky top-0 z-30 bg-white shadow-sm px-4 pt-12 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="search-input"
            type="search"
            placeholder="Search groceries, fruits, vegetables..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); resetFilters(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="md:max-w-7xl md:mx-auto md:px-6 md:flex md:gap-6 md:pt-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Filters</h3>

            {/* Category filter */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${!filters.category ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.name as ProductCategory)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all flex items-center gap-2
                      ${filters.category === cat.name ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</p>
              {Object.values(SortOption).map((opt) => (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer mb-1.5 group">
                  <input type="radio" name="sort" checked={filters.sortBy === opt} onChange={() => setFilter({ sortBy: opt })} className="accent-emerald-500 w-3.5 h-3.5" />
                  <span className="text-sm text-gray-700 group-hover:text-emerald-600">{opt}</span>
                </label>
              ))}
            </div>

            {/* Price range */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price: <span className="text-emerald-600">₹{filters.maxPrice}</span></p>
              <input type="range" min={0} max={1000} step={50} value={filters.maxPrice} onChange={(e) => setFilter({ maxPrice: Number(e.target.value) })} className="w-full accent-emerald-500" />
            </div>

            {/* Organic */}
            <label className="flex items-center gap-3 cursor-pointer mb-5">
              <input type="checkbox" checked={filters.isOrganic} onChange={(e) => setFilter({ isOrganic: e.target.checked })} className="accent-emerald-500 w-4 h-4" id="search-filter-organic" />
              <span className="text-sm font-medium text-gray-700">🌱 Organic Only</span>
            </label>

            <button onClick={resetFilters} className="w-full text-sm text-red-500 font-medium py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 px-4 md:px-0">
          {/* Desktop search */}
          <div className="hidden md:block mb-5">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="search-input-desktop"
                type="search"
                placeholder="Search groceries, fruits, vegetables..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-400 shadow-card transition-all"
                aria-label="Search products"
              />
              {query && (
                <button onClick={() => { setQuery(''); resetFilters(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear">✕</button>
              )}
            </div>
          </div>

          {/* Mobile: category chips */}
          <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-3">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-all
                ${!filters.category ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name as ProductCategory)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium border transition-all flex items-center gap-1
                  ${filters.category === cat.name ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Mobile filter/sort bar */}
          <div className="md:hidden flex items-center justify-between mt-2 mb-1">
            <p className="text-sm text-gray-500">
              {isLoading ? 'Searching...' : `${filteredProducts.length} results`}
              {query ? ` for "${query}"` : ''}
            </p>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium border border-emerald-300 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="md:hidden bg-white rounded-2xl shadow-card p-4 mb-3 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Filters & Sort</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">Sort By</p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(SortOption).map((opt) => (
                    <button key={opt} onClick={() => { setFilter({ sortBy: opt }); }} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filters.sortBy === opt ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200'}`}>{opt}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">Max Price: ₹{filters.maxPrice}</p>
                <input type="range" min={0} max={1000} step={50} value={filters.maxPrice} onChange={(e) => setFilter({ maxPrice: Number(e.target.value) })} className="w-full accent-emerald-500" />
              </div>
              <label className="flex items-center gap-3 mb-3 cursor-pointer">
                <input type="checkbox" checked={filters.isOrganic} onChange={(e) => setFilter({ isOrganic: e.target.checked })} className="accent-emerald-500 w-4 h-4" />
                <span className="text-sm text-gray-700">🌱 Organic Only</span>
              </label>
              <button onClick={() => { resetFilters(); setShowFilters(false); }} className="w-full text-sm text-red-500 py-2 border border-red-200 rounded-xl hover:bg-red-50">Reset</button>
            </div>
          )}

          {/* Desktop result count */}
          <div className="hidden md:block mb-4">
            <p className="text-sm text-gray-500">
              {isLoading ? 'Searching...' : `${filteredProducts.length} results`}
              {query ? ` for "${query}"` : ''}
            </p>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={query ? '🔍' : '📦'}
              title={query ? `No results for "${query}"` : 'No products found'}
              description={query ? 'Try different keywords or check your spelling.' : 'Try adjusting filters.'}
              action={{ label: 'Clear Search', onClick: () => { setQuery(''); resetFilters(); } }}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
