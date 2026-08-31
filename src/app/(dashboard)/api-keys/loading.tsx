import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function ApiKeysLoading() {
  return (
    <>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 rounded-lg border border-border">
        <div className="border-b border-border p-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <SkeletonTable rows={6} cols={6} />
      </div>
    </>
  );
}
