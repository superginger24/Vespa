import type { Ticket } from '../types'
import { DEPARTMENTS } from '../data'
import { STATUS_LABEL, formatRemaining, formatTime } from '../utils'
import { Avatar } from './Avatar'
import { DepartmentIcon, NoteIcon } from './icons'

interface Props {
  ticket: Ticket
  now: number
  onOpen: (id: string) => void
}

function dueTone(ticket: Ticket, now: number) {
  if (ticket.status === 'closed') return null
  const mins = (new Date(ticket.dueAt).getTime() - now) / 60_000
  if (mins < 10) return 'hot'
  if (mins < 60) return 'warm'
  return 'calm'
}

export function TicketCard({ ticket, now, onOpen }: Props) {
  const tone = dueTone(ticket, now)
  const dept = DEPARTMENTS.find((d) => d.id === ticket.departmentId)

  return (
    <button className="ticket" onClick={() => onOpen(ticket.id)}>
      <span className="ticket__head">
        <span className="ticket__icon" title={dept?.name}>
          <DepartmentIcon id={ticket.departmentId} />
        </span>
        <span className="ticket__titles">
          <span className="ticket__title">{ticket.title}</span>
          <span className="ticket__sub">
            <b>{ticket.room}</b> · {ticket.guestName}
          </span>
        </span>
        <span className={`pill pill--${ticket.status}`}>{STATUS_LABEL[ticket.status]}</span>
      </span>

      <span className="ticket__desc">{ticket.description}</span>

      <span className="ticket__foot">
        {ticket.assignee ? (
          <span className="ticket__who">
            <Avatar name={ticket.assignee} />
            {ticket.assignee}
          </span>
        ) : (
          <span className="ticket__who ticket__who--none">Unassigned</span>
        )}

        <span className="ticket__meta">
          {ticket.notes.length > 0 && (
            <span className="ticket__notes">
              <NoteIcon size={16} />
              {ticket.notes.length}
            </span>
          )}
          {ticket.code && <span className="code">{ticket.code}</span>}
          <span className="ticket__due">{formatTime(ticket.dueAt)}</span>
          {tone && <span className={`due due--${tone}`}>{formatRemaining(ticket.dueAt, now)}</span>}
        </span>
      </span>
    </button>
  )
}
