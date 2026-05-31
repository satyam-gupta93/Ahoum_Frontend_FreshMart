import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { useToastStore } from '../stores/useToastStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { Address } from '../types';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { placeOrder, isLoading: orderLoading } = useOrderStore();
  const { addToast } = useToastStore();

  // Redirect if empty cart or unauthenticated
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Form states
  const [address, setAddress] = useState<Address>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    label: user?.address?.label || 'Home',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculation
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!address.street.trim()) errors.street = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State is required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode.trim())) {
      errors.pincode = 'Pincode must be 6 digits';
    }

    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        errors.upi = 'Enter a valid UPI ID (e.g. user@okhdfc)';
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
        errors.card = 'Card number must be 16 digits';
      }
      if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        errors.expiry = 'Expiry must be MM/YY';
      }
      if (!cardCvv.trim() || !/^\d{3}$/.test(cardCvv)) {
        errors.cvv = 'CVV must be 3 digits';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please fix validation errors', 'error');
      return;
    }

    const success = await placeOrder(
      items,
      total,
      address,
      paymentMethod.toUpperCase()
    );

    if (success) {
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate('/order-success');
    } else {
      addToast('Payment processing failed. Try Cash on Delivery!', 'error');
      navigate('/order-failure');
    }
  };

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="relative w-28 h-28 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-4xl">🔒</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Processing Your Order</h2>
        <p className="text-gray-500 max-w-sm">
          Please do not refresh the page or hit the back button. We are securing your transaction with the bank...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-12">
      {/* Breadcrumb / Steps */}
      <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-gray-400">
        <span className="text-emerald-600">Cart</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-emerald-600">Checkout</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span>Receipt</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Delivery Details & Payments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-extrabold">1</span>
              Delivery Address
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3 mb-2">
                {['Home', 'Office', 'Other'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setAddress((a) => ({ ...a, label: lbl }))}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border
                      ${address.label === lbl
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/10'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <Input
                label="Street Address / Area"
                value={address.street}
                onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                placeholder="Flat No, Wing, Street, Landmark"
                error={formErrors.street}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  placeholder="e.g. Bengaluru"
                  error={formErrors.city}
                  required
                />
                <Input
                  label="State"
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                  placeholder="e.g. Karnataka"
                  error={formErrors.state}
                  required
                />
                <Input
                  label="Pincode"
                  type="text"
                  maxLength={6}
                  value={address.pincode}
                  onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value }))}
                  placeholder="e.g. 560001"
                  error={formErrors.pincode}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-extrabold">2</span>
              Payment Method
            </h2>

            {/* Selector Options */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer
                  ${paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
              >
                <span className="text-2xl">💵</span>
                <span className="text-xs font-bold block">Cash on Delivery</span>
              </button>

              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer
                  ${paymentMethod === 'upi'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
              >
                <span className="text-2xl">📱</span>
                <span className="text-xs font-bold block">UPI Payment</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer
                  ${paymentMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
              >
                <span className="text-2xl">💳</span>
                <span className="text-xs font-bold block">Credit / Debit Card</span>
              </button>
            </div>

            {/* Option Forms */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-600 leading-relaxed">
                💵 <b>Cash/Card on Delivery:</b> Pay via cash, UPI, or card when your delivery executive arrives. No prepayment needed!
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-4 p-4 border border-gray-100 rounded-xl">
                <Input
                  label="UPI Address"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@upi / username@okhdfc"
                  error={formErrors.upi}
                  required
                />
                <p className="text-[11px] text-gray-400">
                  💡 A notification request will be sent to your UPI app. Approve it to finalize payment.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 border border-gray-100 rounded-xl">
                <Input
                  label="Card Number"
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                    setCardNumber(val);
                  }}
                  placeholder="4111 2222 3333 4444"
                  error={formErrors.card}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) {
                        val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                      }
                      setCardExpiry(val);
                    }}
                    placeholder="MM/YY"
                    error={formErrors.expiry}
                    required
                  />
                  <Input
                    label="CVV"
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    error={formErrors.cvv}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sticky summary & Actions */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 lg:sticky lg:top-24">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            {/* Small list preview */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center gap-3 text-sm text-gray-600">
                  <span className="truncate flex-1">
                    {item.product.name} <b className="text-gray-900 font-bold ml-1">x{item.quantity}</b>
                  </span>
                  <span className="font-semibold text-gray-950 flex-shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total calculation */}
            <div className="border-t border-dashed border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Basket Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (GST)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-900 font-extrabold pt-2 border-t border-gray-50">
                <span>To Pay</span>
                <span className="text-base text-emerald-600">₹{total}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              className="py-3 shadow-md shadow-emerald-500/10"
            >
              Place Order • ₹{total}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
