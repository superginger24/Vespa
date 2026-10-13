import { GUESTS } from '../data'
import type { Ticket } from '../types'
import { formatTime } from '../utils'
import { BackIcon, ChevronRightIcon } from './icons'
import { GuestMemory } from './GuestMemory'

interface Props {
  guestId: string
  tickets: Ticket[]
  onBack: () => void
  onOpenTicket: (id: string) => void
}

export function GuestPage({ guestId, tickets, onBack, onOpenTicket }: Props) {
  const guest = GUESTS.find((g) => g.id === guestId)
  if (!guest) return null
  const open = tickets.filter((t) => t.guestId === guestId && t.status !== 'closed')

  return (
    <div className="page">
      <header className="nav">
        <button className="nav__back" onClick={onBack}>
          <BackIcon size={22} /> Rooms
        </button>
        <span className="nav__title">Room {guest.room}</span>
        <span className="nav__spacer" />
      </header>
      <div className="page__body">
        <div className="panel">
          <GuestMemory guest={guest} />
        </div>
        <div className="panel">
          <h3 className="section-title">Open tickets</h3>
          {open.length === 0 && <p className="muted">No open tickets for this guest.</p>}
          {open.map((t) => (
            <button key={t.id} className="linkrow" onClick={() => onOpenTicket(t.id)}>
              <span>
                {t.title}
                <small>Due {formatTime(t.dueAt)}</small>
              </span>
              <ChevronRightIcon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
