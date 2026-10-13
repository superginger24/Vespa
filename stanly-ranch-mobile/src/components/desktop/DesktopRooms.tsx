import { useState } from 'react'
import { GUESTS, HK_ATTENDANTS, HK_TARGET } from '../../data'
import type { Workspace } from '../../store'
import type { HkRoom, RoomStatus } from '../../types'
import { formatDate, formatTime } from '../../utils'
import { CloseIcon, SearchIcon } from '../icons'
import { GuestMemory } from '../GuestMemory'

const STATUSES: { id: RoomStatus; label: string }[] = [
  { id: 'dirty', label: 'Dirty' },
  { id: 'clean', label: 'Clean' },
  { id: 'inspected', label: 'Inspected' },
  { id: 'skip', label: 'Skip' },
]

const PersonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0z" />
  </svg>
)

export function DesktopRooms({ ws, now }: { ws: Workspace; now: number }) {
  const { rooms, tickets, setRoomStatus } = ws
  const [selected, setSelected] = useState<string | null>(null)
  const [spotlight, setSpotlight] = useState<string | null>(null)

  const guestByRoom = new Map(GUESTS.map((g) => [g.room, g]))
  const q = (spotlight ?? '').trim().toLowerCase()
  const matches = (r: HkRoom) =>
    !q || r.room.toLowerCase().includes(q) || (guestByRoom.get(r.room)?.name.toLowerCase().includes(q) ?? false)

  const groups = HK_ATTENDANTS.map((name) => ({ name, rooms: rooms.filter((r) => r.attendant === name) })).filter(
    (g) => g.rooms.length > 0,
  )

  const room = rooms.find((r) => r.room === selected)
  const guest = room ? guestByRoom.get(room.room) : undefined
  const roomTickets = room ? tickets.filter((t) => t.room === room.room && t.status !== 'closed') : []

  return (
    <div className="dpage dpage--board">
      <section className="dmain dmain--board">
        <div className="dboard__bar">
          <h2>{formatDate(new Date(now))} Boards ({groups.length})</h2>
          {spotlight === null ? (
            <button className="dbtn dbtn--outline" onClick={() => setSpotlight('')}>
              <SearchIcon size={14} /> Spotlight
            </button>
          ) : (
            <label className="dsearch">
              <SearchIcon size={16} />
              <input autoFocus placeholder="Room or guest" value={spotlight} onChange={(e) => setSpotlight(e.target.value)} />
              <button aria-label="Close spotlight" onClick={() => setSpotlight(null)}>
                <CloseIcon size={14} />
              </button>
            </label>
          )}
        </div>

        <div className="dtable-wrap">
          <div className="board">
            <div className="board__row board__row--head">
              <span>Assigned to</span>
              <span>Assigned</span>
              <span>Dirty</span>
              <span>Clean</span>
              <span>Inspected</span>
              <span>Skip</span>
              <span>Sections</span>
            </div>

            {groups.map(({ name, rooms: rs }) => {
              const count = (s: RoomStatus) => rs.filter((r) => r.status === s).length
              const credit = rs.reduce((n, r) => n + r.credit, 0)
              const sections = [...new Set(rs.map((r) => r.section))].join(', ')
              return (
                <div key={name} className="board__row">
                  <div className="board__who">
                    <b>{name}</b>
                    <div className="board__chips">
                      {rs.map((r) => (
                        <button
                          key={r.room}
                          className={`rchip rchip--${r.status} ${r.room === selected ? 'sel' : ''} ${matches(r) ? '' : 'rchip--dim'}`}
                          onClick={() => setSelected(r.room)}
                          title={guestByRoom.get(r.room)?.name ?? 'Vacant'}
                        >
                          {guestByRoom.has(r.room) && <PersonIcon />}
                          {r.room}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className={credit > HK_TARGET ? 'board__over' : ''}>{credit}/{HK_TARGET}</span>
                  <span>{count('dirty')}</span>
                  <span>{count('clean')}</span>
                  <span>{count('inspected')}</span>
                  <span>{count('skip')}</span>
                  <span className="board__sections">{sections}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="dfoot">
          <span className="legend legend--dirty">Dirty</span>
          <span className="legend legend--clean">Clean</span>
          <span className="legend legend--inspected">Inspected</span>
          <span className="legend legend--skip">Skip</span>
          <span className="legend__occ"><PersonIcon /> Guest in house</span>
        </div>
      </section>

      {room && (
        <aside className="dpanel">
          <div className="dpanel__head">
            <span>Room {room.room}</span>
            <button className="icon-btn" onClick={() => setSelected(null)} aria-label="Close room">
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="dpanel__body">
            <div className="group">
              <div className="group__row"><span>Attendant</span><b>{room.attendant}</b></div>
              <div className="group__row"><span>Section</span><b>{room.section}</b></div>
              <div className="group__row"><span>Credit</span><b>{room.credit}</b></div>
              <div className="group__row"><span>Guest</span><b>{guest?.name ?? 'Vacant'}</b></div>
            </div>

            <div className="seg seg--wrap">
              {STATUSES.map((s) => (
                <button key={s.id} className={room.status === s.id ? 'on' : ''} onClick={() => setRoomStatus(room.room, s.id)}>
                  {s.label}
                </button>
              ))}
            </div>

            {roomTickets.length > 0 && (
              <div className="panel">
                <h3 className="section-title">Open tickets</h3>
                {roomTickets.map((t) => (
                  <div key={t.id} className="linkrow">
                    <span>
                      {t.title}
                      <small>Due {formatTime(t.dueAt)}</small>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {guest && (
              <div className="panel">
                <GuestMemory guest={guest} />
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
