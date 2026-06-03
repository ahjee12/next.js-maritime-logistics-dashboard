export type BookingStatus = "approved" | "pending" | "delayed" | "in-transit"

export interface Booking {
  id: string
  bookingNo: string
  customer: string
  vesselName: string
  voyageNo: string
  pol: string
  polName: string
  pod: string
  podName: string
  status: BookingStatus
  eta: string
  etd: string
  containerCount: number
  commodity: string
  weight: string
  timeline: {
    gateIn: { status: "completed" | "pending"; date?: string }
    loaded: { status: "completed" | "pending"; date?: string }
    inTransit: { status: "completed" | "active" | "pending"; date?: string }
    discharged: { status: "completed" | "pending"; date?: string }
  }
  documents: {
    name: string
    type: "B/L" | "Customs" | "Invoice" | "Packing List"
    status: "available" | "pending"
  }[]
  currentLocation?: {
    name: string
    lat: string
    lng: string
  }
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    bookingNo: "BK-2024-001247",
    customer: "Global Trade Corp",
    vesselName: "MSC Oscar",
    voyageNo: "V.124E",
    pol: "SGSIN",
    polName: "Singapore",
    pod: "NLRTM",
    podName: "Rotterdam",
    status: "in-transit",
    eta: "2024-02-15",
    etd: "2024-01-28",
    containerCount: 12,
    commodity: "Electronics",
    weight: "156.8 MT",
    timeline: {
      gateIn: { status: "completed", date: "2024-01-25" },
      loaded: { status: "completed", date: "2024-01-28" },
      inTransit: { status: "active", date: "2024-01-28" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "available" },
      { name: "Customs Declaration", type: "Customs", status: "available" },
      { name: "Commercial Invoice", type: "Invoice", status: "available" },
    ],
    currentLocation: {
      name: "MSC OSCAR",
      lat: "33.8568N",
      lng: "124.5123E",
    },
  },
  {
    id: "2",
    bookingNo: "BK-2024-001248",
    customer: "Pacific Imports Ltd",
    vesselName: "Ever Given",
    voyageNo: "V.087W",
    pol: "CNSHA",
    polName: "Shanghai",
    pod: "USNYC",
    podName: "New York",
    status: "approved",
    eta: "2024-02-22",
    etd: "2024-02-05",
    containerCount: 8,
    commodity: "Textiles",
    weight: "92.4 MT",
    timeline: {
      gateIn: { status: "completed", date: "2024-02-01" },
      loaded: { status: "pending" },
      inTransit: { status: "pending" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "pending" },
      { name: "Customs Declaration", type: "Customs", status: "pending" },
    ],
  },
  {
    id: "3",
    bookingNo: "BK-2024-001249",
    customer: "Euro Logistics GmbH",
    vesselName: "CMA CGM Marco Polo",
    voyageNo: "V.056E",
    pol: "DEHAM",
    polName: "Hamburg",
    pod: "SGSIN",
    podName: "Singapore",
    status: "delayed",
    eta: "2024-02-28",
    etd: "2024-02-01",
    containerCount: 15,
    commodity: "Machinery",
    weight: "245.2 MT",
    timeline: {
      gateIn: { status: "completed", date: "2024-01-29" },
      loaded: { status: "completed", date: "2024-02-01" },
      inTransit: { status: "active", date: "2024-02-01" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "available" },
      { name: "Customs Declaration", type: "Customs", status: "available" },
      { name: "Packing List", type: "Packing List", status: "available" },
    ],
  },
  {
    id: "4",
    bookingNo: "BK-2024-001250",
    customer: "Asian Trading Co",
    vesselName: "Maersk Edinburgh",
    voyageNo: "V.201N",
    pol: "JPTYO",
    polName: "Tokyo",
    pod: "USNYC",
    podName: "New York",
    status: "pending",
    eta: "2024-03-05",
    etd: "2024-02-12",
    containerCount: 6,
    commodity: "Auto Parts",
    weight: "78.6 MT",
    timeline: {
      gateIn: { status: "pending" },
      loaded: { status: "pending" },
      inTransit: { status: "pending" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "pending" },
    ],
  },
  {
    id: "5",
    bookingNo: "BK-2024-001251",
    customer: "Atlantic Freight Inc",
    vesselName: "HMM Algeciras",
    voyageNo: "V.078S",
    pol: "NLRTM",
    polName: "Rotterdam",
    pod: "CNSHA",
    podName: "Shanghai",
    status: "in-transit",
    eta: "2024-02-18",
    etd: "2024-01-25",
    containerCount: 20,
    commodity: "Chemicals",
    weight: "312.5 MT",
    timeline: {
      gateIn: { status: "completed", date: "2024-01-22" },
      loaded: { status: "completed", date: "2024-01-25" },
      inTransit: { status: "active", date: "2024-01-25" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "available" },
      { name: "Customs Declaration", type: "Customs", status: "available" },
      { name: "Commercial Invoice", type: "Invoice", status: "available" },
      { name: "Packing List", type: "Packing List", status: "available" },
    ],
    currentLocation: {
      name: "HMM ALGECIRAS",
      lat: "12.4821N",
      lng: "43.1456E",
    },
  },
  {
    id: "6",
    bookingNo: "BK-2024-001252",
    customer: "Oceanic Ventures",
    vesselName: "ONE Apus",
    voyageNo: "V.145W",
    pol: "SGSIN",
    polName: "Singapore",
    pod: "JPTYO",
    podName: "Tokyo",
    status: "approved",
    eta: "2024-02-10",
    etd: "2024-02-03",
    containerCount: 4,
    commodity: "Consumer Goods",
    weight: "42.1 MT",
    timeline: {
      gateIn: { status: "completed", date: "2024-02-01" },
      loaded: { status: "completed", date: "2024-02-03" },
      inTransit: { status: "pending" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "available" },
      { name: "Customs Declaration", type: "Customs", status: "pending" },
    ],
  },
  {
    id: "7",
    bookingNo: "BK-2024-001253",
    customer: "Meridian Shipping LLC",
    vesselName: "Cosco Shipping Universe",
    voyageNo: "V.092E",
    pol: "CNSHA",
    polName: "Shanghai",
    pod: "DEHAM",
    podName: "Hamburg",
    status: "delayed",
    eta: "2024-03-01",
    etd: "2024-02-08",
    containerCount: 18,
    commodity: "Furniture",
    weight: "198.7 MT",
    timeline: {
      gateIn: { status: "completed", date: "2024-02-05" },
      loaded: { status: "completed", date: "2024-02-08" },
      inTransit: { status: "active", date: "2024-02-08" },
      discharged: { status: "pending" },
    },
    documents: [
      { name: "Bill of Lading", type: "B/L", status: "available" },
      { name: "Customs Declaration", type: "Customs", status: "available" },
    ],
    currentLocation: {
      name: "COSCO UNIVERSE",
      lat: "29.7431N",
      lng: "32.3128E",
    },
  },
]

// Vessel Schedule Data
export type VesselStatus = "at-sea" | "at-port" | "arriving" | "departing" | "maintenance"

export interface Vessel {
  id: string
  name: string
  imo: string
  flag: string
  status: VesselStatus
  currentPort?: string
  nextPort: string
  eta: string
  etd?: string
  capacity: string
  utilization: number
  route: string[]
  position?: { lat: number; lng: number }
}

export interface ScheduleEvent {
  id: string
  vesselId: string
  vesselName: string
  type: "arrival" | "departure"
  port: string
  portCode: string
  scheduledTime: string
  actualTime?: string
  status: "on-time" | "delayed" | "completed" | "cancelled"
  delayMinutes?: number
}

export const MOCK_VESSELS: Vessel[] = [
  {
    id: "v1",
    name: "MSC Oscar",
    imo: "IMO 9703291",
    flag: "Panama",
    status: "at-sea",
    nextPort: "Rotterdam",
    eta: "2024-02-15",
    capacity: "19,224 TEU",
    utilization: 87,
    route: ["Singapore", "Colombo", "Suez", "Rotterdam", "Hamburg"],
  },
  {
    id: "v2",
    name: "Ever Given",
    imo: "IMO 9811000",
    flag: "Panama",
    status: "at-port",
    currentPort: "Shanghai",
    nextPort: "New York",
    eta: "2024-02-22",
    etd: "2024-02-05",
    capacity: "20,124 TEU",
    utilization: 72,
    route: ["Shanghai", "Busan", "Los Angeles", "New York"],
  },
  {
    id: "v3",
    name: "CMA CGM Marco Polo",
    imo: "IMO 9454436",
    flag: "United Kingdom",
    status: "arriving",
    currentPort: "Suez Canal",
    nextPort: "Singapore",
    eta: "2024-02-28",
    capacity: "16,020 TEU",
    utilization: 91,
    route: ["Hamburg", "Antwerp", "Suez", "Singapore", "Hong Kong"],
  },
  {
    id: "v4",
    name: "Maersk Edinburgh",
    imo: "IMO 9458091",
    flag: "Denmark",
    status: "at-port",
    currentPort: "Tokyo",
    nextPort: "New York",
    eta: "2024-03-05",
    etd: "2024-02-12",
    capacity: "13,092 TEU",
    utilization: 65,
    route: ["Tokyo", "Yokohama", "Los Angeles", "Panama", "New York"],
  },
  {
    id: "v5",
    name: "HMM Algeciras",
    imo: "IMO 9863297",
    flag: "South Korea",
    status: "at-sea",
    nextPort: "Shanghai",
    eta: "2024-02-18",
    capacity: "23,964 TEU",
    utilization: 94,
    route: ["Rotterdam", "Hamburg", "Suez", "Singapore", "Shanghai"],
  },
  {
    id: "v6",
    name: "ONE Apus",
    imo: "IMO 9806079",
    flag: "Japan",
    status: "departing",
    currentPort: "Singapore",
    nextPort: "Tokyo",
    eta: "2024-02-10",
    etd: "2024-02-03",
    capacity: "14,052 TEU",
    utilization: 58,
    route: ["Singapore", "Ho Chi Minh", "Hong Kong", "Tokyo"],
  },
  {
    id: "v7",
    name: "Cosco Shipping Universe",
    imo: "IMO 9795610",
    flag: "Hong Kong",
    status: "at-sea",
    nextPort: "Hamburg",
    eta: "2024-03-01",
    capacity: "21,237 TEU",
    utilization: 82,
    route: ["Shanghai", "Ningbo", "Singapore", "Suez", "Hamburg"],
  },
  {
    id: "v8",
    name: "OOCL Hong Kong",
    imo: "IMO 9776171",
    flag: "Hong Kong",
    status: "maintenance",
    currentPort: "Busan",
    nextPort: "Shanghai",
    eta: "2024-02-20",
    capacity: "21,413 TEU",
    utilization: 0,
    route: ["Busan", "Shanghai", "Singapore", "Rotterdam"],
  },
]

export const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "se1",
    vesselId: "v1",
    vesselName: "MSC Oscar",
    type: "arrival",
    port: "Rotterdam",
    portCode: "NLRTM",
    scheduledTime: "2024-02-15T08:00:00",
    status: "on-time",
  },
  {
    id: "se2",
    vesselId: "v2",
    vesselName: "Ever Given",
    type: "departure",
    port: "Shanghai",
    portCode: "CNSHA",
    scheduledTime: "2024-02-05T14:00:00",
    status: "on-time",
  },
  {
    id: "se3",
    vesselId: "v3",
    vesselName: "CMA CGM Marco Polo",
    type: "arrival",
    port: "Singapore",
    portCode: "SGSIN",
    scheduledTime: "2024-02-28T06:00:00",
    actualTime: "2024-02-28T09:30:00",
    status: "delayed",
    delayMinutes: 210,
  },
  {
    id: "se4",
    vesselId: "v4",
    vesselName: "Maersk Edinburgh",
    type: "departure",
    port: "Tokyo",
    portCode: "JPTYO",
    scheduledTime: "2024-02-12T10:00:00",
    status: "on-time",
  },
  {
    id: "se5",
    vesselId: "v5",
    vesselName: "HMM Algeciras",
    type: "arrival",
    port: "Shanghai",
    portCode: "CNSHA",
    scheduledTime: "2024-02-18T16:00:00",
    status: "on-time",
  },
  {
    id: "se6",
    vesselId: "v6",
    vesselName: "ONE Apus",
    type: "departure",
    port: "Singapore",
    portCode: "SGSIN",
    scheduledTime: "2024-02-03T22:00:00",
    actualTime: "2024-02-03T22:00:00",
    status: "completed",
  },
  {
    id: "se7",
    vesselId: "v7",
    vesselName: "Cosco Shipping Universe",
    type: "arrival",
    port: "Hamburg",
    portCode: "DEHAM",
    scheduledTime: "2024-03-01T12:00:00",
    actualTime: "2024-03-01T14:45:00",
    status: "delayed",
    delayMinutes: 165,
  },
  {
    id: "se8",
    vesselId: "v1",
    vesselName: "MSC Oscar",
    type: "departure",
    port: "Rotterdam",
    portCode: "NLRTM",
    scheduledTime: "2024-02-17T06:00:00",
    status: "on-time",
  },
  {
    id: "se9",
    vesselId: "v2",
    vesselName: "Ever Given",
    type: "arrival",
    port: "New York",
    portCode: "USNYC",
    scheduledTime: "2024-02-22T08:00:00",
    status: "on-time",
  },
  {
    id: "se10",
    vesselId: "v8",
    vesselName: "OOCL Hong Kong",
    type: "departure",
    port: "Busan",
    portCode: "KRPUS",
    scheduledTime: "2024-02-20T00:00:00",
    status: "cancelled",
  },
]

// User/Settings Data
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "operator" | "viewer"
  department: string
  avatar?: string
  status: "active" | "inactive" | "pending"
  lastActive: string
  permissions: string[]
}

export interface NotificationSetting {
  id: string
  category: string
  email: boolean
  push: boolean
  sms: boolean
}

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@sinokor.com",
    role: "admin",
    department: "Operations",
    status: "active",
    lastActive: "2024-02-05T14:32:00",
    permissions: ["bookings.manage", "vessels.manage", "users.manage", "reports.view", "settings.manage"],
  },
  {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah.chen@sinokor.com",
    role: "manager",
    department: "Logistics",
    status: "active",
    lastActive: "2024-02-05T12:15:00",
    permissions: ["bookings.manage", "vessels.view", "reports.view"],
  },
  {
    id: "u3",
    name: "Michael Rodriguez",
    email: "m.rodriguez@sinokor.com",
    role: "operator",
    department: "Documentation",
    status: "active",
    lastActive: "2024-02-05T09:45:00",
    permissions: ["bookings.view", "bookings.edit", "documents.manage"],
  },
  {
    id: "u4",
    name: "Emily Watson",
    email: "e.watson@sinokor.com",
    role: "viewer",
    department: "Customer Service",
    status: "active",
    lastActive: "2024-02-04T16:20:00",
    permissions: ["bookings.view", "vessels.view"],
  },
  {
    id: "u5",
    name: "David Kim",
    email: "d.kim@sinokor.com",
    role: "operator",
    department: "Operations",
    status: "inactive",
    lastActive: "2024-01-28T11:00:00",
    permissions: ["bookings.view", "bookings.edit"],
  },
  {
    id: "u6",
    name: "Lisa Thompson",
    email: "l.thompson@sinokor.com",
    role: "manager",
    department: "Finance",
    status: "pending",
    lastActive: "2024-02-01T08:30:00",
    permissions: ["reports.view", "invoices.manage"],
  },
]

export const MOCK_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: "n1", category: "Booking Updates", email: true, push: true, sms: false },
  { id: "n2", category: "Vessel Arrivals", email: true, push: false, sms: false },
  { id: "n3", category: "Delays & Disruptions", email: true, push: true, sms: true },
  { id: "n4", category: "Document Ready", email: true, push: true, sms: false },
  { id: "n5", category: "System Alerts", email: true, push: false, sms: false },
  { id: "n6", category: "Weekly Reports", email: true, push: false, sms: false },
]

// Booking Statistics — Monthly Data (last 12 months)
export const BOOKING_MONTHLY_DATA = [
  { month: "Jun '25", total: 198, approved: 88, inTransit: 54, delayed: 31, pending: 25 },
  { month: "Jul '25", total: 214, approved: 95, inTransit: 61, delayed: 35, pending: 23 },
  { month: "Aug '25", total: 207, approved: 91, inTransit: 58, delayed: 33, pending: 25 },
  { month: "Sep '25", total: 223, approved: 102, inTransit: 63, delayed: 30, pending: 28 },
  { month: "Oct '25", total: 241, approved: 110, inTransit: 68, delayed: 37, pending: 26 },
  { month: "Nov '25", total: 228, approved: 104, inTransit: 65, delayed: 34, pending: 25 },
  { month: "Dec '25", total: 219, approved: 98, inTransit: 62, delayed: 36, pending: 23 },
  { month: "Jan '26", total: 235, approved: 108, inTransit: 67, delayed: 33, pending: 27 },
  { month: "Feb '26", total: 248, approved: 115, inTransit: 70, delayed: 38, pending: 25 },
  { month: "Mar '26", total: 262, approved: 121, inTransit: 74, delayed: 40, pending: 27 },
  { month: "Apr '26", total: 255, approved: 118, inTransit: 72, delayed: 36, pending: 29 },
  { month: "May '26", total: 267, approved: 124, inTransit: 76, delayed: 39, pending: 28 },
]

export const TOTAL_BOOKINGS_12M = BOOKING_MONTHLY_DATA.reduce((s, d) => s + d.total, 0)

// Daily data — last 7 days (Sun = today)
export const BOOKING_DAILY_DATA = [
  { month: "Mon", total: 8,  approved: 3, inTransit: 2, delayed: 2, pending: 1 },
  { month: "Tue", total: 11, approved: 5, inTransit: 3, delayed: 2, pending: 1 },
  { month: "Wed", total: 13, approved: 6, inTransit: 4, delayed: 2, pending: 1 },
  { month: "Thu", total: 12, approved: 5, inTransit: 3, delayed: 2, pending: 2 },
  { month: "Fri", total: 14, approved: 6, inTransit: 4, delayed: 3, pending: 1 },
  { month: "Sat", total: 9,  approved: 4, inTransit: 2, delayed: 2, pending: 1 },
  { month: "Today", total: 9, approved: 4, inTransit: 2, delayed: 2, pending: 1 },
]

// Weekly data — last 5 weeks
export const BOOKING_WEEKLY_DATA = [
  { month: "Week 1",    total: 56, approved: 24, inTransit: 16, delayed: 10, pending: 6 },
  { month: "Week 2",    total: 61, approved: 27, inTransit: 18, delayed: 10, pending: 6 },
  { month: "Week 3",    total: 67, approved: 30, inTransit: 19, delayed: 11, pending: 7 },
  { month: "Week 4",    total: 64, approved: 28, inTransit: 18, delayed: 11, pending: 7 },
  { month: "This Week", total: 19, approved: 8,  inTransit: 6,  delayed: 3,  pending: 2 },
]

// 5-year monthly data (Jun 2021 – May 2026)
export const BOOKING_5YEAR_DATA = [
  { month: "Jun '21", total: 142, approved: 62, inTransit: 38, delayed: 25, pending: 17 },
  { month: "Jul '21", total: 151, approved: 66, inTransit: 41, delayed: 27, pending: 17 },
  { month: "Aug '21", total: 148, approved: 64, inTransit: 40, delayed: 27, pending: 17 },
  { month: "Sep '21", total: 155, approved: 68, inTransit: 43, delayed: 26, pending: 18 },
  { month: "Oct '21", total: 162, approved: 72, inTransit: 46, delayed: 27, pending: 17 },
  { month: "Nov '21", total: 157, approved: 69, inTransit: 44, delayed: 27, pending: 17 },
  { month: "Dec '21", total: 149, approved: 65, inTransit: 41, delayed: 28, pending: 15 },
  { month: "Jan '22", total: 158, approved: 70, inTransit: 44, delayed: 28, pending: 16 },
  { month: "Feb '22", total: 163, approved: 72, inTransit: 46, delayed: 28, pending: 17 },
  { month: "Mar '22", total: 170, approved: 76, inTransit: 48, delayed: 29, pending: 17 },
  { month: "Apr '22", total: 167, approved: 74, inTransit: 47, delayed: 28, pending: 18 },
  { month: "May '22", total: 172, approved: 77, inTransit: 48, delayed: 29, pending: 18 },
  { month: "Jun '22", total: 168, approved: 74, inTransit: 47, delayed: 29, pending: 18 },
  { month: "Jul '22", total: 176, approved: 78, inTransit: 50, delayed: 30, pending: 18 },
  { month: "Aug '22", total: 173, approved: 77, inTransit: 49, delayed: 30, pending: 17 },
  { month: "Sep '22", total: 180, approved: 80, inTransit: 51, delayed: 30, pending: 19 },
  { month: "Oct '22", total: 185, approved: 83, inTransit: 52, delayed: 31, pending: 19 },
  { month: "Nov '22", total: 179, approved: 80, inTransit: 50, delayed: 31, pending: 18 },
  { month: "Dec '22", total: 171, approved: 76, inTransit: 48, delayed: 31, pending: 16 },
  { month: "Jan '23", total: 181, approved: 81, inTransit: 51, delayed: 31, pending: 18 },
  { month: "Feb '23", total: 186, approved: 83, inTransit: 53, delayed: 31, pending: 19 },
  { month: "Mar '23", total: 193, approved: 87, inTransit: 55, delayed: 32, pending: 19 },
  { month: "Apr '23", total: 189, approved: 85, inTransit: 54, delayed: 31, pending: 19 },
  { month: "May '23", total: 195, approved: 88, inTransit: 56, delayed: 32, pending: 19 },
  { month: "Jun '23", total: 188, approved: 84, inTransit: 53, delayed: 32, pending: 19 },
  { month: "Jul '23", total: 198, approved: 89, inTransit: 57, delayed: 33, pending: 19 },
  { month: "Aug '23", total: 193, approved: 87, inTransit: 55, delayed: 33, pending: 18 },
  { month: "Sep '23", total: 201, approved: 91, inTransit: 58, delayed: 32, pending: 20 },
  { month: "Oct '23", total: 208, approved: 94, inTransit: 60, delayed: 34, pending: 20 },
  { month: "Nov '23", total: 202, approved: 91, inTransit: 58, delayed: 33, pending: 20 },
  { month: "Dec '23", total: 194, approved: 87, inTransit: 56, delayed: 33, pending: 18 },
  { month: "Jan '24", total: 205, approved: 93, inTransit: 59, delayed: 33, pending: 20 },
  { month: "Feb '24", total: 211, approved: 96, inTransit: 61, delayed: 33, pending: 21 },
  { month: "Mar '24", total: 219, approved: 100, inTransit: 63, delayed: 35, pending: 21 },
  { month: "Apr '24", total: 214, approved: 97, inTransit: 62, delayed: 34, pending: 21 },
  { month: "May '24", total: 220, approved: 101, inTransit: 64, delayed: 34, pending: 21 },
  { month: "Jun '24", total: 210, approved: 95, inTransit: 60, delayed: 35, pending: 20 },
  { month: "Jul '24", total: 219, approved: 99, inTransit: 62, delayed: 36, pending: 22 },
  { month: "Aug '24", total: 215, approved: 97, inTransit: 61, delayed: 36, pending: 21 },
  { month: "Sep '24", total: 223, approved: 101, inTransit: 64, delayed: 36, pending: 22 },
  { month: "Oct '24", total: 231, approved: 105, inTransit: 66, delayed: 38, pending: 22 },
  { month: "Nov '24", total: 225, approved: 102, inTransit: 64, delayed: 37, pending: 22 },
  { month: "Dec '24", total: 216, approved: 98, inTransit: 62, delayed: 35, pending: 21 },
  { month: "Jan '25", total: 228, approved: 104, inTransit: 65, delayed: 37, pending: 22 },
  { month: "Feb '25", total: 234, approved: 107, inTransit: 67, delayed: 37, pending: 23 },
  { month: "Mar '25", total: 243, approved: 111, inTransit: 70, delayed: 39, pending: 23 },
  { month: "Apr '25", total: 238, approved: 108, inTransit: 68, delayed: 38, pending: 24 },
  { month: "May '25", total: 244, approved: 112, inTransit: 70, delayed: 39, pending: 23 },
  // Last 12 months
  ...BOOKING_MONTHLY_DATA,
]

export const BOOKINGS_BREAKDOWN = {
  last12Months: TOTAL_BOOKINGS_12M,
  thisMonth:    BOOKING_MONTHLY_DATA[BOOKING_MONTHLY_DATA.length - 1].total,
  thisWeek:     BOOKING_WEEKLY_DATA[BOOKING_WEEKLY_DATA.length - 1].total,
  today:        BOOKING_DAILY_DATA[BOOKING_DAILY_DATA.length - 1].total,
}

// Delayed Cargo — Monthly Data (last 12 months)
export const DELAYED_MONTHLY_DATA = [
  { month: "Jun '25", total: 18, weather: 6, portCongestion: 5, documentation: 4, customs: 3 },
  { month: "Jul '25", total: 21, weather: 8, portCongestion: 6, documentation: 4, customs: 3 },
  { month: "Aug '25", total: 25, weather: 11, portCongestion: 7, documentation: 4, customs: 3 },
  { month: "Sep '25", total: 19, weather: 6, portCongestion: 6, documentation: 4, customs: 3 },
  { month: "Oct '25", total: 22, weather: 7, portCongestion: 7, documentation: 5, customs: 3 },
  { month: "Nov '25", total: 20, weather: 6, portCongestion: 6, documentation: 5, customs: 3 },
  { month: "Dec '25", total: 28, weather: 10, portCongestion: 8, documentation: 6, customs: 4 },
  { month: "Jan '26", total: 24, weather: 9, portCongestion: 7, documentation: 5, customs: 3 },
  { month: "Feb '26", total: 17, weather: 5, portCongestion: 5, documentation: 4, customs: 3 },
  { month: "Mar '26", total: 15, weather: 4, portCongestion: 5, documentation: 4, customs: 2 },
  { month: "Apr '26", total: 19, weather: 5, portCongestion: 6, documentation: 5, customs: 3 },
  { month: "May '26", total: 23, weather: 7, portCongestion: 7, documentation: 5, customs: 4 },
]

export const TOTAL_DELAYED_12M = DELAYED_MONTHLY_DATA.reduce((s, d) => s + d.total, 0)

// Vessel Fleet — Monthly Data (last 12 months)
export const VESSEL_MONTHLY_DATA = [
  { month: "Jun '25", active: 148, maintenance: 6, retired: 1, usedPurchase: 0, newPurchase: 0 },
  { month: "Jul '25", active: 150, maintenance: 5, retired: 0, usedPurchase: 2, newPurchase: 0 },
  { month: "Aug '25", active: 151, maintenance: 7, retired: 1, usedPurchase: 1, newPurchase: 0 },
  { month: "Sep '25", active: 152, maintenance: 5, retired: 0, usedPurchase: 0, newPurchase: 1 },
  { month: "Oct '25", active: 153, maintenance: 6, retired: 0, usedPurchase: 1, newPurchase: 0 },
  { month: "Nov '25", active: 151, maintenance: 8, retired: 1, usedPurchase: 0, newPurchase: 0 },
  { month: "Dec '25", active: 150, maintenance: 9, retired: 0, usedPurchase: 0, newPurchase: 0 },
  { month: "Jan '26", active: 152, maintenance: 7, retired: 0, usedPurchase: 2, newPurchase: 0 },
  { month: "Feb '26", active: 153, maintenance: 6, retired: 0, usedPurchase: 0, newPurchase: 1 },
  { month: "Mar '26", active: 155, maintenance: 5, retired: 1, usedPurchase: 1, newPurchase: 1 },
  { month: "Apr '26", active: 154, maintenance: 6, retired: 0, usedPurchase: 0, newPurchase: 0 },
  { month: "May '26", active: 156, maintenance: 5, retired: 0, usedPurchase: 0, newPurchase: 2 },
]
