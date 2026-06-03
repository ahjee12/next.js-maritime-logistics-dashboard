"use client"

import { ArrowLeft, BarChart3, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import { DELAYED_MONTHLY_DATA, TOTAL_DELAYED_12M } from "@/lib/mock-data"

const DATA        = DELAYED_MONTHLY_DATA
const MONTHLY_AVG = Math.round(TOTAL_DELAYED_12M / 12)
const WORST_MONTH = DATA.reduce((a, b) => (a.total > b.total ? a : b))
const BEST_MONTH  = DATA.reduce((a, b) => (a.total < b.total ? a : b))
const FIRST       = DATA[0].total
const LAST        = DATA[DATA.length - 1].total
const GROWTH      = (((LAST - FIRST) / FIRST) * 100).toFixed(1)
const IS_IMPROVING = LAST < FIRST

const REASON_COLORS = {
  weather:       "#60a5fa",
  portCongestion:"#f97316",
  documentation: "#a78bfa",
  customs:       "#fbbf24",
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs space-y-1 min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
          <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

interface Props { onBack: () => void }

export function DelayedCargoStatsContent({ onBack }: Props) {
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
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Delayed Cargo Statistics
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Monthly trend · Last 12 months (Jun 2025 – May 2026)
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Total Delays (12M)", value: TOTAL_DELAYED_12M, sub: "cases" },
              { label: "Monthly Avg",        value: MONTHLY_AVG,       sub: "cases / month" },
              { label: "Worst Month",        value: WORST_MONTH.total, sub: WORST_MONTH.month },
              { label: "Trend",
                value: `${IS_IMPROVING ? "" : "+"}${GROWTH}%`,
                sub: "Jun '25 → May '26",
                improving: IS_IMPROVING },
            ].map(({ label, value, sub, improving }) => (
              <Card key={label} className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <div className="flex items-center gap-1.5">
                    {improving !== undefined && (
                      improving
                        ? <TrendingDown className="h-4 w-4 text-status-approved" />
                        : <TrendingUp   className="h-4 w-4 text-destructive" />
                    )}
                    <p className={`text-2xl font-semibold tracking-tight ${
                      improving === true  ? "text-status-approved" :
                      improving === false ? "text-destructive" : "text-foreground"
                    }`}>{typeof value === "number" ? value.toLocaleString() : value}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Area chart — total trend */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Delayed Cargo Trend
              </CardTitle>
              <CardDescription>Monthly delayed cargo count over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradDelay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" name="Delayed"
                    stroke="#f87171" strokeWidth={2.5} fill="url(#gradDelay)"
                    dot={{ r: 3, fill: "#f87171" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar chart — delay reasons */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                Delay Reasons by Month
              </CardTitle>
              <CardDescription>Weather · Port Congestion · Documentation · Customs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Bar dataKey="weather"        name="Weather"         fill={REASON_COLORS.weather}        radius={[3,3,0,0]} />
                  <Bar dataKey="portCongestion" name="Port Congestion" fill={REASON_COLORS.portCongestion} radius={[3,3,0,0]} />
                  <Bar dataKey="documentation"  name="Documentation"   fill={REASON_COLORS.documentation}  radius={[3,3,0,0]} />
                  <Bar dataKey="customs"        name="Customs"         fill={REASON_COLORS.customs}        radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
