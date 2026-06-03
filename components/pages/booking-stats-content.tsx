"use client"

import { useState } from "react"
import { ArrowLeft, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import {
  BOOKING_5YEAR_DATA,
  BOOKING_WEEKLY_DATA,
  BOOKING_DAILY_DATA,
} from "@/lib/mock-data"

const FIVE_YEAR_DATA = BOOKING_5YEAR_DATA
const WEEKLY_DATA    = BOOKING_WEEKLY_DATA
const DAILY_DATA     = BOOKING_DAILY_DATA

// ── Period config ──────────────────────────────────────────────────────────

type Period = "1W" | "1M" | "6M" | "12M" | "1Y" | "2Y" | "3Y" | "4Y" | "5Y"

const SHORT_PERIODS: { label: string; value: Period }[] = [
  { label: "1W",  value: "1W"  },
  { label: "1M",  value: "1M"  },
  { label: "6M",  value: "6M"  },
  { label: "12M", value: "12M" },
]

const YEAR_PERIODS: { label: string; value: Period }[] = [
  { label: "1Y", value: "1Y" },
  { label: "2Y", value: "2Y" },
  { label: "3Y", value: "3Y" },
  { label: "4Y", value: "4Y" },
  { label: "5Y", value: "5Y" },
]

function getChartData(period: Period) {
  switch (period) {
    case "1W":  return DAILY_DATA
    case "1M":  return WEEKLY_DATA
    case "6M":  return FIVE_YEAR_DATA.slice(-6)
    case "12M": return FIVE_YEAR_DATA.slice(-12)
    case "1Y":  return FIVE_YEAR_DATA.slice(-12)
    case "2Y":  return FIVE_YEAR_DATA.slice(-24)
    case "3Y":  return FIVE_YEAR_DATA.slice(-36)
    case "4Y":  return FIVE_YEAR_DATA.slice(-48)
    case "5Y":  return FIVE_YEAR_DATA
  }
}

function getPeriodLabel(period: Period) {
  const map: Record<Period, string> = {
    "1W": "Last 7 Days", "1M": "Last Month", "6M": "Last 6 Months",
    "12M": "Last 12 Months", "1Y": "Last 1 Year", "2Y": "Last 2 Years",
    "3Y": "Last 3 Years", "4Y": "Last 4 Years", "5Y": "Last 5 Years",
  }
  return map[period]
}

// ── Tooltip ────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs space-y-1 min-w-[140px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground capitalize">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Period Button ──────────────────────────────────────────────────────────

function PeriodBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active
          ? "bg-accent text-accent-foreground"
          : "bg-muted text-muted-foreground hover:bg-[rgb(95,192,195)] hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

interface Props { onBack: () => void }

export function BookingStatsContent({ onBack }: Props) {
  const [period, setPeriod] = useState<Period>("12M")

  const chartData  = getChartData(period)
  const total      = chartData.reduce((s, d) => s + d.total, 0)
  const avg        = Math.round(total / chartData.length)
  const best       = chartData.reduce((a, b) => (a.total > b.total ? a : b))
  const first      = chartData[0].total
  const last       = chartData[chartData.length - 1].total
  const growth     = (((last - first) / first) * 100).toFixed(1)
  const isPositive = last >= first

  return (
    <div className="flex min-h-screen">
      {/* Back button */}
      <div className="flex items-center justify-center w-12 sm:w-14 shrink-0 sticky top-0 self-start h-screen">
        <Button variant="ghost" onClick={onBack}
          className="h-[108px] w-9 hover:bg-[rgb(95,192,195)] hover:text-white px-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 px-2 sm:px-4 py-4 sm:py-6 max-w-[1560px]">
        <div className="space-y-4 sm:space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Booking Statistics
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {getPeriodLabel(period)}
              </p>
            </div>

            {/* Period selectors */}
            <div className="flex flex-col gap-2 items-start sm:items-end">
              {/* Short period buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {SHORT_PERIODS.map(({ label, value }) => (
                  <PeriodBtn key={value} label={label} active={period === value}
                    onClick={() => setPeriod(value)} />
                ))}
              </div>
              {/* Year buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {YEAR_PERIODS.map(({ label, value }) => (
                  <PeriodBtn key={value} label={label} active={period === value}
                    onClick={() => setPeriod(value)} />
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Total",       value: total.toLocaleString(), sub: "bookings" },
              { label: "Average",     value: avg.toLocaleString(),   sub: "per period" },
              { label: "Best Period", value: best.total.toLocaleString(), sub: best.month },
              {
                label: "Change",
                value: `${isPositive ? "+" : ""}${growth}%`,
                sub: `${chartData[0].month} → ${chartData[chartData.length - 1].month}`,
                positive: isPositive,
              },
            ].map(({ label, value, sub, positive }) => (
              <Card key={label} className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className={`text-2xl font-semibold tracking-tight ${
                    positive === true ? "text-status-approved" :
                    positive === false ? "text-destructive" : "text-foreground"
                  }`}>{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Area Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Total Bookings Trend
              </CardTitle>
              <CardDescription>{getPeriodLabel(period)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" name="Total"
                    stroke="#60a5fa" strokeWidth={2.5} fill="url(#gradTotal)"
                    dot={chartData.length <= 14 ? { r: 3, fill: "#60a5fa" } : false}
                    activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                Status Breakdown
              </CardTitle>
              <CardDescription>Approved · In Transit · Delayed · Pending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  barSize={chartData.length > 24 ? 6 : 14}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Bar dataKey="approved"  name="Approved"   fill="#4ade80" radius={[3,3,0,0]} />
                  <Bar dataKey="inTransit" name="In Transit" fill="#60a5fa" radius={[3,3,0,0]} />
                  <Bar dataKey="delayed"   name="Delayed"    fill="#f87171" radius={[3,3,0,0]} />
                  <Bar dataKey="pending"   name="Pending"    fill="#fbbf24" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
