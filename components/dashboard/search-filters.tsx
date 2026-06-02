"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

interface FilterState {
  search: string
  status: string | null
  pol: string | null
  pod: string | null
}

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "delayed", label: "Delayed" },
  { value: "in-transit", label: "In Transit" },
]

const PORT_OPTIONS = [
  { value: "all", label: "All Ports" },
  { value: "SGSIN", label: "Singapore (SGSIN)" },
  { value: "CNSHA", label: "Shanghai (CNSHA)" },
  { value: "NLRTM", label: "Rotterdam (NLRTM)" },
  { value: "USNYC", label: "New York (USNYC)" },
  { value: "DEHAM", label: "Hamburg (DEHAM)" },
  { value: "JPTYO", label: "Tokyo (JPTYO)" },
]

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  const activeFilters = [
    filters.status && filters.status !== "all" ? { key: "status", label: filters.status } : null,
    filters.pol && filters.pol !== "all" ? { key: "pol", label: `POL: ${filters.pol}` } : null,
    filters.pod && filters.pod !== "all" ? { key: "pod", label: `POD: ${filters.pod}` } : null,
  ].filter(Boolean) as { key: string; label: string }[]

  const clearFilter = (key: string) => {
    onFiltersChange({
      ...filters,
      [key]: key === "search" ? "" : null,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      status: null,
      pol: null,
      pod: null,
    })
  }

  const FilterSelects = () => (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground sm:sr-only">Status</label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full sm:w-[140px] bg-card border-input">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground sm:sr-only">Port of Loading</label>
        <Select
          value={filters.pol || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, pol: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-card border-input">
            <SelectValue placeholder="POL" />
          </SelectTrigger>
          <SelectContent>
            {PORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground sm:sr-only">Port of Discharge</label>
        <Select
          value={filters.pod || "all"}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, pod: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-card border-input">
            <SelectValue placeholder="POD" />
          </SelectTrigger>
          <SelectContent>
            {PORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )

  return (
    <div className="space-y-3">
      <div className="flex gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 bg-card border-input text-sm"
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="sm:hidden gap-2 shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Filters</span>
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-xl">
            <SheetHeader className="pb-4">
              <SheetTitle>Filter Bookings</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 pb-6">
              <FilterSelects />
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    clearAllFilters()
                    setFilterSheetOpen(false)
                  }}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setFilterSheetOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Filter Selects */}
        <div className="hidden sm:flex gap-2">
          <FilterSelects />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1 pr-1.5 capitalize text-xs"
            >
              {filter.label}
              <button
                onClick={() => clearFilter(filter.key)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter.label} filter</span>
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
