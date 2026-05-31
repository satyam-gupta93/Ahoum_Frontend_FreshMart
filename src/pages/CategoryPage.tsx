import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { ProductCard } from '../components/shared/ProductCard';
import { ProductCardSkeleton } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { categories } from '../data/categories';
import type { ProductCategory } from '../types';
import { SortOption } from '../types';

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchByCategory, filteredProducts, isLoading, setFilter, filters, resetFilters } = useProductStore();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const category = categories.find((c) => c.id === id);

  useEffect(() => {
    if (category) {
      resetFilters();
      fetchByCategory(category.name as ProductCategory);
    }
  }, [id, category, fetchByCategory, resetFilters]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="🔍" title="Category not found" action={{ label: 'Go Home', onClick: () => navigate('/') }} />
      </div>
    );
  }

  const sortOptions = Object.values(SortOption);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-30 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">{category.icon}</span>
          <h1 className="font-bold text-gray-800 text-lg">{category.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label={`Switch to ${layout === 'grid' ? 'list' : 'grid'} view`}
          >
            {layout === 'grid' ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="md:max-w-7xl md:mx-auto md:px-6 md:py-6 md:flex md:gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Filters</h3>

            {/* Sort */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</p>
              <div className="space-y-1.5">
                {sortOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      value={opt}
                      checked={filters.sortBy === opt}
                      onChange={() => setFilter({ sortBy: opt as SortOption })}
                      className="accent-emerald-500 w-3.5 h-3.5"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price</p>
              <input
                type="range"
                min={0}
                max={1000}
                step={50}
                value={filters.maxPrice}
                onChange={(e) => setFilter({ maxPrice: Number(e.target.value) })}
                className="w-full accent-emerald-500"
                aria-label="Maximum price filter"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₹0</span>
                <span className="font-semibold text-emerald-600">₹{filters.maxPrice}</span>
              </div>
            </div>

            {/* Min rating */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Rating</p>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilter({ minRating: r })}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${filters.minRating === r ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Organic */}
            <div className="mb-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOrganic}
                  onChange={(e) => setFilter({ isOrganic: e.target.checked })}
                  className="accent-emerald-500 w-4 h-4 rounded"
                  id="filter-organic"
                />
                <span className="text-sm font-medium text-gray-700">🌱 Organic Only</span>
              </label>
            </div>

            <button
              onClick={resetFilters}
              className="w-full text-sm text-red-500 hover:text-red-600 font-medium py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Product area */}
        <div className="flex-1 px-4 md:px-0">
          {/* Desktop title + sort bar */}
          <div className="hidden md:flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{category.name}</h1>
                <p className="text-sm text-gray-500">{filteredProducts.length} products</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter({ sortBy: e.target.value as SortOption })}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Sort products"
              >
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <button onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" aria-label="Toggle layout">
                {layout === 'grid' ? '☰' : '⊞'}
              </button>
            </div>
          </div>

          {/* Mobile sort chips */}
          <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-3 px-0">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter({ sortBy: opt as SortOption })}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all border
                  ${filters.sortBy === opt ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Products */}
          {isLoading ? (
            <div className={`mt-3 ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-3'}`}>
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No products found"
              description="Try adjusting your filters or search in a different category."
              action={{ label: 'Reset Filters', onClick: resetFilters }}
            />
          ) : (
            <div className={`mt-3 ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'space-y-3'}`}>
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} layout={layout} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
