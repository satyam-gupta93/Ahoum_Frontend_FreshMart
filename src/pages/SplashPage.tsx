import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-500 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-white/10 blur-xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-white/10 blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center animate-bounce-in">
        <div className="w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6">
          <span className="text-6xl">🛒</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">FreshMart</h1>
        <p className="text-emerald-100 text-lg mt-2 font-medium">Fresh groceries at your door</p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      {/* Version */}
      <p className="absolute bottom-6 text-emerald-100/60 text-xs">v1.0.0</p>
    </div>
  );
}
