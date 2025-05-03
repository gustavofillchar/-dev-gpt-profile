"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Skeleton className="w-full h-[800px] rounded-lg" />
        </div>
        <div className="md:col-span-2">
          <Skeleton className="w-full h-[800px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}