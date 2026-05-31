import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';

export function OtpPage() {
  const navigate = useNavigate();
  const { verifyOtp, isLoading, error, clearError } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill('');
    pasted.split('').forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    clearError();
    const code = otp.join('');
    if (code.length < 6) return;
    const ok = await verifyOtp(code);
    if (ok) navigate('/location');
  }

  const filledCount = otp.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 pt-12 pb-16 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full" />
        </div>
        <button onClick={() => navigate(-1)} className="relative mb-4 text-white/80 hover:text-white transition-colors" aria-label="Go back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="relative">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl">📱</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Verify OTP</h1>
          <p className="text-emerald-100 mt-1">Enter the 6-digit code sent to your phone</p>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-slide-up">
          <p className="text-center text-sm text-gray-500 mb-6">
            Code sent to your registered phone number.<br />
            <span className="text-xs text-emerald-600 font-medium">Use 123456 for demo</span>
          </p>

          {/* OTP inputs */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                id={`otp-input-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`OTP digit ${i + 1}`}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
                  focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                  ${digit ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-800'}`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full mb-4">
            <div
              className="h-1 bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${(filledCount / 6) * 100}%` }}
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>
          )}

          <Button
            id="otp-verify"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={filledCount < 6}
            onClick={handleVerify}
            className="rounded-2xl"
          >
            Verify OTP
          </Button>

          <div className="flex items-center justify-center gap-1 mt-6">
            <span className="text-sm text-gray-500">Didn't receive the code?</span>
            <button className="text-emerald-600 font-semibold text-sm hover:underline" id="otp-resend">
              Resend
            </button>
          </div>
        </div>
      </div>
      <div className="h-8" />
    </div>
  );
}
