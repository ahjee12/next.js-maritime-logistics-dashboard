"use client"

import { useState, useMemo } from "react"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { SearchFilters } from "@/components/dashboard/search-filters"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { BookingDrawer } from "@/components/dashboard/booking-drawer"
import { MOCK_BOOKINGS, type Booking } from "@/lib/mock-data"

export function DashboardContent() {
  const [filters, setFilters] = useState({
    search: "",
    status: null as string | null,
    pol: null as string | null,
    pod: null as string | null,
  })
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter((booking) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          booking.bookingNo.toLowerCase().includes(searchLower) ||
          booking.customer.toLowerCase().includes(searchLower) ||
          booking.vesselName.toLowerCase().includes(searchLower) ||
          booking.voyageNo.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      if (filters.status && booking.status !== filters.status) {
        return false
      }

      if (filters.pol && booking.pol !== filters.pol) {
        return false
      }

      if (filters.pod && booking.pod !== filters.pod) {
        return false
      }

      return true
    })
  }, [filters])

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setDrawerOpen(true)
  }

  return (
    <>
      <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1600px] mx-auto">
        <div className="space-y-4 sm:space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Bookings Overview
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              Monitor and manage your cargo bookings
            </p>
          </div>

          {/* KPI Cards */}
          <KPICards />

          {/* Search & Filters */}
          <SearchFilters filters={filters} onFiltersChange={setFilters} />

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredBookings.length}</span> of{" "}
              <span className="font-medium text-foreground">{MOCK_BOOKINGS.length}</span> bookings
            </p>
          </div>

          {/* Bookings Table / Cards */}
          <BookingsTable
            bookings={filteredBookings}
            onSelectBooking={handleSelectBooking}
            selectedBookingId={selectedBooking?.id}
          />
        </div>
      </div>

      {/* Booking Details Drawer */}
      <BookingDrawer
        booking={selectedBooking}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  )
}
