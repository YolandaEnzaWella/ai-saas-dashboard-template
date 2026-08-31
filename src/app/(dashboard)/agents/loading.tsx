import { Skeleton } from "@/components/ui/skeleton";

export default function AgentsLoading() {
  return (
    <>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-80" />
      <Skeleton className="mt-6 h-16 w-full" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </>
  );
}
