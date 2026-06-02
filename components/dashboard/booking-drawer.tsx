"use client"

import { useEffect, useRef, useState } from "react"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet"
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from "@/components/ui/drawer"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Badge }      from "@/components/ui/badge"
import { Button }     from "@/components/ui/button"
import { Input }      from "@/components/ui/input"
import { Separator }  from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowRight, Ship, Package, Calendar, MapPin, FileText,
  Download, CheckCircle2, Circle, Loader2, X,
  Pencil, Check, RotateCcw, History, User, Plus, Trash2,
} from "lucide-react"
import Image from "next/image"
import { MOCK_VESSELS, type Booking, type BookingStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────

type DocItem  = Booking["documents"][number]
type DocType  = DocItem["type"]
type DocStatus = DocItem["status"]

type EditForm = {
  vesselName:     string
  voyageNo:       string
  polName:        string
  podName:        string
  containerCount: string
  weight:         string
  commodity:      string
  etd:            string   // YYYY-MM-DD
  eta:            string
  documents:      DocItem[]
}

type HistoryChange = { label: string; from: string; to: string }
type HistoryEntry  = {
  id:          string
  timestamp:   string
  userName:    string
  changes:     HistoryChange[]
  type:        "edit" | "reset" | "revert"
  beforeState?: EditForm   // snapshot before this change
}

// ── Module-level persistence ───────────────────────────────────────────────

const _edits   = new Map<string, Partial<Booking>>()
const _history = new Map<string, HistoryEntry[]>()

// ── Constants ──────────────────────────────────────────────────────────────

// Port name → UNLOCODE mapping for all ports appearing in vessel routes
const PORT_MAP: Record<string, string> = {
  "Singapore":   "SGSIN",
  "Colombo":     "LKCMB",
  "Suez":        "EGPSD",
  "Rotterdam":   "NLRTM",
  "Hamburg":     "DEHAM",
  "Shanghai":    "CNSHA",
  "Busan":       "KRPUS",
  "Los Angeles": "USLAX",
  "New York":    "USNYC",
  "Antwerp":     "BEANR",
  "Hong Kong":   "HKHKG",
  "Tokyo":       "JPTYO",
  "Yokohama":    "JPYOK",
  "Panama":      "PABAL",
  "Ho Chi Minh": "VNSGN",
  "Ningbo":      "CNNGB",
}

function getVesselRoute(vesselName: string): string[] {
  return MOCK_VESSELS.find((v) => v.name === vesselName)?.route ?? []
}

const VESSEL_OPTIONS    = MOCK_VESSELS.map((v) => v.name)
const COMMODITY_OPTIONS = [
  "Electronics", "Textiles", "Machinery", "Auto Parts", "Chemicals",
  "Consumer Goods", "Furniture", "Food & Beverage", "Raw Materials", "Medical Equipment",
]
const DOC_TYPE_OPTIONS: DocType[]   = ["B/L", "Customs", "Invoice", "Packing List"]
const DOC_STATUS_OPTIONS: DocStatus[] = ["available", "pending"]
const CURRENT_USER = "John Doe"

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  approved:     { label: "Approved",   className: "bg-status-approved/15 text-status-approved border-status-approved/30" },
  pending:      { label: "Pending",    className: "bg-status-pending/15 text-status-pending border-status-pending/30"    },
  delayed:      { label: "Delayed",    className: "bg-status-delayed/15 text-status-delayed border-status-delayed/30"    },
  "in-transit": { label: "In Transit", className: "bg-status-transit/15 text-status-transit border-status-transit/30"   },
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(s: string) {
  const d = new Date(s)
  if (isNaN(d.getTime())) return s
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function toInputDate(s: string) {
  const d = new Date(s)
  return isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10)
}

function initForm(b: Booking, overrides?: Partial<Booking>): EditForm {
  const src = { ...b, ...(overrides ?? {}) }
  return {
    vesselName:     src.vesselName,
    voyageNo:       src.voyageNo,
    polName:        src.polName,
    podName:        src.podName,
    containerCount: String(src.containerCount),
    weight:         src.weight,
    commodity:      src.commodity,
    etd:            toInputDate(src.etd),
    eta:            toInputDate(src.eta),
    documents:      src.documents.map((d) => ({ ...d })),
  }
}

function formToEdits(form: EditForm, original: Booking): Partial<Booking> {
  return {
    vesselName:     form.vesselName,
    voyageNo:       form.voyageNo,
    pol:            PORT_MAP[form.polName] ?? original.pol,
    polName:        form.polName,
    pod:            PORT_MAP[form.podName] ?? original.pod,
    podName:        form.podName,
    containerCount: parseInt(form.containerCount) || original.containerCount,
    weight:         form.weight,
    commodity:      form.commodity,
    etd:            form.etd,
    eta:            form.eta,
    documents:      form.documents,
  }
}

function getChanges(before: EditForm, after: EditForm): HistoryChange[] {
  const result: HistoryChange[] = []
  const chk = (label: string, a: string, b: string) => {
    if (a.trim() !== b.trim()) result.push({ label, from: a, to: b })
  }
  chk("Vessel Name",     before.vesselName,     after.vesselName)
  chk("Voyage No.",      before.voyageNo,       after.voyageNo)
  chk("POL",             before.polName,        after.polName)
  chk("POD",             before.podName,        after.podName)
  chk("Container Count", before.containerCount, after.containerCount)
  chk("Weight",          before.weight,         after.weight)
  chk("Commodity",       before.commodity,      after.commodity)
  chk("ETD",             before.etd,            after.etd)
  chk("ETA",             before.eta,            after.eta)

  const docsA = JSON.stringify(before.documents)
  const docsB = JSON.stringify(after.documents)
  if (docsA !== docsB) {
    const added    = after.documents.length - before.documents.length
    const addedTxt = added > 0 ? `+${added}` : added < 0 ? `${added}` : "~"
    result.push({ label: "Documents", from: `${before.documents.length} item(s)`, to: `${after.documents.length} item(s) (${addedTxt})` })
  }
  return result
}

// ── TimelineStep ───────────────────────────────────────────────────────────

interface TimelineStepProps {
  label: string
  status: "completed" | "active" | "pending"
  date?: string
  location?: string
  isLast?: boolean
  action?: React.ReactNode
}
function TimelineStep({ label, status, date, location, isLast, action }: TimelineStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {status === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-status-approved shrink-0" />
        ) : status === "active" ? (
          <div className="relative">
            <Circle className="h-5 w-5 text-status-transit fill-status-transit/20 shrink-0" />
            <Loader2 className="h-3 w-3 text-status-transit absolute top-1 left-1 animate-spin" />
          </div>
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
        )}
        {!isLast && (
          <div className={cn("w-0.5 my-1 flex-1 min-h-[2rem]",
            status === "completed" ? "bg-status-approved" : "bg-border")} />
        )}
      </div>
      <div className="flex flex-col pb-3 sm:pb-4 gap-1">
        <span className={cn("font-medium text-sm",
          status === "pending" ? "text-muted-foreground" : "text-foreground")}>
          {label}
        </span>
        {date && <span className="text-xs text-muted-foreground">{formatDate(date)}</span>}
        {location && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />{location}
          </span>
        )}
        {status === "active" && <span className="text-xs text-status-transit font-medium">In progress</span>}
        {action}
      </div>
    </div>
  )
}

// ── BookingDetailsContent ──────────────────────────────────────────────────

function BookingDetailsContent({ booking, onClose }: { booking: Booking; onClose?: () => void }) {
  const statusConfig = STATUS_CONFIG[booking.status]

  const [editMode,            setEditMode]            = useState(false)
  const [confirmOpen,         setConfirmOpen]         = useState(false)
  const [pendingChanges,      setPendingChanges]      = useState<HistoryChange[]>([])
  const [revertConfirmOpen,   setRevertConfirmOpen]   = useState(false)
  const [pendingRevertEntry,  setPendingRevertEntry]  = useState<HistoryEntry | null>(null)
  const [pendingRevertChanges,setPendingRevertChanges]= useState<HistoryChange[]>([])
  const [showHistory,         setShowHistory]         = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [editForm,     setEditForm]     = useState<EditForm>(() => initForm(booking, _edits.get(booking.id)))
  const [savedEdits,   setSavedEdits]   = useState<Partial<Booking> | null>(() => _edits.get(booking.id) ?? null)
  const [historyList,  setHistoryList]  = useState<HistoryEntry[]>(() => _history.get(booking.id) ?? [])

  // Add-document mini-form state
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]')
    if (viewport) (viewport as HTMLElement).scrollTop = 0
  }

  const [addingDoc,    setAddingDoc]    = useState(false)
  const [newDocName,   setNewDocName]   = useState("")
  const [newDocType,   setNewDocType]   = useState<DocType>("B/L")
  const [newDocStatus, setNewDocStatus] = useState<DocStatus>("pending")

  // Reset when booking switches
  const prevId = useRef(booking.id)
  if (prevId.current !== booking.id) {
    prevId.current = booking.id
    const saved = _edits.get(booking.id) ?? null
    setShowLocation(false)
    setEditMode(false)
    setShowHistory(false)
    setSavedEdits(saved)
    setEditForm(initForm(booking, saved ?? undefined))
    setHistoryList(_history.get(booking.id) ?? [])
    setAddingDoc(false)
  }

  const eff = { ...booking, ...(savedEdits ?? {}) }

  const field = (k: keyof Omit<EditForm, "documents">) => (v: string) =>
    setEditForm((f) => ({ ...f, [k]: v }))

  // When vessel changes, reset POL/POD to valid ports in the new route
  const handleVesselChange = (newVessel: string) => {
    const route = getVesselRoute(newVessel)
    setEditForm((f) => ({
      ...f,
      vesselName: newVessel,
      polName: route.includes(f.polName) ? f.polName : (route[0] ?? f.polName),
      podName: route.includes(f.podName) ? f.podName : (route[route.length - 1] ?? f.podName),
    }))
  }

  // ── Save ──
  const handleSave = () => {
    const beforeForm = initForm(booking, savedEdits ?? undefined)
    const changes    = getChanges(beforeForm, editForm)
    if (changes.length > 0) {
      const entry: HistoryEntry = {
        id: Date.now().toString(), timestamp: new Date().toISOString(),
        userName: CURRENT_USER, changes, type: "edit", beforeState: beforeForm,
      }
      const newEdits = formToEdits(editForm, booking)
      _edits.set(booking.id, newEdits)
      const next = [entry, ...(_history.get(booking.id) ?? [])]
      _history.set(booking.id, next)
      setSavedEdits(newEdits)
      setHistoryList(next)
    }
    setEditMode(false)
    setAddingDoc(false)
  }

  const handleCancelEdit = () => {
    setEditForm(initForm(booking, savedEdits ?? undefined))
    setEditMode(false)
    setAddingDoc(false)
  }

  // ── Global reset ──
  const handleReset = () => {
    const beforeForm = initForm(booking, savedEdits ?? undefined)
    const entry: HistoryEntry = {
      id: Date.now().toString(), timestamp: new Date().toISOString(),
      userName: CURRENT_USER, changes: [], type: "reset", beforeState: beforeForm,
    }
    _edits.delete(booking.id)
    const next = [entry, ...(_history.get(booking.id) ?? [])]
    _history.set(booking.id, next)
    setSavedEdits(null)
    setHistoryList(next)
    setEditForm(initForm(booking))
    setEditMode(false)
    setAddingDoc(false)
  }

  // ── Per-entry revert ──
  const handleRevertToEntry = (entry: HistoryEntry) => {
    if (!entry.beforeState) return
    const currentForm = initForm(booking, savedEdits ?? undefined)
    // Compute what changes the revert will make (current → beforeState)
    const revertChanges = getChanges(currentForm, entry.beforeState)
    const revertedAt = new Date(entry.timestamp).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    })
    const revertEntry: HistoryEntry = {
      id: Date.now().toString(), timestamp: new Date().toISOString(),
      userName: CURRENT_USER,
      changes: [
        { label: "Reverted to", from: "", to: revertedAt },
        ...revertChanges,
      ],
      type: "revert", beforeState: currentForm,
    }
    const newEdits = formToEdits(entry.beforeState, booking)
    _edits.set(booking.id, newEdits)
    const next = [revertEntry, ...(_history.get(booking.id) ?? [])]
    _history.set(booking.id, next)
    setSavedEdits(newEdits)
    setHistoryList(next)
    setEditForm(entry.beforeState)
    setEditMode(false)
    setAddingDoc(false)
  }

  // ── Document helpers ──
  const updateDoc = (idx: number, patch: Partial<DocItem>) =>
    setEditForm((f) => ({ ...f, documents: f.documents.map((d, i) => i === idx ? { ...d, ...patch } : d) }))

  const removeDoc = (idx: number) =>
    setEditForm((f) => ({ ...f, documents: f.documents.filter((_, i) => i !== idx) }))

  const confirmAddDoc = () => {
    if (!newDocName.trim()) return
    setEditForm((f) => ({ ...f, documents: [...f.documents, { name: newDocName.trim(), type: newDocType, status: newDocStatus }] }))
    setNewDocName(""); setNewDocType("B/L"); setNewDocStatus("pending"); setAddingDoc(false)
  }

  const displayDocs = editMode ? editForm.documents : (savedEdits?.documents ?? booking.documents)

  return (
    <>
      {/* ── Revert Confirmation Dialog ── */}
      <AlertDialog open={revertConfirmOpen} onOpenChange={setRevertConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revert Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              The following changes will be applied to revert to the state before the selected edit.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingRevertChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No differences found.</p>
          ) : (
            <div className="rounded-lg border border-border bg-secondary/30 divide-y divide-border">
              {pendingRevertChanges.map((c, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 text-sm flex-wrap">
                  <span className="font-medium text-foreground w-28 shrink-0">{c.label}</span>
                  <span className="text-muted-foreground truncate max-w-[90px]">{c.from || "—"}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-accent font-medium truncate max-w-[90px]">{c.to}</span>
                </div>
              ))}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingRevertEntry(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRevertEntry) handleRevertToEntry(pendingRevertEntry)
                setPendingRevertEntry(null)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Save Confirmation Dialog ── */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save the following changes to this booking?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No changes detected.</p>
          ) : (
            <div className="rounded-lg border border-border bg-secondary/30 divide-y divide-border">
              {pendingChanges.map((c, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 text-sm flex-wrap">
                  <span className="font-medium text-foreground w-28 shrink-0">{c.label}</span>
                  <span className="text-muted-foreground truncate max-w-[90px]">{c.from || "—"}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-accent font-medium truncate max-w-[90px]">{c.to}</span>
                </div>
              ))}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Header ── */}
      <div className="pl-4 sm:pl-6 pr-10 sm:pr-12 pt-10 sm:pt-12 pb-3 sm:pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold truncate">{eff.bookingNo}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{eff.customer}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="outline" className={cn("border font-medium text-xs", statusConfig.className)}>
              {statusConfig.label}
            </Badge>
            {editMode ? (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-status-approved hover:bg-status-approved/10" title="Save" onClick={() => {
                    const beforeForm = initForm(booking, savedEdits ?? undefined)
                    setPendingChanges(getChanges(beforeForm, editForm))
                    setConfirmOpen(true)
                  }}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-status-delayed hover:bg-status-delayed/10" title="Cancel" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit"
                  onClick={() => { setEditMode(true); setShowHistory(false); setShowLocation(false) }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className={cn("h-7 w-7", showHistory && "bg-muted")} title="History"
                  onClick={() => { const next = !showHistory; setShowHistory(next); if (next) scrollToTop() }}>
                  <History className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            {onClose && (
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:hidden" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">

          {/* ── History Panel ── */}
          {showHistory && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-accent" />
                  Edit History
                </span>
                {savedEdits && (
                  <Button variant="outline" size="sm"
                    className="h-7 text-xs gap-1.5 text-status-delayed border-status-delayed/40 hover:bg-status-delayed/10"
                    onClick={handleReset}>
                    <RotateCcw className="h-3 w-3" />
                    Reset All
                  </Button>
                )}
              </div>

              {historyList.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">No edit history yet</p>
              ) : (
                <div className="space-y-2">
                  {historyList.map((entry, idx) => (
                    <div key={entry.id} className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
                      {/* Entry header */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted shrink-0">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{entry.userName}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {new Date(entry.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Entry body */}
                      {entry.type === "reset" ? (
                        <p className="text-xs text-muted-foreground pl-7">Reset to original values</p>
                      ) : (
                        <div className="pl-7 space-y-1">
                          {entry.changes.map((c, i) => (
                            <div key={i} className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
                              <span className={cn("font-medium shrink-0", i === 0 && entry.type === "revert" ? "text-status-transit" : "text-foreground")}>
                                {c.label}{c.label === "Reverted to" ? "" : ":"}
                              </span>
                              {c.from && <><span className="truncate max-w-[80px]">{c.from}</span><ArrowRight className="h-3 w-3 shrink-0" /></>}
                              <span className={cn("font-medium truncate max-w-[80px]", i === 0 && entry.type === "revert" ? "text-status-transit" : "text-accent")}>
                                {c.to}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Revert button — shown for every entry that has a beforeState */}
                      {entry.beforeState && (
                        <div className="pl-7 pt-1">
                          <Button variant="outline" size="sm"
                            className="h-6 text-[11px] gap-1.5 px-2 border-border hover:bg-muted"
                            onClick={() => {
                              const currentForm = initForm(booking, savedEdits ?? undefined)
                              setPendingRevertEntry(entry)
                              setPendingRevertChanges(getChanges(currentForm, entry.beforeState!))
                              setRevertConfirmOpen(true)
                            }}>
                            <RotateCcw className="h-3 w-3" />
                            Revert to before this change
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Separator />
            </div>
          )}

          {/* ── Vessel Information ── */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
              <Ship className="h-4 w-4 text-accent" />Vessel Information
            </div>
            {editMode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs text-muted-foreground">Vessel</label>
                    <Select value={editForm.vesselName} onValueChange={handleVesselChange}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{VESSEL_OPTIONS.map((v) => <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-xs text-muted-foreground">Voyage No.</label>
                    <Input className="h-8 text-sm" value={editForm.voyageNo} onChange={(e) => field("voyageNo")(e.target.value)} />
                  </div>
                </div>
                {/* POL / POD selects — options come from the selected vessel's route */}
                <div className="flex items-center gap-2 p-2.5 bg-secondary/50 rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] text-muted-foreground text-center">POL</div>
                    <Select value={editForm.polName} onValueChange={field("polName")}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {getVesselRoute(editForm.vesselName).map((port) => (
                          <SelectItem key={port} value={port} className="text-xs">
                            <span className="font-medium">{PORT_MAP[port] ?? "—"}</span>
                            <span className="ml-1 text-muted-foreground">{port}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center shrink-0">
                    <div className="h-px w-3 bg-border" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />
                    <div className="h-px w-3 bg-border" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] text-muted-foreground text-center">POD</div>
                    <Select value={editForm.podName} onValueChange={field("podName")}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {getVesselRoute(editForm.vesselName).map((port) => (
                          <SelectItem key={port} value={port} className="text-xs">
                            <span className="font-medium">{PORT_MAP[port] ?? "—"}</span>
                            <span className="ml-1 text-muted-foreground">{port}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-[10px] sm:text-xs mb-0.5">Vessel</span>
                    <span className="font-medium text-xs sm:text-sm">{eff.vesselName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] sm:text-xs mb-0.5">Voyage</span>
                    <span className="font-medium text-xs sm:text-sm">{eff.voyageNo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-secondary/50 rounded-lg">
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">POL</div>
                    <div className="font-semibold text-foreground text-sm sm:text-base">{eff.pol}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{eff.polName}</div>
                  </div>
                  <div className="flex items-center justify-center shrink-0">
                    <div className="h-px w-4 sm:w-6 bg-border" />
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mx-1 sm:mx-2" />
                    <div className="h-px w-4 sm:w-6 bg-border" />
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">POD</div>
                    <div className="font-semibold text-foreground text-sm sm:text-base">{eff.pod}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{eff.podName}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* ── Cargo Details ── */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
              <Package className="h-4 w-4 text-accent" />Cargo Details
            </div>
            {editMode ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs text-muted-foreground">Containers</label>
                  <Input type="number" min={1} className="h-8 text-sm" value={editForm.containerCount} onChange={(e) => field("containerCount")(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs text-muted-foreground">Weight</label>
                  <Input className="h-8 text-sm" value={editForm.weight} onChange={(e) => field("weight")(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs text-muted-foreground">Commodity</label>
                  <Select value={editForm.commodity} onValueChange={field("commodity")}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{COMMODITY_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-sm">
                <div className="p-2 sm:p-3 bg-secondary/50 rounded-lg text-center">
                  <div className="text-base sm:text-lg font-semibold text-foreground">{eff.containerCount}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Containers</div>
                </div>
                <div className="p-2 sm:p-3 bg-secondary/50 rounded-lg text-center">
                  <div className="text-base sm:text-lg font-semibold text-foreground">{eff.weight}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Weight</div>
                </div>
                <div className="p-2 sm:p-3 bg-secondary/50 rounded-lg text-center">
                  <div className="text-xs sm:text-sm font-semibold text-foreground truncate">{eff.commodity}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Commodity</div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* ── Schedule ── */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-accent" />Schedule
            </div>
            {editMode ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs text-muted-foreground">ETD</label>
                  <Input type="date" className="h-8 text-sm" value={editForm.etd} onChange={(e) => field("etd")(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs text-muted-foreground">ETA</label>
                  <Input type="date" className="h-8 text-sm" value={editForm.eta} onChange={(e) => field("eta")(e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="p-2 sm:p-3 bg-secondary/50 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">ETD</div>
                  <div className="font-medium text-xs sm:text-sm">{formatDate(eff.etd)}</div>
                </div>
                <div className="p-2 sm:p-3 bg-secondary/50 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">ETA</div>
                  <div className="font-medium text-xs sm:text-sm">{formatDate(eff.eta)}</div>
                </div>
              </div>
            )}
          </div>

          {!editMode && (
            <>
              <Separator />

              {/* ── Container Status ── */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-accent" />Container Status
                </div>
                <div className="pl-1">
                  <TimelineStep label="Gate-in"          status={booking.timeline.gateIn.status}    date={booking.timeline.gateIn.date}    location={booking.polName} />
                  <TimelineStep label="Loaded on Vessel" status={booking.timeline.loaded.status}    date={booking.timeline.loaded.date}    location={booking.polName} />
                  <TimelineStep
                    label="In Transit"
                    status={booking.timeline.inTransit.status}
                    date={booking.timeline.inTransit.date}
                    location={booking.currentLocation?.name ?? "At Sea"}
                    action={booking.status === "in-transit" ? (
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 w-fit"
                        onClick={() => setShowLocation((v) => !v)}>
                        <MapPin className="h-3 w-3" />
                        {showLocation ? "Hide Location" : "View Location"}
                      </Button>
                    ) : undefined}
                  />
                  {showLocation && booking.status === "in-transit" && (
                    <div className="ml-8 mb-3">
                      <div className="relative overflow-hidden rounded-lg">
                        <Image src="/map.png" alt="Current vessel location map" width={500} height={300} className="w-full h-auto object-cover" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap">
                            <Ship className="h-4 w-4 text-accent shrink-0" />
                            <div>
                              <div className="text-xs font-semibold text-foreground">
                                {booking.currentLocation?.name ?? booking.vesselName.toUpperCase()}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {booking.currentLocation ? `${booking.currentLocation.lat}, ${booking.currentLocation.lng}` : "Tracking..."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <TimelineStep label="Discharged" status={booking.timeline.discharged.status} date={booking.timeline.discharged.date} location={booking.podName} isLast />
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* ── Documents ── */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-accent" />Documents
            </div>

            <div className="space-y-2">
              {displayDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 bg-secondary/50 rounded-lg gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      {editMode ? (
                        <Input
                          className="h-7 text-xs mb-1"
                          value={doc.name}
                          onChange={(e) => updateDoc(i, { name: e.target.value })}
                        />
                      ) : (
                        <div className="text-xs sm:text-sm font-medium truncate">{doc.name}</div>
                      )}
                      {editMode ? (
                        <div className="flex gap-1.5">
                          <Select value={doc.type} onValueChange={(v) => updateDoc(i, { type: v as DocType })}>
                            <SelectTrigger className="h-6 text-[10px] w-28"><SelectValue /></SelectTrigger>
                            <SelectContent>{DOC_TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select value={doc.status} onValueChange={(v) => updateDoc(i, { status: v as DocStatus })}>
                            <SelectTrigger className="h-6 text-[10px] w-24"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available" className="text-xs">Available</SelectItem>
                              <SelectItem value="pending"   className="text-xs">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{doc.type}</div>
                      )}
                    </div>
                  </div>
                  {editMode ? (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-status-delayed shrink-0"
                      onClick={() => removeDoc(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  ) : doc.status === "available" ? (
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-accent hover:bg-accent hover:text-white shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">Pending</Badge>
                  )}
                </div>
              ))}

              {/* Add document form */}
              {editMode && (
                addingDoc ? (
                  <div className="p-3 rounded-lg border border-dashed border-border space-y-2">
                    <Input placeholder="Document name" className="h-8 text-sm"
                      value={newDocName} onChange={(e) => setNewDocName(e.target.value)} />
                    <div className="flex gap-2">
                      <Select value={newDocType} onValueChange={(v) => setNewDocType(v as DocType)}>
                        <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{DOC_TYPE_OPTIONS.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={newDocStatus} onValueChange={(v) => setNewDocStatus(v as DocStatus)}>
                        <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available" className="text-xs">Available</SelectItem>
                          <SelectItem value="pending"   className="text-xs">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs flex-1" onClick={confirmAddDoc}>Add</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => setAddingDoc(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5 border-dashed"
                    onClick={() => setAddingDoc(true)}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Document
                  </Button>
                )
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </>
  )
}

// ── useIsMobile ────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

// ── BookingDrawer (export) ─────────────────────────────────────────────────

interface BookingDrawerProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDrawer({ booking, open, onOpenChange }: BookingDrawerProps) {
  const isMobile = useIsMobile()
  if (!booking) return null

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[95vh] max-h-[95vh] flex flex-col overflow-hidden">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{booking.bookingNo}</DrawerTitle>
            <DrawerDescription>{booking.customer}</DrawerDescription>
          </DrawerHeader>
          <BookingDetailsContent booking={booking} onClose={() => onOpenChange(false)} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col overflow-hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>{booking.bookingNo}</SheetTitle>
          <SheetDescription>{booking.customer}</SheetDescription>
        </SheetHeader>
        <BookingDetailsContent booking={booking} />
      </SheetContent>
    </Sheet>
  )
}
