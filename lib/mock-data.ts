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
