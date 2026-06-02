"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ChevronRight } from "lucide-react"
import type { Booking, BookingStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface BookingsTableProps {
  bookings: Booking[]
  onSelectBooking: (booking: Booking) => void
  selectedBookingId?: string
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  approved: {
    label: "Approved",
    className: "bg-status-approved/15 text-status-approved border-status-approved/30",
  },
  pending: {
    label: "Pending",
    className: "bg-status-pending/15 text-status-pending border-status-pending/30",
  },
  delayed: {
    label: "Delayed",
    className: "bg-status-delayed/15 text-status-delayed border-status-delayed/30",
  },
  "in-transit": {
    label: "In Transit",
    className: "bg-status-transit/15 text-status-transit border-status-transit/30",
  },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Mobile Card Component
function BookingCard({ booking, onSelect, isSelected }: { booking: Booking; onSelect: () => void; isSelected: boolean }) {
  const statusConfig = STATUS_CONFIG[booking.status]

  return (
    <Card 
      className={cn(
        "bg-card border-border transition-all active:scale-[0.98]",
        isSelected && "ring-2 ring-accent"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground text-sm">
              {booking.bookingNo}
            </span>
            <span className="text-xs text-muted-foreground">
              {booking.customer}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn("border font-medium text-[10px] shrink-0", statusConfig.className)}
          >
            {statusConfig.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="font-medium text-foreground">{booking.pol}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium text-foreground">{booking.pod}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Vessel</span>
            <span className="text-xs font-medium text-foreground">{booking.vesselName}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="h-8 gap-1 text-xs"
          >
            Details
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Desktop Table Component
function BookingsDesktopTable({ bookings, onSelectBooking, selectedBookingId }: BookingsTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold text-xs sm:text-sm">Booking No</TableHead>
            <TableHead className="font-semibold text-xs sm:text-sm">Customer</TableHead>
            <TableHead className="font-semibold text-xs sm:text-sm">Vessel / Voyage</TableHead>
            <TableHead className="font-semibold text-xs sm:text-sm">Route</TableHead>
            <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
            <TableHead className="font-semibold text-xs sm:text-sm">ETA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const statusConfig = STATUS_CONFIG[booking.status]
            const isSelected = selectedBookingId === booking.id
            
            return (
              <TableRow
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className={cn(
                  "cursor-pointer transition-colors",
                  isSelected && "bg-accent/10"
                )}
              >
                <TableCell className="font-medium text-foreground text-sm">
                  {booking.bookingNo}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {booking.customer}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-sm">{booking.vesselName}</span>
                    <span className="text-xs text-muted-foreground">{booking.voyageNo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-medium text-foreground">{booking.pol}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{booking.pod}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("border font-medium text-xs", statusConfig.className)}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(booking.eta)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export function BookingsTable({ bookings, onSelectBooking, selectedBookingId }: BookingsTableProps) {
  return (
    <>
      {/* Mobile: Card Layout */}
      <div className="space-y-3 sm:hidden">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onSelect={() => onSelectBooking(booking)}
            isSelected={selectedBookingId === booking.id}
          />
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found
          </div>
        )}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden sm:block">
        <BookingsDesktopTable
          bookings={bookings}
          onSelectBooking={onSelectBooking}
          selectedBookingId={selectedBookingId}
        />
      </div>
    </>
  )
}
