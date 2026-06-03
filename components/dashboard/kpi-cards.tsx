"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, Ship, Package } from "lucide-react"
import { BOOKINGS_BREAKDOWN } from "@/lib/mock-data"

// ── Standard KPI Card ──────────────────────────────────────────────────────

interface KPICardProps {
  title: string
  value: string | number
  trend?: { value: number; isPositive: boolean }
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
                {trend.isPositive
                  ? <TrendingUp   className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-status-approved" />
                  : <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-destructive" />}
                <span className={`text-[10px] sm:text-xs font-medium ${trend.isPositive ? "text-status-approved" : "text-destructive"}`}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                  <span className="hidden sm:inline"> vs last week</span>
                </span>
              </div>
            )}
          </div>
          <div className="p-2 sm:p-2.5 rounded-lg bg-secondary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Breakdown KPI Card (4 periods) ─────────────────────────────────────────

interface KPIBreakdownCardProps {
  title: string
  icon: React.ReactNode
  breakdown: { last12Months: number; thisMonth: number; thisWeek: number; today: number }
}

function KPIBreakdownCard({ title, icon, breakdown }: KPIBreakdownCardProps) {
  const items = [
    { label: "12 Months", value: breakdown.last12Months },
    { label: "This Month", value: breakdown.thisMonth },
    { label: "This Week",  value: breakdown.thisWeek  },
    { label: "Today",      value: breakdown.today     },
  ]
  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</span>
          <div className="p-2 rounded-lg bg-secondary">{icon}</div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {items.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-lg font-semibold text-card-foreground tracking-tight">
                {value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── KPICards (exported) ────────────────────────────────────────────────────

interface KPICardsProps {
  onTotalBookingsClick?: () => void
  onDelayedCargoClick?:  () => void
  onActiveVesselsClick?: () => void
}

export function KPICards({ onTotalBookingsClick, onDelayedCargoClick, onActiveVesselsClick }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Total Bookings — today's count */}
      <div onClick={onTotalBookingsClick} className={onTotalBookingsClick ? "cursor-pointer" : ""}>
        <KPICard
          title="Total Bookings"
          value={BOOKINGS_BREAKDOWN.today}
          trend={{ value: 12.5, isPositive: true }}
          icon={<Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        />
      </div>

      {/* Delayed Cargo — single current value */}
      <div onClick={onDelayedCargoClick} className={onDelayedCargoClick ? "cursor-pointer" : ""}>
        <KPICard
          title="Delayed Cargo"
          value="23"
          trend={{ value: 8.2, isPositive: false }}
          icon={<AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />}
          alert
        />
      </div>

      {/* Active Vessels */}
      <div onClick={onActiveVesselsClick} className={onActiveVesselsClick ? "cursor-pointer" : ""}>
        <KPICard
          title="Active Vessels"
          value="156"
          trend={{ value: 3.1, isPositive: true }}
          icon={<Ship className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />}
        />
      </div>
    </div>
  )
}
