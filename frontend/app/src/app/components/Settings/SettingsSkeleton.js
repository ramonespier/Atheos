// components/Settings/SettingsSkeleton.js
const Skeleton = ({ className }) => <div className={`bg-slate-800/80 animate-pulse rounded-lg ${className}`} />;

export default function SettingsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </header>
      <div className="flex border-b border-slate-700/80 mb-8">
        <Skeleton className="w-24 h-12 mr-2" />
        <Skeleton className="w-24 h-12 mr-2" />
        <Skeleton className="w-24 h-12" />
      </div>
      <div>
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}