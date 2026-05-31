import { useToastStore } from '../../stores/useToastStore';
import type { ToastMessage } from '../../types';

function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useToastStore((s) => s.removeToast);

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg
        ${colors[toast.type]} animate-slide-up min-w-[240px] max-w-xs`}
      role="alert"
    >
      <span className="text-base font-bold">{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="opacity-70 hover:opacity-100 text-lg leading-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center md:bottom-6 md:right-6 md:left-auto md:translate-x-0 md:items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
