"use client";
const Skeleton = ({ className }) => (
  <div className={`relative overflow-hidden rounded-xl bg-slate-800/80 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent animate-shimmer" />
  </div>
);

export default function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
      <Skeleton className="lg:col-span-2 h-96" />
      <Skeleton className="lg:row-span-2 h-[500px]" />
      <Skeleton className="lg:col-span-2 h-96" />
    </div>
  );
}