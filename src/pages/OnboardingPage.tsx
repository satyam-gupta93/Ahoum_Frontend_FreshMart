import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const slides = [
  {
    emoji: '🥦',
    title: 'Fresh Groceries Delivered',
    description: 'Get farm-fresh fruits, vegetables and essentials delivered to your doorstep in 30 minutes.',
    bg: 'from-emerald-400 to-teal-500',
    accent: '#10b981',
  },
  {
    emoji: '⚡',
    title: 'Super Fast Delivery',
    description: 'We deliver in 30-45 minutes. Our riders are always ready to bring freshness to you.',
    bg: 'from-orange-400 to-amber-500',
    accent: '#f59e0b',
  },
  {
    emoji: '💸',
    title: 'Best Prices Guaranteed',
    description: 'Get the best deals on fresh produce with exclusive discounts and daily offers.',
    bg: 'from-violet-400 to-purple-500',
    accent: '#8b5cf6',
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  function handleNext() {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      navigate('/login');
    }
  }

  const slide = slides[current];

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${slide.bg} transition-all duration-500`}>
      {/* Skip */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => navigate('/login')}
          className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          id="onboarding-skip"
        >
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="text-center animate-fade-in" key={current}>
          <div className="w-48 h-48 rounded-[40px] bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-9xl">{slide.emoji}</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">{slide.title}</h2>
          <p className="text-white/80 text-base leading-relaxed max-w-xs mx-auto">{slide.description}</p>
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-8 pb-safe">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        <Button
          id="onboarding-next"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl font-bold text-base rounded-2xl"
        >
          {current === slides.length - 1 ? 'Get Started 🚀' : 'Continue'}
        </Button>

        {current === slides.length - 1 && (
          <button
            onClick={() => navigate('/signup')}
            className="w-full mt-3 text-white/80 hover:text-white text-sm font-medium py-2 transition-colors"
            id="onboarding-signup"
          >
            Don't have an account? <span className="underline font-semibold">Sign Up</span>
          </button>
        )}
      </div>
    </div>
  );
}
