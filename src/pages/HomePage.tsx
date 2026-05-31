import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useLocationStore } from '../stores/useLocationStore';
import { ProductCard } from '../components/shared/ProductCard';
import { CategoryCard } from '../components/shared/CategoryCard';
import { ProductCardSkeleton, CategoryChipSkeleton, BannerSkeleton } from '../components/shared/SkeletonCard';
import { categories, banners } from '../data/categories';

export function HomePage() {
  const navigate = useNavigate();
  const { fetchProducts, getFeaturedProducts, isLoading } = useProductStore();
  const selectedCity = useLocationStore((s) => s.selectedCity);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-rotate banner
  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const featured = getFeaturedProducts();
  const banner = banners[bannerIdx];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-12 pb-6 rounded-b-[32px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full" />
        </div>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Deliver to</p>
            <button
              id="home-location-btn"
              onClick={() => navigate('/location')}
              className="flex items-center gap-1 text-white font-bold text-base mt-0.5 hover:text-emerald-100 transition-colors"
              aria-label="Change delivery location"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{selectedCity || 'Select City'}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            aria-label="Profile"
          >
            <span className="text-lg">👤</span>
          </button>
        </div>

        {/* Search bar */}
        <button
          onClick={() => navigate('/search')}
          id="home-search-bar"
          className="mt-4 relative w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow text-left"
          aria-label="Search products"
        >
          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm text-gray-400">Search for groceries, fruits...</span>
        </button>
      </div>

      <div className="px-4 md:max-w-7xl md:mx-auto md:px-6">
        {/* Desktop welcome */}
        <div className="hidden md:flex items-center justify-between py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good {new Date().getHours() < 12 ? '🌅 Morning' : new Date().getHours() < 17 ? '☀️ Afternoon' : '🌙 Evening'}!
            </h1>
            <p className="text-gray-500 mt-0.5">What would you like to buy today?</p>
          </div>
          {selectedCity && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {selectedCity}
            </div>
          )}
        </div>

        {/* Banner */}
        <div className="mt-5 md:mt-0">
          {isLoading ? (
            <BannerSkeleton />
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden h-40 md:h-52 cursor-pointer transition-all duration-500"
              style={{ backgroundColor: banner.bgColor }}
              onClick={() => navigate(banner.ctaLink)}
              role="button"
              tabIndex={0}
              id="home-banner"
              aria-label={banner.title}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute right-0 top-0 h-full w-3/5 object-cover opacity-60"
              />
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg mb-2">
                    LIMITED OFFER
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{banner.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{banner.subtitle}</p>
                </div>
                <button className="self-start bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-md">
                  {banner.ctaText} →
                </button>
              </div>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {banners.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i === bannerIdx ? 'w-4 h-1.5 bg-emerald-600' : 'w-1.5 h-1.5 bg-gray-400/40'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold text-gray-800">Shop by Category</h2>
            <button onClick={() => navigate('/search')} className="text-sm text-emerald-600 font-semibold hover:underline">
              See all
            </button>
          </div>
          {isLoading ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {Array(6).fill(0).map((_, i) => <CategoryChipSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {/* Mobile: horizontal scroll chips */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:hidden">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} compact />
                ))}
              </div>
              {/* Desktop: grid */}
              <div className="hidden md:grid grid-cols-5 xl:grid-cols-10 gap-3">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id} category={cat} compact />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Featured / Deals section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold text-gray-800">🔥 Today's Deals</h2>
            <button onClick={() => navigate('/search')} className="text-sm text-emerald-600 font-semibold hover:underline">
              View all
            </button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array(6).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featured.slice(0, 10).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Popular products */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold text-gray-800">⭐ Popular Items</h2>
            <button onClick={() => navigate('/search')} className="text-sm text-emerald-600 font-semibold hover:underline">
              View all
            </button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {featured.slice(0, 8).reverse().map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom promo card */}
        <div className="mt-6 mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 flex items-center justify-between overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-white font-bold text-base">Free Delivery</p>
            <p className="text-emerald-100 text-sm mt-0.5">On orders above ₹499</p>
          </div>
          <div className="text-4xl relative z-10">🚚</div>
        </div>
      </div>
    </div>
  );
}
