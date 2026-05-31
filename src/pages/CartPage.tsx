import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLocationStore } from '../stores/useLocationStore';
import { useToastStore } from '../stores/useToastStore';
import { Button } from '../components/ui/Button';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { EmptyState } from '../components/shared/EmptyState';
import { useState } from 'react';

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { selectedCity } = useLocationStore();
  const { addToast } = useToastStore();
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 40; // Free delivery above 500
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const discount = isPromoApplied ? promoDiscount : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FRESH50') {
      setIsPromoApplied(true);
      setPromoDiscount(50);
      addToast('Promo code applied! Saved ₹50.', 'success');
    } else if (promoCode.trim().toUpperCase() === 'FREE20') {
      setIsPromoApplied(true);
      setPromoDiscount(Math.round(subtotal * 0.2));
      addToast('20% discount applied!', 'success');
    } else {
      addToast('Invalid promo code. Try FRESH50 or FREE20.', 'error');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      addToast('Please login to checkout', 'info');
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Explore our fresh collections now!"
          action={{
            label: 'Start Shopping',
            onClick: () => navigate('/'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-12">
      {/* Page Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
        <p className="text-gray-500 text-sm mt-1">
          You have {getTotalItems()} items in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-4 md:p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {/* Product Image & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Link to={`/product/${item.product.id}`} className="block flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-gray-100 bg-gray-50"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[10px] md:text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full mb-1">
                      {item.product.category}
                    </span>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="block text-sm md:text-base font-bold text-gray-900 hover:text-emerald-600 transition-colors truncate"
                    >
                      {item.product.name}
                    </Link>
                    <span className="block text-xs md:text-sm text-gray-500 mt-0.5">
                      {item.product.unit}
                    </span>
                    <span className="block text-sm font-extrabold text-gray-900 mt-1 md:hidden">
                      ₹{item.product.price}
                    </span>
                  </div>
                </div>

                {/* Desktop Product Price */}
                <div className="hidden md:block text-right pr-6 min-w-[80px]">
                  <span className="text-base font-extrabold text-gray-900">
                    ₹{item.product.price}
                  </span>
                  {item.product.originalPrice && (
                    <span className="block text-xs text-gray-400 line-through">
                      ₹{item.product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex items-center gap-3 md:gap-6">
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
                  />
                  <button
                    onClick={() => {
                      removeItem(item.product.id);
                      addToast(`${item.product.name} removed from cart`, 'info');
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Continue Shopping */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors py-2 px-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Right Side: Order summary */}
        <div className="space-y-6">
          {/* Deliver to address preview */}
          {selectedCity && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-medium">Deliver to</span>
                  <span className="block text-sm font-bold text-gray-900 truncate">
                    {isAuthenticated && user?.address ? `${user.address.street}, ${user.address.city}` : `${selectedCity}`}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/location')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Change
              </button>
            </div>
          )}

          {/* Promo code */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Apply Promo Code</h3>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Try FRESH50 or FREE20"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isPromoApplied}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <Button
                type="submit"
                variant={isPromoApplied ? 'outline' : 'primary'}
                disabled={isPromoApplied || !promoCode.trim()}
                className="px-4 text-sm"
              >
                {isPromoApplied ? 'Applied' : 'Apply'}
              </Button>
            </form>
            {isPromoApplied && (
              <div className="mt-2 flex items-center justify-between text-xs text-emerald-600 bg-emerald-50/50 p-2 rounded-lg font-medium">
                <span>Code Applied Successfully!</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsPromoApplied(false);
                    setPromoDiscount(0);
                    setPromoCode('');
                  }}
                  className="font-bold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">
              Bill Details
            </h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span className="font-semibold text-gray-950">₹{subtotal}</span>
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promo Discount</span>
                  <span className="font-semibold">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Partner Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-950">₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Charges (5%)</span>
                <span className="font-semibold text-gray-950">₹{tax}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[11px] text-gray-400 bg-emerald-50 text-emerald-800 p-2 rounded-lg leading-snug">
                  💡 Tip: Add products worth <b>₹{Math.max(0, 500 - subtotal)}</b> more to unlock <b>FREE Delivery</b>!
                </p>
              )}
              <div className="border-t border-dashed border-gray-100 pt-4 mt-2 flex justify-between text-base font-extrabold text-gray-900">
                <span>To Pay</span>
                <span className="text-lg text-emerald-600">₹{total}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              fullWidth
              size="lg"
              className="group flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
