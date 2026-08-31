import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-80" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 lg:col-span-2" />
        <Skeleton className="h-72" />
      </div>
    </>
  );
}
