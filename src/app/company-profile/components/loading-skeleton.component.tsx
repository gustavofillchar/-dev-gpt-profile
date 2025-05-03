"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="my-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16" data-testid="skeleton" />
          <Skeleton className="h-4 w-4" data-testid="skeleton" />
          <Skeleton className="h-4 w-32" data-testid="skeleton" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Card
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
            data-slot="card"
            data-testid="card"
          >
            <CardHeader>
              <Skeleton className="h-8 w-48" data-testid="skeleton" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" data-testid="skeleton" />
                <Skeleton className="h-10 w-full" data-testid="skeleton" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" data-testid="skeleton" />
                <Skeleton className="h-32 w-full" data-testid="skeleton" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" data-testid="skeleton" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-32" data-testid="skeleton" />
                  <Skeleton className="h-8 w-40" data-testid="skeleton" />
                  <Skeleton className="h-8 w-36" data-testid="skeleton" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" data-testid="skeleton" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-28" data-testid="skeleton" />
                  <Skeleton className="h-8 w-36" data-testid="skeleton" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" data-testid="skeleton" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" data-testid="skeleton" />
                  <Skeleton className="h-8 w-32" data-testid="skeleton" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" data-testid="skeleton" />
                  <Skeleton className="h-10 w-full" data-testid="skeleton" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" data-testid="skeleton" />
                  <Skeleton className="h-10 w-full" data-testid="skeleton" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" data-testid="skeleton" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Skeleton className="w-full h-full rounded-lg" data-testid="skeleton" />
        </div>
      </div>
    </div>
  );
}