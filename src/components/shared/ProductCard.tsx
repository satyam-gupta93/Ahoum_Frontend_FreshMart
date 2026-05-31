import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { useToastStore } from '../../stores/useToastStore';
import { formatCurrency } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const getItemQuantity = useCartStore((s) => s.getItemQuantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const addToast = useToastStore((s) => s.addToast);
  const [imgError, setImgError] = useState(false);

  const qty = getItemQuantity(product.id);
  const isFav = isFavorite(product.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} added to cart`, 'success');
  }

  function handleToggleFav(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFavorite(product);
    addToast(
      isFav ? `Removed from favorites` : `Added to favorites`,
      isFav ? 'info' : 'success'
    );
  }

  function handleIncrease(e: React.MouseEvent) {
    e.stopPropagation();
    updateQuantity(product.id, qty + 1);
  }

  function handleDecrease(e: React.MouseEvent) {
    e.stopPropagation();
    if (qty <= 1) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, qty - 1);
    }
  }

  if (layout === 'list') {
    return (
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="flex gap-3 bg-white rounded-2xl p-3 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer animate-fade-in"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
        aria-label={`View ${product.name}`}
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🛒</div>
          )}
          {product.discount && (
            <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">
              -{product.discount}%
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-emerald-600 font-medium">{product.category}</p>
              <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
            </div>
            <button
              onClick={handleToggleFav}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className="flex-shrink-0 p-1 rounded-full hover:bg-red-50 transition-colors"
            >
              <svg className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="font-bold text-gray-900 text-sm">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            {qty === 0 ? (
              <button
                onClick={handleAddToCart}
                id={`add-to-cart-${product.id}`}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button onClick={handleDecrease} className="w-6 h-6 rounded-md border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-sm hover:bg-emerald-50 active:scale-90 transition-all">−</button>
                <span className="text-sm font-semibold w-4 text-center text-gray-800">{qty}</span>
                <button onClick={handleIncrease} className="w-6 h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-sm hover:bg-emerald-600 active:scale-90 transition-all">+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl p-3 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer group animate-fade-in"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden bg-gray-50 mb-2.5 aspect-square">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🛒</div>
        )}
        {/* Discount badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg shadow">
            -{product.discount}%
          </span>
        )}
        {/* Organic badge */}
        {product.isOrganic && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">
            🌱
          </span>
        )}
        {/* Favorite button */}
        <button
          onClick={handleToggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform active:scale-90"
        >
          <svg className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-emerald-600 font-medium truncate">{product.category}</p>
      <h3 className="font-semibold text-gray-800 text-sm leading-tight mt-0.5 line-clamp-2">{product.name}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-1">
        <span className="text-yellow-400 text-xs">★</span>
        <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
        <span className="text-xs text-gray-300">({product.reviewCount})</span>
      </div>

      {/* Price + Add to Cart */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="font-bold text-gray-900 text-sm">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <div className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</div>
          )}
        </div>
        {qty === 0 ? (
          <button
            onClick={handleAddToCart}
            id={`add-to-cart-grid-${product.id}`}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm hover:shadow-md"
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={handleDecrease} className="w-7 h-7 rounded-lg border-2 border-emerald-500 text-emerald-600 flex items-center justify-center font-bold text-sm hover:bg-emerald-50 active:scale-90 transition-all">−</button>
            <span className="text-sm font-semibold w-4 text-center">{qty}</span>
            <button onClick={handleIncrease} className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm hover:bg-emerald-600 active:scale-90 transition-all">+</button>
          </div>
        )}
      </div>
    </div>
  );
}
