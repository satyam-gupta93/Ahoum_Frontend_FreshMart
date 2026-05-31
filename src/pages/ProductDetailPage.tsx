import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useToastStore } from '../stores/useToastStore';
import { products } from '../data/products';
import { formatCurrency } from '../utils/helpers';
import { EmptyState } from '../components/shared/EmptyState';
import { ProductCard } from '../components/shared/ProductCard';
import { QuantitySelector } from '../components/ui/QuantitySelector';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getProductById = useProductStore((s) => s.getProductById);
  const addItem = useCartStore((s) => s.addItem);
  const getItemQuantity = useCartStore((s) => s.getItemQuantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const addToast = useToastStore((s) => s.addToast);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [imgError, setImgError] = useState(false);

  const product = getProductById(id ?? '');
  const qty = product ? getItemQuantity(product.id) : 0;
  const isFav = product ? isFavorite(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState icon="🔍" title="Product not found" action={{ label: 'Go Back', onClick: () => navigate(-1) }} />
      </div>
    );
  }

  function handleAddToCart() {
    addItem(product!);
    addToast(`${product!.name} added to cart! 🛒`, 'success');
  }

  function handleToggleFav() {
    toggleFavorite(product!);
    addToast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', isFav ? 'info' : 'success');
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pb-36 md:pb-10">
      {/* Back button (mobile) */}
      <div className="md:hidden sticky top-0 z-30 bg-transparent px-4 pt-12 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleToggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="md:max-w-7xl md:mx-auto md:px-6 md:grid md:grid-cols-2 md:gap-10">
        {/* Product Image */}
        <div className="relative md:sticky md:top-24 md:self-start">
          <div className={`relative ${!imgError ? '' : 'bg-gray-100'} md:rounded-3xl overflow-hidden`} style={{ aspectRatio: '1/1', maxHeight: '400px' }}>
            {!imgError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover md:rounded-3xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-100 md:rounded-3xl">🛒</div>
            )}
            {product.discount && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white font-bold px-3 py-1 rounded-xl text-sm shadow">
                -{product.discount}% OFF
              </span>
            )}
            {product.isOrganic && (
              <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-xl">
                🌱 Organic
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="px-5 md:px-0 mt-5 md:mt-0">
          <p className="text-emerald-600 text-sm font-semibold">{product.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 leading-tight">{product.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{product.unit}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-sm text-gray-700">{product.rating}</span>
            <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="bg-orange-100 text-orange-600 text-sm font-bold px-2 py-0.5 rounded-lg">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2 mt-3 text-sm font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-400' : 'bg-red-500'}`} />
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-5 border-b border-gray-200">
            {(['details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                id={`product-tab-${tab}`}
                className={`pb-2 text-sm font-semibold capitalize transition-all border-b-2 -mb-px
                  ${activeTab === tab ? 'text-emerald-600 border-emerald-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {activeTab === 'details' ? (
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Unit</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{product.unit}</p>
                  </div>
                  {product.isOrganic && (
                    <div className="bg-emerald-50 rounded-xl p-3 col-span-2">
                      <p className="text-xs text-emerald-700 font-semibold">🌱 Certified Organic</p>
                      <p className="text-xs text-emerald-600 mt-0.5">No pesticides, no chemicals</p>
                    </div>
                  )}
                </div>
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { name: 'Priya M.', rating: 5, text: 'Super fresh and delivery was super fast! Will order again.' },
                  { name: 'Arjun S.', rating: 4, text: 'Good quality. Packaging could be better but the product is excellent.' },
                  { name: 'Kavya R.', rating: 5, text: 'Best I\'ve tasted. Highly recommend for anyone looking for fresh produce.' },
                ].map((review, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                      <div className="flex gap-0.5">
                        {Array(5).fill(0).map((_, s) => (
                          <span key={s} className={`text-xs ${s < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-8 px-5 md:max-w-7xl md:mx-auto md:px-6">
          <h2 className="font-bold text-gray-800 text-base mb-3">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Sticky Add to Cart */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 shadow-bottom-nav z-40 md:hidden">
        {qty === 0 ? (
          <button
            id="product-add-to-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500">In cart</p>
              <p className="text-sm font-bold text-gray-800">{formatCurrency(product.price * qty)}</p>
            </div>
            <QuantitySelector
              quantity={qty}
              onIncrease={() => updateQuantity(product.id, qty + 1)}
              onDecrease={() => updateQuantity(product.id, qty - 1)}
              size="md"
            />
            <button
              onClick={() => navigate('/cart')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl transition-all active:scale-95"
            >
              Cart →
            </button>
          </div>
        )}
      </div>

      {/* Desktop Add to Cart */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 mt-6">
        <div className="max-w-sm ml-auto">
          {qty === 0 ? (
            <button
              id="product-add-to-cart-desktop"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-md disabled:opacity-50 text-base"
            >
              {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={qty}
                onIncrease={() => updateQuantity(product.id, qty + 1)}
                onDecrease={() => updateQuantity(product.id, qty - 1)}
              />
              <button onClick={() => navigate('/cart')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-md">
                Go to Cart →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
