import { Skeleton, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border">
        <SkeletonTable rows={8} cols={5} />
      </div>
    </>
  );
}
