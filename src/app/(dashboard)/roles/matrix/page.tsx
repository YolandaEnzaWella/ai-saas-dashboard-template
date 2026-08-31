import { Suspense } from "react";
import type { Metadata } from "next";
import { MatrixView } from "./matrix-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Permission matrix" };

export default function MatrixPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <MatrixView />
    </Suspense>
  );
}
