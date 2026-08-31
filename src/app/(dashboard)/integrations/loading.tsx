import { Skeleton } from "@/components/ui/skeleton";

export default function IntegrationsLoading() {
  return (
    <>
      <Skeleton className="h-8 w-44" />
      <Skeleton className="mt-2 h-4 w-80" />
      <Skeleton className="mt-6 h-28 w-full" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </>
  );
}
