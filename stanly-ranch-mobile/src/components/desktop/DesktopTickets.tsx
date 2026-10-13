import { useMemo, useState } from 'react'
import { DEPARTMENTS, ME } from '../../data'
import type { Workspace } from '../../store'
import type { Ticket } from '../../types'
import { STATUS_LABEL, formatRemaining, formatTime, sameDay } from '../../utils'
import { Avatar } from '../Avatar'
import { CloseIcon, PlusIcon, SearchIcon } from '../icons'
import { NewTicketSheet } from '../NewTicketSheet'
import { TicketBody } from '../TicketDetail'
import { MiniCalendar } from './MiniCalendar'
import type { DesktopTab } from './DesktopApp'

type Filter = { kind: 'all' } | { kind: 'dept'; id: string } | { kind: 'pending' } | { kind: 'mine' }

interface Props {
  ws: Workspace
  now: number
  onNav: (tab: DesktopTab) => void
}

const filterLabel = (f: Filter) => {
  switch (f.kind) {
    case 'dept':
      return DEPARTMENTS.find((d) => d.id === f.id)?.name ?? ''
    case 'pending':
      return 'Pending Tickets'
    case 'mine':
      return 'My Tickets'
    default:
      return ''
  }
}

const isActive = (a: Filter, b: Filter) => a.kind === b.kind && (a.kind !== 'dept' || a.id === (b as typeof a).id)

function dueTone(t: Ticket, now: number) {
  if (t.status === 'closed') return null
  const mins = (new Date(t.dueAt).getTime() - now) / 60_000
  return mins < 10 ? 'hot' : mins < 60 ? 'warm' : 'calm'
}

export function DesktopTickets({ ws, now, onNav }: Props) {
  const { tickets, dispatch, reset } = ws
  const today = useMemo(() => new Date(now), [now])

  const [filter, setFilter] = useState<Filter>({ kind: 'dept', id: 'bell' })
  const [date, setDate] = useState<Date | null>(() => new Date())
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modal, setModal] = useState<'guest' | 'internal' | null>(null)

  const byFilter = tickets.filter((t) => {
    switch (filter.kind) {
      case 'dept':
        return t.departmentId === filter.id
      case 'pending':
        return t.status === 'new'
      case 'mine':
        return t.assignee === ME
      default:
        return true
    }
  })

  const marked = useMemo(() => new Set(byFilter.map((t) => new Date(t.dueAt).toDateString())), [byFilter])

  const q = query.trim().toLowerCase()
  const rows = byFilter
    .filter((t) => !date || sameDay(new Date(t.dueAt), date))
    .filter(
      (t) =>
        !q ||
        [t.title, t.description, t.room, t.guestName, t.assignee ?? ''].some((s) => s.toLowerCase().includes(q)),
    )
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())

  const selected = tickets.find((t) => t.id === selectedId)
  const hasChips = date !== null || filter.kind !== 'all'

  const saved: { label: string; f: Filter }[] = [
    ...DEPARTMENTS.map((d) => ({ label: d.name, f: { kind: 'dept', id: d.id } as Filter })),
    { label: 'Pending Tickets', f: { kind: 'pending' } },
    { label: 'My Tickets', f: { kind: 'mine' } },
  ]

  return (
    <div className="dpage">
      <aside className="dside">
        <MiniCalendar selected={date} today={today} marked={marked} onSelect={setDate} />

        <h4 className="dside__title">Saved Filters</h4>
        <ul className="dside__list">
          {saved.map(({ label, f }) => (
            <li key={label}>
              <button className={isActive(filter, f) ? 'on' : ''} onClick={() => setFilter(f)}>{label}</button>
            </li>
          ))}
        </ul>

        <h4 className="dside__title">Quick Links</h4>
        <ul className="dside__list">
          <li><button onClick={() => onNav('rooms')}>Housekeeping board</button></li>
          <li><button onClick={() => onNav('guests')}>Guest memory</button></li>
          <li><button onClick={reset}>Reset demo data</button></li>
        </ul>
      </aside>

      <section className="dmain">
        <div className="dtoolbar">
          <button className="dbtn dbtn--outline" onClick={() => setModal('guest')}>
            <PlusIcon size={14} /> Guest Request
          </button>
          <button className="dbtn dbtn--outline" onClick={() => setModal('internal')}>
            <PlusIcon size={14} /> Internal Request
          </button>
          <span className="dtoolbar__spacer" />
          <div className="seg dseg">
            <button className={date === null ? 'on' : ''} onClick={() => setDate(null)}>All Time</button>
            <button className={date && sameDay(date, today) ? 'on' : ''} onClick={() => setDate(new Date())}>Today</button>
          </div>
          {searching ? (
            <label className="dsearch">
              <SearchIcon size={16} />
              <input autoFocus placeholder="Search tickets" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button
                aria-label="Close search"
                onClick={() => {
                  setSearching(false)
                  setQuery('')
                }}
              >
                <CloseIcon size={14} />
              </button>
            </label>
          ) : (
            <button className="dbtn dbtn--ghost" onClick={() => setSearching(true)}>
              <SearchIcon size={16} /> Search Tickets
            </button>
          )}
        </div>

        <div className="dchips">
          {hasChips && <span className="dchips__label">Filtered by:</span>}
          {date && (
            <span className="dchip">
              Due Date {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              <button aria-label="Remove date filter" onClick={() => setDate(null)}><CloseIcon size={12} /></button>
            </span>
          )}
          {filter.kind !== 'all' && (
            <span className="dchip">
              {filterLabel(filter)}
              <button aria-label="Remove filter" onClick={() => setFilter({ kind: 'all' })}><CloseIcon size={12} /></button>
            </span>
          )}
          {hasChips && (
            <button
              className="dchips__clear"
              onClick={() => {
                setDate(null)
                setFilter({ kind: 'all' })
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="dtable-wrap">
          <table className="dtable">
            <thead>
              <tr>
                <th>Due</th>
                <th>In</th>
                <th>For</th>
                <th>Room</th>
                <th>Summary</th>
                <th>Assigned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const tone = dueTone(t, now)
                return (
                  <tr
                    key={t.id}
                    className={`trow trow--${t.status} ${t.id === selectedId ? 'sel' : ''}`}
                    onClick={() => setSelectedId(t.id)}
                  >
                    <td className="trow__time">{formatTime(t.dueAt)}</td>
                    <td>{tone && <span className={`due due--${tone}`}>{formatRemaining(t.dueAt, now)}</span>}</td>
                    <td className="trow__for">
                      {t.guestName}
                      {t.code && <span className="code">{t.code}</span>}
                    </td>
                    <td className="trow__room">{t.room}</td>
                    <td className="trow__sum">
                      <b>{t.title}</b>
                      <span>{t.description}</span>
                    </td>
                    <td>
                      {t.assignee ? (
                        <span className="trow__who"><Avatar name={t.assignee} size={22} />{t.assignee}</span>
                      ) : (
                        <span className="trow__none">Unassigned</span>
                      )}
                    </td>
                    <td><span className={`pill pill--${t.status}`}>{STATUS_LABEL[t.status]}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="empty">
              <b>All clear</b>
              <span>No tickets match these filters.</span>
            </div>
          )}
        </div>
        <div className="dfoot">Total Tickets: {rows.length}</div>
      </section>

      {selected && (
        <aside className="dpanel">
          <div className="dpanel__head">
            <span>Ticket details</span>
            <button className="icon-btn" onClick={() => setSelectedId(null)} aria-label="Close details">
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="dpanel__body">
            <TicketBody
              ticket={selected}
              onAccept={() => dispatch({ type: 'accept', id: selected.id })}
              onStatus={(status) => dispatch({ type: 'setStatus', id: selected.id, status })}
              onAssign={(assignee) => dispatch({ type: 'assign', id: selected.id, assignee })}
              onAddNote={(note) => dispatch({ type: 'addNote', id: selected.id, note })}
            />
          </div>
        </aside>
      )}

      {modal && (
        <NewTicketSheet
          variant="modal"
          internal={modal === 'internal'}
          departmentId={filter.kind === 'dept' ? filter.id : 'bell'}
          onClose={() => setModal(null)}
          onCreate={(ticket) => {
            dispatch({ type: 'create', ticket })
            setModal(null)
            setSelectedId(ticket.id)
            if (filter.kind === 'dept') setFilter({ kind: 'dept', id: ticket.departmentId })
          }}
        />
      )}
    </div>
  )
}
