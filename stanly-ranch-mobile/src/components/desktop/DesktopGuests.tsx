import { useState } from 'react'
import { GUESTS } from '../../data'
import type { Workspace } from '../../store'
import { formatTime, makeNote } from '../../utils'
import { GuestMemory } from '../GuestMemory'
import { SearchIcon } from '../icons'

const fmt = (iso: string) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })

export function DesktopGuests({ ws }: { ws: Workspace }) {
  const { tickets, dispatch } = ws
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(GUESTS[0].id)

  const q = query.trim().toLowerCase()
  const list = GUESTS.filter((g) => !q || g.name.toLowerCase().includes(q) || g.room.toLowerCase().includes(q))
  const guest = GUESTS.find((g) => g.id === selectedId) ?? GUESTS[0]

  const open = tickets
    .filter((t) => t.guestId === guest.id && t.status !== 'closed')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
  const target = open[0]

  const saveStarter = (text: string) => {
    if (!target) return
    dispatch({ type: 'addNote', id: target.id, note: makeNote(text, 'guest-memory') })
  }

  return (
    <div className="dpage">
      <aside className="dside dside--guests">
        <label className="dsearch dsearch--block">
          <SearchIcon size={16} />
          <input placeholder="Search guests or rooms" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <ul className="dside__list dside__list--guests">
          {list.map((g) => (
            <li key={g.id}>
              <button className={g.id === guest.id ? 'on' : ''} onClick={() => setSelectedId(g.id)}>
                <b>{g.name}{g.vip && <span className="vip">VIP</span>}</b>
                <small>Room {g.room} · {fmt(g.arrival)} – {fmt(g.departure)}</small>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="muted">No guests match.</li>}
        </ul>
      </aside>

      <section className="dmain dmain--scroll">
        <div className="dguest">
          <div className="panel">
            <GuestMemory
              guest={guest}
              saveHint={target ? `Saved starters go to the staff notes on "${target.title}" (Room ${target.room}).` : undefined}
              onSaveNote={target ? saveStarter : undefined}
            />
          </div>
          <div className="panel">
            <h3 className="section-title">Open tickets</h3>
            {open.length === 0 && <p className="muted">No open tickets for this guest.</p>}
            {open.map((t) => (
              <div key={t.id} className="linkrow">
                <span>
                  {t.title}
                  <small>{t.description}</small>
                </span>
                <span className="muted">Due {formatTime(t.dueAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
