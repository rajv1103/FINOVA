"use client"

import { Skeleton } from "@shadcn/ui"

export function SkeletonDemo() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full rounded" />
    </div>
  )
}
