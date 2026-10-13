export type TicketStatus = 'new' | 'work' | 'closed'

export interface Department {
  id: string
  name: string
}

export interface ActivityItem {
  at: string
  text: string
  topic: string
  category: 'dining' | 'activity' | 'arrival' | 'request' | 'spa'
}

export interface StayNote {
  text: string
  source: string
}

export interface Guest {
  id: string
  name: string
  room: string
  arrival: string
  departure: string
  vip?: boolean
  preferences: string[]
  stayNotes: StayNote[]
  activity: ActivityItem[]
}

export interface Note {
  id: string
  author: string
  at: string
  text: string
  source: 'staff' | 'guest-memory'
}

export interface Ticket {
  id: string
  title: string
  description: string
  room: string
  guestId: string | null
  guestName: string
  departmentId: string
  status: TicketStatus
  assignee: string | null
  dueAt: string
  code: string
  notes: Note[]
}

export interface Tip {
  id: string
  category: string
  text: string
  basedOn: string
}

export type RoomStatus = 'dirty' | 'clean' | 'inspected' | 'skip'

export interface HkRoom {
  room: string
  attendant: string
  status: RoomStatus
  credit: number
  section: string
}
