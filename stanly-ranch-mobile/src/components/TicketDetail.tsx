import { useState } from 'react'
import { DEPARTMENTS, GUESTS, ME, STAFF } from '../data'
import type { Note, Ticket } from '../types'
import { STATUS_LABEL, formatTime, uid } from '../utils'
import { Avatar } from './Avatar'
import { BackIcon } from './icons'
import { GuestMemory } from './GuestMemory'

interface Props {
  ticket: Ticket
  onBack: () => void
  onAccept: () => void
  onStatus: (status: Ticket['status']) => void
  onAssign: (assignee: string | null) => void
  onAddNote: (note: Note) => void
}

export function TicketBody({ ticket, onAccept, onStatus, onAssign, onAddNote }: Omit<Props, 'onBack'>) {
  const [text, setText] = useState('')
  const guest = GUESTS.find((g) => g.id === ticket.guestId)
  const addNote = (body: string, source: Note['source']) =>
    onAddNote({ id: uid(), author: ME, at: new Date().toISOString(), text: body, source })

  const submit = () => {
    if (!text.trim()) return
    addNote(text.trim(), 'staff')
    setText('')
  }

  return (
    <>
        <div className="hero">
          <span className={`pill pill--${ticket.status}`}>{STATUS_LABEL[ticket.status]}</span>
          <h1 className="hero__title">{ticket.title}</h1>
          <p className="hero__desc">{ticket.description}</p>
        </div>

        <div className="group">
          <div className="group__row"><span>Room</span><b>{ticket.room}</b></div>
          <div className="group__row"><span>Guest</span><b>{ticket.guestName}</b></div>
          <div className="group__row"><span>Due</span><b>{formatTime(ticket.dueAt)}</b></div>
          <div className="group__row">
            <span>Assigned</span>
            <span className="assign">
              {ticket.assignee && <Avatar name={ticket.assignee} size={22} />}
              <select value={ticket.assignee ?? ''} onChange={(e) => onAssign(e.target.value || null)}>
                <option value="">Unassigned</option>
                {STAFF.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </span>
          </div>
        </div>

        <div className="actions">
          {ticket.status === 'new' && <button className="btn btn--block" onClick={onAccept}>Accept ticket</button>}
          {ticket.status === 'work' && <button className="btn btn--block" onClick={() => onStatus('closed')}>Mark complete</button>}
          {ticket.status === 'closed' && (
            <button className="btn btn--soft btn--block" onClick={() => onStatus('work')}>Reopen ticket</button>
          )}
        </div>

        {guest && (
          <div className="panel">
            <GuestMemory guest={guest} onSaveNote={(t) => addNote(t, 'guest-memory')} />
          </div>
        )}

        <div className="panel">
          <h3 className="section-title">Staff notes</h3>
          {ticket.notes.length === 0 && <p className="muted">No notes yet.</p>}
          {ticket.notes.map((n) => (
            <div key={n.id} className={`note ${n.source === 'guest-memory' ? 'note--memory' : ''}`}>
              <div className="note__head">
                <b>{n.author}</b>
                <span>{formatTime(n.at)}</span>
              </div>
              <p>{n.text}</p>
            </div>
          ))}
          <div className="note-form">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Add a note"
            />
            <button className="btn" onClick={submit} disabled={!text.trim()}>Add</button>
          </div>
        </div>
    </>
  )
}

export function TicketDetail(props: Props) {
  const dept = DEPARTMENTS.find((d) => d.id === props.ticket.departmentId)
  return (
    <div className="page">
      <header className="nav">
        <button className="nav__back" onClick={props.onBack}>
          <BackIcon size={22} /> Tickets
        </button>
        <span className="nav__title">{dept?.name}</span>
        <span className="nav__spacer" />
      </header>
      <div className="page__body">
        <TicketBody {...props} />
      </div>
    </div>
  )
}
