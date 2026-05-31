interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const btnClass =
    size === 'sm'
      ? 'w-7 h-7 text-sm'
      : 'w-9 h-9 text-base';

  return (
    <div className="flex items-center gap-2">
      <button
        id="quantity-decrease"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`${btnClass} rounded-lg border-2 border-emerald-500 text-emerald-600 flex items-center justify-center
          font-bold transition-all duration-150 hover:bg-emerald-50 active:scale-90
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        −
      </button>
      <span className={`${size === 'sm' ? 'w-5 text-sm' : 'w-7 text-base'} text-center font-semibold text-gray-800`}>
        {quantity}
      </span>
      <button
        id="quantity-increase"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`${btnClass} rounded-lg bg-emerald-500 text-white flex items-center justify-center
          font-bold transition-all duration-150 hover:bg-emerald-600 active:scale-90
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        +
      </button>
    </div>
  );
}
