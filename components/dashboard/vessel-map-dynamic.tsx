"use client"

import dynamic from "next/dynamic"

export const VesselMapDynamic = dynamic(
  () => import("./vessel-map").then((m) => m.VesselMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] w-full rounded-lg bg-secondary/50 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Loading map...</span>
      </div>
    ),
  }
)
