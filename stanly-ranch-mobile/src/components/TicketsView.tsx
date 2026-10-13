import { useState } from 'react'
import { ME } from '../data'
import type { Ticket } from '../types'
import { sameDay } from '../utils'
import { ArrowDownIcon, ArrowUpIcon } from './icons'
import { TicketCard } from './TicketCard'

interface Props {
  tickets: Ticket[]
  query: string
  now: number
  onOpen: (id: string) => void
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: [T, string][]
  onChange: (v: T) => void
}) {
  return (
    <div className="seg" role="tablist">
      {options.map(([v, label]) => (
        <button key={v} role="tab" aria-selected={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  )
}

export function TicketsView({ tickets, query, now, onOpen }: Props) {
  const [scope, setScope] = useState<'mine' | 'all'>('all')
  const [state, setState] = useState<'open' | 'closed'>('open')
  const [ascending, setAscending] = useState(true)
  const [days, setDays] = useState<'today' | 'all'>('today')

  const today = new Date(now)
  const q = query.trim().toLowerCase()

  const visible = tickets
    .filter((t) => (scope === 'mine' ? t.assignee === ME : true))
    .filter((t) => (state === 'open' ? t.status !== 'closed' : t.status === 'closed'))
    .filter((t) => days === 'all' || sameDay(new Date(t.dueAt), today))
    .filter(
      (t) =>
        !q ||
        [t.title, t.description, t.room, t.guestName, t.assignee ?? ''].some((s) => s.toLowerCase().includes(q)),
    )
    .sort((a, b) => (ascending ? 1 : -1) * (new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()))

  return (
    <>
      <div className="filters">
        <Segmented value={scope} onChange={setScope} options={[['mine', 'Mine'], ['all', 'All']]} />
        <Segmented value={state} onChange={setState} options={[['open', 'Open'], ['closed', 'Closed']]} />
      </div>

      <div className="subfilters">
        <button className="chip-btn" onClick={() => setAscending((v) => !v)}>
          {ascending ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
          {ascending ? 'Due soonest' : 'Due latest'}
        </button>
        <Segmented value={days} onChange={setDays} options={[['today', 'Today'], ['all', 'All days']]} />
      </div>

      <div className="list">
        {visible.length === 0 ? (
          <div className="empty">
            <b>All clear</b>
            <span>No tickets match these filters.</span>
          </div>
        ) : (
          visible.map((t) => <TicketCard key={t.id} ticket={t} now={now} onOpen={onOpen} />)
        )}
      </div>
    </>
  )
}
