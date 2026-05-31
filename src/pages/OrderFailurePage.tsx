import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../stores/useOrderStore';
import { Button } from '../components/ui/Button';

export function OrderFailurePage() {
  const navigate = useNavigate();
  const { error, resetOrder } = useOrderStore();

  const handleRetry = () => {
    resetOrder();
    navigate('/checkout');
  };

  const handleBackToCart = () => {
    resetOrder();
    navigate('/cart');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 md:py-20 text-center pb-24 md:pb-12 animate-fade-in">
      {/* Failure Visual */}
      <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-full mb-6 relative animate-bounce">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Order Failed</h1>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
        {error || 'We could not process your transaction due to a network or payment authorization failure.'}
      </p>

      {/* Suggestion Card */}
      <div className="bg-red-50/30 rounded-2xl border border-red-100/50 p-6 text-left space-y-4 mb-8">
        <h3 className="text-sm font-bold text-red-800">Why did this happen?</h3>
        <ul className="text-xs text-red-700/80 space-y-2 list-disc list-inside">
          <li>Insufficient funds in bank account or wallet.</li>
          <li>Temporary timeout or network issues at the payment gateway.</li>
          <li>Authentication OTP expired or entered incorrectly.</li>
        </ul>
        <p className="text-xs text-red-800 font-medium pt-1">
          💡 Tip: Try choosing <b>Cash on Delivery</b> as your payment method for a guaranteed order checkout!
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleRetry}
          fullWidth
          variant="primary"
          className="py-3 bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          Try Payment Again
        </Button>
        <Button
          onClick={handleBackToCart}
          fullWidth
          variant="outline"
          className="py-3"
        >
          Return to Cart
        </Button>
      </div>
    </div>
  );
}
