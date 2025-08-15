"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Skeleton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
})
Skeleton.displayName = "Skeleton"
