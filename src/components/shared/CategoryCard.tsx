import { useNavigate } from 'react-router-dom';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  compact?: boolean;
}

export function CategoryCard({ category, isSelected = false, compact = false }: CategoryCardProps) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <button
        id={`category-chip-${category.id}`}
        onClick={() => navigate(`/category/${category.id}`)}
        className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-200 active:scale-95
          ${isSelected
            ? 'bg-emerald-500 text-white shadow-md'
            : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover'
          }`}
        aria-label={`Browse ${category.name}`}
        aria-pressed={isSelected}
      >
        <span className="text-2xl">{category.icon}</span>
        <span className="text-xs font-semibold whitespace-nowrap">{category.name}</span>
      </button>
    );
  }

  return (
    <button
      id={`category-card-${category.id}`}
      onClick={() => navigate(`/category/${category.id}`)}
      className="group relative overflow-hidden rounded-2xl aspect-square shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-95"
      style={{ backgroundColor: category.bgColor }}
      aria-label={`Browse ${category.name} — ${category.productCount} products`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 p-3">
        <span className="text-3xl drop-shadow">{category.icon}</span>
        <span className="text-xs font-bold text-gray-800 text-center leading-tight">{category.name}</span>
        <span className="text-xs text-gray-500">{category.productCount} items</span>
      </div>
    </button>
  );
}
