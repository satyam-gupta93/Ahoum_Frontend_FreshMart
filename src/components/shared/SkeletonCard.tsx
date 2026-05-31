interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-xl ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-card">
      <Skeleton className="aspect-square w-full mb-2.5" />
      <Skeleton className="h-3 w-1/2 mb-1.5" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/3 mb-2" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  );
}

export function CategoryChipSkeleton() {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-white shadow-card">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <Skeleton className="h-40 w-full rounded-2xl" />
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex gap-3 bg-white rounded-2xl p-3 shadow-card">
      <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-1.5" />
        <Skeleton className="h-3 w-1/4 mb-3" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
