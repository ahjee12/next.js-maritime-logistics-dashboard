"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  addYears,
  isSameMonth,
  isSameDay,
  isToday,
  setMonth,
  setYear,
} from "date-fns"
import {
  Ship,
  Anchor,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Navigation,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  MOCK_VESSELS,
  MOCK_SCHEDULE_EVENTS,
  MOCK_BOOKINGS,
  type Vessel,
  type VesselStatus,
  type ScheduleEvent,
} from "@/lib/mock-data"

// ── Types ──────────────────────────────────────────────────────────────────

type CalendarEvent =
  | { kind: "vessel-arrival";   id: string; time: string; vesselName: string; port: string; status: ScheduleEvent["status"]; vesselId: string }
  | { kind: "vessel-departure"; id: string; time: string; vesselName: string; port: string; status: ScheduleEvent["status"]; vesselId: string }
  | { kind: "booking-etd";      id: string; bookingNo: string; vesselName: string; polName: string; podName: string }
  | { kind: "booking-eta";      id: string; bookingNo: string; vesselName: string; polName: string; podName: string }

// ── Config ─────────────────────────────────────────────────────────────────

const vesselStatusConfig: Record<VesselStatus, { label: string; color: string; bgColor: string }> = {
  "at-sea":      { label: "At Sea",      color: "text-status-transit",  bgColor: "bg-status-transit/10"  },
  "at-port":     { label: "At Port",     color: "text-status-approved", bgColor: "bg-status-approved/10" },
  "arriving":    { label: "Arriving",    color: "text-status-pending",  bgColor: "bg-status-pending/10"  },
  "departing":   { label: "Departing",   color: "text-status-transit",  bgColor: "bg-status-transit/10"  },
  "maintenance": { label: "Maintenance", color: "text-status-delayed",  bgColor: "bg-status-delayed/10"  },
}

const eventStatusConfig: Record<ScheduleEvent["status"], { label: string; icon: typeof CheckCircle2; color: string }> = {
  "on-time":   { label: "On Time",   icon: CheckCircle2, color: "text-status-approved"  },
  "delayed":   { label: "Delayed",   icon: AlertCircle,  color: "text-status-delayed"   },
  "completed": { label: "Completed", icon: CheckCircle2, color: "text-muted-foreground" },
  "cancelled": { label: "Cancelled", icon: XCircle,      color: "text-status-delayed"   },
}

const EVENT_STYLES = {
  "vessel-arrival":   { bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  "vessel-departure": { bg: "bg-blue-500/15",    text: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500"    },
  "booking-etd":      { bg: "bg-amber-500/15",   text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500"   },
  "booking-eta":      { bg: "bg-violet-500/15",  text: "text-violet-700 dark:text-violet-400",   dot: "bg-violet-500"  },
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS   = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// ── Helpers ────────────────────────────────────────────────────────────────

function eventLabel(event: CalendarEvent): string {
  switch (event.kind) {
    case "vessel-arrival":   return `↓ ${event.vesselName.split(" ")[0]}`
    case "vessel-departure": return `↑ ${event.vesselName.split(" ")[0]}`
    case "booking-etd":      return `ETD ${event.bookingNo.slice(-4)}`
    case "booking-eta":      return `ETA ${event.bookingNo.slice(-4)}`
  }
}

// ── MonthPicker ────────────────────────────────────────────────────────────

function MonthPicker({
  value,
  onChange,
}: {
  value: Date
  onChange: (date: Date) => void
}) {
  const [pickerYear, setPickerYear] = useState(value.getFullYear())
  const currentMonthIdx = value.getMonth()
  const currentYear     = value.getFullYear()

  const select = (monthIdx: number) => {
    onChange(setYear(setMonth(value, monthIdx), pickerYear))
  }

  return (
    <div className="w-56 select-none">
      {/* Year navigation */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setPickerYear((y) => y - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">{pickerYear}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setPickerYear((y) => y + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-3 gap-1">
        {MONTHS.map((label, idx) => {
          const isActive = idx === currentMonthIdx && pickerYear === currentYear
          return (
            <button
              key={label}
              onClick={() => select(idx)}
              className={cn(
                "rounded-md py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function EventChip({ event, onClick }: { event: CalendarEvent; onClick?: () => void }) {
  const style = EVENT_STYLES[event.kind]
  return (
    <div
      onClick={onClick}
      className={cn(
        "text-[10px] px-1 py-0.5 rounded truncate leading-tight",
        style.bg, style.text,
        onClick && "cursor-pointer hover:opacity-80"
      )}
    >
      {eventLabel(event)}
    </div>
  )
}

function EventDetailRow({ event, onVesselClick }: { event: CalendarEvent; onVesselClick: (vesselId: string) => void }) {
  const style = EVENT_STYLES[event.kind]

  if (event.kind === "vessel-arrival" || event.kind === "vessel-departure") {
    const StatusIcon = eventStatusConfig[event.status].icon
    return (
      <div
        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onVesselClick(event.vesselId)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{event.vesselName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {event.kind === "vessel-arrival" ? <ArrowDownToLine className="h-3 w-3" /> : <ArrowUpFromLine className="h-3 w-3" />}
              {event.kind === "vessel-arrival" ? "Arrival" : "Departure"} · {event.port} · {event.time}
            </p>
          </div>
        </div>
        <StatusIcon className={cn("h-4 w-4 shrink-0", eventStatusConfig[event.status].color)} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
      <div className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{event.bookingNo}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Package className="h-3 w-3 shrink-0" />
          {event.vesselName} · {event.polName} → {event.podName}
        </p>
      </div>
      <Badge variant="outline" className={cn("text-[10px] shrink-0", style.bg, style.text)}>
        {event.kind === "booking-etd" ? "ETD" : "ETA"}
      </Badge>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export function VesselScheduleContent() {
  // Default to Feb 2024 where the mock data lives
  const [currentMonth, setCurrentMonth] = useState(new Date("2024-02-01"))
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  // Calendar grid (Sun–Sat, padding prev/next month days)
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Merge vessel schedule events + booking ETD/ETA into unified events
  const allEvents = useMemo<{ date: Date; event: CalendarEvent }[]>(() => {
    const result: { date: Date; event: CalendarEvent }[] = []

    MOCK_SCHEDULE_EVENTS.forEach((e) => {
      result.push({
        date: new Date(e.scheduledTime),
        event: {
          kind: e.type === "arrival" ? "vessel-arrival" : "vessel-departure",
          id: e.id,
          time: format(new Date(e.scheduledTime), "HH:mm"),
          vesselName: e.vesselName,
          port: e.port,
          status: e.status,
          vesselId: e.vesselId,
        },
      })
    })

    MOCK_BOOKINGS.forEach((b) => {
      result.push({
        date: new Date(b.etd),
        event: { kind: "booking-etd", id: `etd-${b.id}`, bookingNo: b.bookingNo, vesselName: b.vesselName, polName: b.polName, podName: b.podName },
      })
      result.push({
        date: new Date(b.eta),
        event: { kind: "booking-eta", id: `eta-${b.id}`, bookingNo: b.bookingNo, vesselName: b.vesselName, polName: b.polName, podName: b.podName },
      })
    })

    return result
  }, [])

  const getEventsForDay = (date: Date) =>
    allEvents.filter((e) => isSameDay(e.date, date)).map((e) => e.event)

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  const handleVesselClick = (vesselId: string) => {
    const vessel = MOCK_VESSELS.find((v) => v.id === vesselId)
    if (vessel) { setSelectedVessel(vessel); setDrawerOpen(true) }
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay((prev) => (prev && isSameDay(prev, day) ? null : day))
  }

  const vesselStats = {
    atSea:        MOCK_VESSELS.filter((v) => v.status === "at-sea").length,
    atPort:       MOCK_VESSELS.filter((v) => ["at-port", "arriving", "departing"].includes(v.status)).length,
    maintenance:  MOCK_VESSELS.filter((v) => v.status === "maintenance").length,
    avgUtil:      Math.round(MOCK_VESSELS.reduce((a, v) => a + v.utilization, 0) / MOCK_VESSELS.length),
  }

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1600px] mx-auto">
        <div className="space-y-4 sm:space-y-6">

          {/* Page Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Vessel Schedule</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Track vessel movements and port schedules</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Navigation, label: "At Sea",         value: vesselStats.atSea,    color: "text-status-transit",  bg: "bg-status-transit/10"  },
              { icon: Anchor,     label: "At Port",        value: vesselStats.atPort,   color: "text-status-approved", bg: "bg-status-approved/10" },
              { icon: AlertCircle,label: "Maintenance",    value: vesselStats.maintenance, color: "text-status-delayed", bg: "bg-status-delayed/10" },
              { icon: Ship,       label: "Avg Utilization",value: `${vesselStats.avgUtil}%`, color: "text-primary",    bg: "bg-primary/10"         },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <Card key={label} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", bg)}>
                      <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="schedule" className="data-[state=active]:bg-background">Schedule</TabsTrigger>
              <TabsTrigger value="fleet"    className="data-[state=active]:bg-background">Fleet</TabsTrigger>
            </TabsList>

            {/* ── Schedule Tab: Monthly Calendar ── */}
            <TabsContent value="schedule" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3 px-4 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    {/* Clickable month/year title → opens picker */}
                    <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-1.5 rounded-md px-2 py-1 -ml-2 hover:bg-muted transition-colors">
                          <span className="text-base font-semibold text-foreground">
                            {format(currentMonth, "MMMM yyyy")}
                          </span>
                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", pickerOpen && "rotate-180")} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-3">
                        <MonthPicker
                          value={currentMonth}
                          onChange={(date) => {
                            setCurrentMonth(date)
                            setSelectedDay(null)
                            setPickerOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setCurrentMonth(new Date("2024-02-01")); setSelectedDay(null) }}>
                        Today
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setCurrentMonth(addMonths(currentMonth, -1)); setSelectedDay(null) }}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setCurrentMonth(addMonths(currentMonth, 1)); setSelectedDay(null) }}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 mb-1">
                    {WEEKDAYS.map((d) => (
                      <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-2">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                    {calendarDays.map((day) => {
                      const events      = getEventsForDay(day)
                      const inMonth     = isSameMonth(day, currentMonth)
                      const today       = isToday(day)
                      const isSelected  = selectedDay ? isSameDay(day, selectedDay) : false
                      const visible     = events.slice(0, 2)
                      const overflow    = events.length - 2

                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => handleDayClick(day)}
                          className={cn(
                            "bg-card min-h-[80px] sm:min-h-[100px] p-1.5 cursor-pointer transition-colors hover:bg-muted/40",
                            !inMonth && "opacity-40",
                            isSelected && "bg-accent/8 ring-inset ring-1 ring-accent",
                          )}
                        >
                          {/* Date number */}
                          <div className="flex justify-end mb-1">
                            <span className={cn(
                              "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                              today       ? "bg-accent text-accent-foreground"        : "text-foreground",
                              isSelected && !today && "bg-accent/20 text-accent",
                            )}>
                              {format(day, "d")}
                            </span>
                          </div>

                          {/* Event chips */}
                          <div className="space-y-0.5">
                            {visible.map((event) => (
                              <EventChip key={event.id} event={event} />
                            ))}
                            {overflow > 0 && (
                              <div className="text-[10px] text-muted-foreground pl-1">+{overflow} more</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-border">
                    {(["vessel-arrival", "vessel-departure", "booking-etd", "booking-eta"] as const).map((kind) => (
                      <div key={kind} className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", EVENT_STYLES[kind].dot)} />
                        <span className="text-[11px] text-muted-foreground">
                          {kind === "vessel-arrival" ? "Vessel Arrival" : kind === "vessel-departure" ? "Vessel Departure" : kind === "booking-etd" ? "Booking ETD" : "Booking ETA"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selected day detail */}
              {selectedDay && (
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3 px-4 pt-4">
                    <CardTitle className="text-sm font-medium">
                      {format(selectedDay, "EEEE, MMMM d, yyyy")}
                      <span className="ml-2 text-muted-foreground font-normal">
                        {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? "s" : ""}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    {selectedDayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No events on this day</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDayEvents.map((event) => (
                          <EventDetailRow
                            key={event.id}
                            event={event}
                            onVesselClick={handleVesselClick}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ── Fleet Tab (unchanged) ── */}
            <TabsContent value="fleet" className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Card className="bg-card border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          {["Vessel", "Status", "Location", "Next Port", "ETA", "Utilization"].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {MOCK_VESSELS.map((vessel) => {
                          const cfg = vesselStatusConfig[vessel.status]
                          return (
                            <tr key={vessel.id} className="hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setSelectedVessel(vessel); setDrawerOpen(true) }}>
                              <td className="px-4 py-3">
                                <p className="font-medium text-sm text-foreground">{vessel.name}</p>
                                <p className="text-xs text-muted-foreground">{vessel.imo}</p>
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary" className={cn("font-medium", cfg.bgColor, cfg.color)}>{cfg.label}</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground">{vessel.currentPort || "En Route"}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{vessel.nextPort}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{format(new Date(vessel.eta), "MMM d, yyyy")}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Progress value={vessel.utilization} className="h-2 w-20" />
                                  <span className="text-xs text-muted-foreground w-8">{vessel.utilization}%</span>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {MOCK_VESSELS.map((vessel) => {
                  const cfg = vesselStatusConfig[vessel.status]
                  return (
                    <Card key={vessel.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => { setSelectedVessel(vessel); setDrawerOpen(true) }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-medium text-foreground">{vessel.name}</p>
                            <p className="text-xs text-muted-foreground">{vessel.imo}</p>
                          </div>
                          <Badge variant="secondary" className={cn("font-medium shrink-0", cfg.bgColor, cfg.color)}>{cfg.label}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><p className="text-xs text-muted-foreground mb-0.5">Location</p><p className="font-medium">{vessel.currentPort || "En Route"}</p></div>
                          <div><p className="text-xs text-muted-foreground mb-0.5">Next Port</p><p className="font-medium">{vessel.nextPort}</p></div>
                          <div><p className="text-xs text-muted-foreground mb-0.5">ETA</p><p className="font-medium">{format(new Date(vessel.eta), "MMM d")}</p></div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Utilization</p>
                            <div className="flex items-center gap-2"><Progress value={vessel.utilization} className="h-2 flex-1" /><span className="text-xs font-medium">{vessel.utilization}%</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Vessel Detail Sheet */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Ship className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg">{selectedVessel?.name}</span>
                <p className="text-xs text-muted-foreground font-normal">{selectedVessel?.imo}</p>
              </div>
            </SheetTitle>
            <SheetDescription className="sr-only">Detailed vessel information</SheetDescription>
          </SheetHeader>

          {selectedVessel && (
            <div className="py-4 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary" className={cn("font-medium", vesselStatusConfig[selectedVessel.status].bgColor, vesselStatusConfig[selectedVessel.status].color)}>
                  {vesselStatusConfig[selectedVessel.status].label}
                </Badge>
              </div>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Vessel Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Flag</span><span className="font-medium">{selectedVessel.flag}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Capacity</span><span className="font-medium">{selectedVessel.capacity}</span></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <div className="flex items-center gap-2"><Progress value={selectedVessel.utilization} className="h-2 w-16" /><span className="font-medium">{selectedVessel.utilization}%</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Current Location</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {selectedVessel.currentPort && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current Port</span><span className="font-medium">{selectedVessel.currentPort}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Next Port</span><span className="font-medium">{selectedVessel.nextPort}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">ETA</span><span className="font-medium">{format(new Date(selectedVessel.eta), "MMM d, yyyy")}</span></div>
                  {selectedVessel.etd && <div className="flex justify-between text-sm"><span className="text-muted-foreground">ETD</span><span className="font-medium">{format(new Date(selectedVessel.etd), "MMM d, yyyy")}</span></div>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Route</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedVessel.route.map((port, i) => (
                      <div key={port} className="flex items-center gap-2">
                        <span className={cn("text-sm px-2 py-1 rounded",
                          selectedVessel.currentPort === port ? "bg-accent/10 text-accent font-medium"
                          : selectedVessel.nextPort === port  ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                        )}>{port}</span>
                        {i < selectedVessel.route.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
