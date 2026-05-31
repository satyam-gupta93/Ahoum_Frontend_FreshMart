import { useNavigate } from 'react-router-dom';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { ProductCard } from '../components/shared/ProductCard';
import { EmptyState } from '../components/shared/EmptyState';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <EmptyState
          icon="❤️"
          title="No favorites yet"
          description="Save your favorite grocery items here to order them quickly anytime!"
          action={{
            label: 'Explore Products',
            onClick: () => navigate('/'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-12">
      {/* Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Your Favorites</h1>
        <p className="text-gray-500 text-sm mt-1">
          You have saved {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
