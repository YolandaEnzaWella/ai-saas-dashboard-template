import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 flex h-[calc(100vh-12rem)] gap-0 overflow-hidden rounded-lg border border-border">
        <div className="hidden w-72 shrink-0 space-y-3 border-r border-border p-3 md:block">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="flex-1 space-y-6 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className={i % 2 ? "ml-auto h-20 w-2/3" : "h-24 w-3/4"} />
          ))}
        </div>
      </div>
    </>
  );
}
