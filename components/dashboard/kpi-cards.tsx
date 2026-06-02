"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, Ship, Package } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  alert?: boolean
}

function KPICard({ title, value, trend, icon, alert }: KPICardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
              {title}
              {alert && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              )}
            </span>
            <span className="text-2xl sm:text-3xl font-semibold text-card-foreground tracking-tight">
              {value}
            </span>
            {trend && (
              <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-status-approved" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-destructive" />
                )}
                <span
                  className={`text-[10px] sm:text-xs font-medium ${
                    trend.isPositive ? "text-status-approved" : "text-destructive"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                  <span className="hidden sm:inline"> vs last week</span>
                </span>
              </div>
            )}
          </div>
          <div className="p-2 sm:p-2.5 rounded-lg bg-secondary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <KPICard
        title="Total Bookings"
        value="2,847"
        trend={{ value: 12.5, isPositive: true }}
        icon={<Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
      />
      <KPICard
        title="Delayed Cargo"
        value="23"
        trend={{ value: 8.2, isPositive: false }}
        icon={<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />}
        alert
      />
      <KPICard
        title="Active Vessels"
        value="156"
        trend={{ value: 3.1, isPositive: true }}
        icon={<Ship className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />}
      />
    </div>
  )
}
