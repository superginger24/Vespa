import { GUESTS } from '../data'
import type { Ticket } from '../types'
import { ChevronRightIcon } from './icons'

interface Props {
  tickets: Ticket[]
  query: string
  onOpenGuest: (guestId: string) => void
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })

export function RoomsView({ tickets, query, onOpenGuest }: Props) {
  const q = query.trim().toLowerCase()
  const rooms = GUESTS.filter((g) => !q || g.name.toLowerCase().includes(q) || g.room.toLowerCase().includes(q)).sort(
    (a, b) => a.room.localeCompare(b.room, undefined, { numeric: true }),
  )

  return (
    <div className="list">
      {rooms.length === 0 && (
        <div className="empty">
          <b>No matches</b>
          <span>Try a room number or guest name.</span>
        </div>
      )}
      {rooms.map((g) => {
        const open = tickets.filter((t) => t.guestId === g.id && t.status !== 'closed').length
        return (
          <button key={g.id} className="room" onClick={() => onOpenGuest(g.id)}>
            <span className="room__num">{g.room}</span>
            <span className="room__main">
              <span className="room__name">
                {g.name}
                {g.vip && <span className="vip">VIP</span>}
              </span>
              <span className="room__sub">
                {fmt(g.arrival)} – {fmt(g.departure)}
                {open > 0 && ` · ${open} open ${open === 1 ? 'ticket' : 'tickets'}`}
              </span>
            </span>
            <ChevronRightIcon size={18} className="room__chev" />
          </button>
        )
      })}
    </div>
  )
}
