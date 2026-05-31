import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrderStore } from '../stores/useOrderStore';
import { Button } from '../components/ui/Button';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const { currentOrder, resetOrder } = useOrderStore();

  useEffect(() => {
    // If no active order, redirect to home
    if (!currentOrder) {
      navigate('/');
    }
  }, [currentOrder, navigate]);

  if (!currentOrder) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 md:py-20 text-center pb-24 md:pb-12 animate-fade-in">
      {/* Animated Success Icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full mb-6 relative">
        <span className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping"></span>
        <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
        Your payment was successful and your order has been sent to our delivery partner.
      </p>

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left space-y-4 mb-8">
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">Order ID</span>
          <span className="text-sm font-extrabold text-gray-900">{currentOrder.id}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">Delivery Est.</span>
          <span className="text-sm font-extrabold text-emerald-600">{currentOrder.estimatedDelivery || '30-45 mins'}</span>
        </div>

        <div className="flex justify-between items-start border-b border-gray-50 pb-3 gap-4">
          <span className="text-xs text-gray-400 font-semibold uppercase mt-0.5">Address</span>
          <span className="text-sm text-gray-600 font-medium text-right max-w-[70%]">
            {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.city} - {currentOrder.deliveryAddress.pincode}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">Payment</span>
          <span className="text-sm font-extrabold text-gray-800 uppercase">{currentOrder.paymentMethod}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Amount</span>
          <span className="text-base font-black text-gray-900">₹{currentOrder.total}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => {
            resetOrder();
            navigate('/');
          }}
          fullWidth
          variant="primary"
          className="py-3 shadow-md shadow-emerald-500/10"
        >
          Continue Shopping
        </Button>
        
        <Link to="/profile" onClick={resetOrder} className="w-full">
          <Button
            fullWidth
            variant="outline"
            className="py-3"
          >
            View Order History
          </Button>
        </Link>
      </div>
    </div>
  );
}
