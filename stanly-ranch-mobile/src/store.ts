import { useCallback, useEffect, useReducer, useState } from 'react'
import { ME, seedRooms, seedTickets } from './data'
import type { HkRoom, Note, RoomStatus, Ticket, TicketStatus } from './types'

const KEY = 'stn-tickets-v3'
const FRESH_MS = 3 * 3600_000
let seededAt = Date.now()

type Action =
  | { type: 'create'; ticket: Ticket }
  | { type: 'accept'; id: string }
  | { type: 'setStatus'; id: string; status: TicketStatus }
  | { type: 'assign'; id: string; assignee: string | null }
  | { type: 'addNote'; id: string; note: Note }
  | { type: 'reset' }

function load(): Ticket[] {
  try {
    const raw = localStorage.getItem(KEY)
    // Demo due times are relative to when they were seeded, so start fresh after a few hours
    const saved = raw ? (JSON.parse(raw) as { seededAt: number; tickets: Ticket[] }) : null
    if (saved && Date.now() - saved.seededAt < FRESH_MS) {
      seededAt = saved.seededAt
      return saved.tickets
    }
  } catch {
    // fall through to seed data
  }
  return seedTickets()
}

function reducer(state: Ticket[], a: Action): Ticket[] {
  const patch = (id: string, fn: (t: Ticket) => Ticket) => state.map((t) => (t.id === id ? fn(t) : t))
  switch (a.type) {
    case 'create':
      return [a.ticket, ...state]
    case 'accept':
      return patch(a.id, (t) => ({ ...t, status: 'work', assignee: ME }))
    case 'setStatus':
      return patch(a.id, (t) => ({ ...t, status: a.status }))
    case 'assign':
      return patch(a.id, (t) => ({
        ...t,
        assignee: a.assignee,
        status: a.assignee && t.status === 'new' ? 'work' : t.status,
      }))
    case 'addNote':
      return patch(a.id, (t) => ({ ...t, notes: [...t.notes, a.note] }))
    case 'reset':
      return seedTickets()
  }
}

export function useTickets() {
  const [tickets, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ seededAt, tickets }))
  }, [tickets])

  return { tickets, dispatch }
}

const ROOMS_KEY = 'stn-rooms-v1'

function loadRooms(): HkRoom[] {
  try {
    const raw = localStorage.getItem(ROOMS_KEY)
    if (raw) return JSON.parse(raw) as HkRoom[]
  } catch {
    // fall through to seed data
  }
  return seedRooms()
}

export function useWorkspace() {
  const { tickets, dispatch } = useTickets()
  const [rooms, setRooms] = useState(loadRooms)

  useEffect(() => {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
  }, [rooms])

  const setRoomStatus = useCallback(
    (room: string, status: RoomStatus) =>
      setRooms((rs) => rs.map((r) => (r.room === room ? { ...r, status } : r))),
    [],
  )

  const reset = useCallback(() => {
    seededAt = Date.now()
    dispatch({ type: 'reset' })
    setRooms(seedRooms())
  }, [dispatch])

  return { tickets, dispatch, rooms, setRoomStatus, reset }
}

export type Workspace = ReturnType<typeof useWorkspace>
