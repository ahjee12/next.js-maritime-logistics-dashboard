"use client"

import { ArrowLeft, BarChart3, Ship, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"
import { VESSEL_MONTHLY_DATA } from "@/lib/mock-data"

const DATA = VESSEL_MONTHLY_DATA

const LATEST          = DATA[DATA.length - 1]
const TOTAL_RETIRED   = DATA.reduce((s, d) => s + d.retired,     0)
const TOTAL_MAINT     = DATA.reduce((s, d) => s + d.maintenance, 0)
const TOTAL_USED      = DATA.reduce((s, d) => s + d.usedPurchase,0)
const TOTAL_NEW       = DATA.reduce((s, d) => s + d.newPurchase, 0)

const FLEET_COLORS = {
  active:      "#60a5fa",
  maintenance: "#fbbf24",
  retired:     "#f87171",
  usedPurchase:"#a78bfa",
  newPurchase: "#4ade80",
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs space-y-1 min-w-[170px]">
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

export function VesselStatsContent({ onBack }: Props) {
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
              Vessel Fleet Statistics
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Monthly fleet status · Last 12 months (Jun 2025 – May 2026)
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "Active (Current)",     value: LATEST.active,     color: "text-status-transit",  sub: "vessels in service" },
              { label: "Under Maintenance",    value: LATEST.maintenance, color: "text-status-pending",  sub: "currently" },
              { label: "Retired (12M)",        value: TOTAL_RETIRED,      color: "text-destructive",     sub: "Disposed" },
              { label: "Used Purchase (12M)",  value: TOTAL_USED,         color: "text-violet-500",      sub: "Used Vessel Acquired" },
              { label: "New Purchase (12M)",   value: TOTAL_NEW,          color: "text-status-approved", sub: "New Vessel Acquired" },
            ].map(({ label, value, color, sub }) => (
              <Card key={label} className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className={`text-2xl font-semibold tracking-tight ${color}`}>{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Area chart — active vessels trend */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Ship className="h-4 w-4 text-accent" />
                Active Vessels Trend
              </CardTitle>
              <CardDescription>Monthly active vessel count over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="active" name="Active Vessels"
                    stroke="#60a5fa" strokeWidth={2.5} fill="url(#gradActive)"
                    dot={{ r: 3, fill: "#60a5fa" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar chart — fleet changes */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                Fleet Changes by Month
              </CardTitle>
              <CardDescription>
                Maintenance · Retired · Used Purchase · New Purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Bar dataKey="maintenance"  name="Maintenance"    fill={FLEET_COLORS.maintenance}  radius={[3,3,0,0]} />
                  <Bar dataKey="retired"      name="Retired"  fill={FLEET_COLORS.retired}      radius={[3,3,0,0]} />
                  <Bar dataKey="usedPurchase" name="Used Purchase" fill={FLEET_COLORS.usedPurchase} radius={[3,3,0,0]} />
                  <Bar dataKey="newPurchase"  name="New Purchase"  fill={FLEET_COLORS.newPurchase}  radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
