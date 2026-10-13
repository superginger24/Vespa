import { useState } from 'react'
import { ME } from '../../data'
import type { Workspace } from '../../store'
import { Avatar } from '../Avatar'
import { BrandMark } from '../icons'
import { DesktopGuests } from './DesktopGuests'
import { DesktopRooms } from './DesktopRooms'
import { DesktopTickets } from './DesktopTickets'

export type DesktopTab = 'tickets' | 'rooms' | 'guests'

const TABS: { id: DesktopTab; label: string }[] = [
  { id: 'tickets', label: 'Tickets' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'guests', label: 'Guests' },
]

export function DesktopApp({ ws, now }: { ws: Workspace; now: number }) {
  const [tab, setTab] = useState<DesktopTab>('tickets')

  return (
    <div className="desk">
      <nav className="dnav">
        <span className="dnav__brand">
          <BrandMark size={26} />
          Stanly Ranch
        </span>
        <div className="dnav__tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <span className="dnav__user">
          <span className="demo-tag">Demo data</span>
          <Avatar name={ME} size={28} />
          {ME}
        </span>
      </nav>

      {tab === 'tickets' && <DesktopTickets ws={ws} now={now} onNav={setTab} />}
      {tab === 'rooms' && <DesktopRooms ws={ws} now={now} />}
      {tab === 'guests' && <DesktopGuests ws={ws} />}
    </div>
  )
}
