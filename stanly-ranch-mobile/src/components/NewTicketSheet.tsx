import { useState } from 'react'
import { DEPARTMENTS, GUESTS, TICKET_TYPES } from '../data'
import type { Ticket } from '../types'
import { uid } from '../utils'
import { CloseIcon } from './icons'

interface Props {
  departmentId: string
  onCreate: (t: Ticket) => void
  onClose: () => void
  variant?: 'sheet' | 'modal'
  internal?: boolean
}

export function NewTicketSheet({ departmentId, onCreate, onClose, variant = 'sheet', internal = false }: Props) {
  const [dept, setDept] = useState(departmentId)
  const [title, setTitle] = useState(TICKET_TYPES[departmentId][0])
  const [guestId, setGuestId] = useState(GUESTS[0].id)
  const [details, setDetails] = useState('')
  const [dueIn, setDueIn] = useState(30)
  const [location, setLocation] = useState('')

  const guest = GUESTS.find((g) => g.id === guestId)!

  const changeDept = (id: string) => {
    setDept(id)
    setTitle(TICKET_TYPES[id][0])
  }

  const submit = () => {
    onCreate({
      id: uid(),
      title,
      description: details.trim() || 'No additional details.',
      room: internal ? location.trim() || 'Property' : guest.room,
      guestId: internal ? null : guest.id,
      guestName: internal ? 'Internal' : guest.name,
      departmentId: dept,
      status: 'new',
      assignee: null,
      dueAt: new Date(Date.now() + dueIn * 60_000).toISOString(),
      code: '',
      notes: [],
    })
  }

  return (
    <div className={`overlay ${variant === 'modal' ? 'overlay--center' : ''}`} onClick={onClose}>
      <div className={`sheet ${variant === 'modal' ? 'sheet--modal' : ''}`} onClick={(e) => e.stopPropagation()}>
        <i className="sheet__grab" />
        <div className="sheet__head">
          <h2>{internal ? 'Internal request' : 'Guest request'}</h2>
          <button className="icon-btn icon-btn--dark" onClick={onClose} aria-label="Close">
            <CloseIcon size={22} />
          </button>
        </div>

        <label>
          Department
          <select value={dept} onChange={(e) => changeDept(e.target.value)}>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        <label>
          Request
          <select value={title} onChange={(e) => setTitle(e.target.value)}>
            {TICKET_TYPES[dept].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        {internal ? (
          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Front lawn, Barn, Spa..." />
          </label>
        ) : (
          <label>
            Room / guest
            <select value={guestId} onChange={(e) => setGuestId(e.target.value)}>
              {GUESTS.map((g) => (
                <option key={g.id} value={g.id}>{g.room} - {g.name}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          Due in
          <select value={dueIn} onChange={(e) => setDueIn(Number(e.target.value))}>
            {[15, 30, 60, 120].map((m) => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </select>
        </label>
        <label>
          Details
          <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Pick up From:: , Drop Off At:: " />
        </label>

        <button className="btn btn--block" onClick={submit}>Create ticket</button>
      </div>
    </div>
  )
}
