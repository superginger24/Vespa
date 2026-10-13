import { useState } from 'react'
import { DEPARTMENTS, GUESTS, ME } from '../data'
import type { Workspace } from '../store'
import { BrandMark, CaretIcon, CloseIcon, DoorIcon, MenuIcon, PlusIcon, SearchIcon, TicketsIcon } from './icons'
import { GuestPage } from './GuestPage'
import { NewTicketSheet } from './NewTicketSheet'
import { RoomsView } from './RoomsView'
import { TicketDetail } from './TicketDetail'
import { TicketsView } from './TicketsView'

type Tab = 'rooms' | 'tickets'

export function MobileApp({ ws, now }: { ws: Workspace; now: number }) {
  const { tickets, dispatch, reset } = ws

  const [tab, setTab] = useState<Tab>('tickets')
  const [deptId, setDeptId] = useState('bell')
  const [deptMenu, setDeptMenu] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [guestId, setGuestId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const dept = DEPARTMENTS.find((d) => d.id === deptId)!
  const deptTickets = tickets.filter((t) => t.departmentId === deptId)
  const openTicket = tickets.find((t) => t.id === ticketId)
  const onDetail = Boolean(openTicket || guestId)

  const closeSearch = () => {
    setSearching(false)
    setQuery('')
  }

  const switchTab = (next: Tab) => {
    setTab(next)
    setDeptMenu(false)
    closeSearch()
  }

  const eyebrow =
    tab === 'tickets'
      ? new Date(now).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      : `${GUESTS.length} guests in house`

  return (
    <div className="app">
      {openTicket ? (
        <TicketDetail
          ticket={openTicket}
          onBack={() => setTicketId(null)}
          onAccept={() => dispatch({ type: 'accept', id: openTicket.id })}
          onStatus={(status) => dispatch({ type: 'setStatus', id: openTicket.id, status })}
          onAssign={(assignee) => dispatch({ type: 'assign', id: openTicket.id, assignee })}
          onAddNote={(note) => dispatch({ type: 'addNote', id: openTicket.id, note })}
        />
      ) : guestId ? (
        <GuestPage
          guestId={guestId}
          tickets={tickets}
          onBack={() => setGuestId(null)}
          onOpenTicket={(id) => {
            setGuestId(null)
            setTicketId(id)
          }}
        />
      ) : (
        <>
          <header className="top">
            <div className="top__bar">
              {searching ? (
                <>
                  <label className="search">
                    <SearchIcon size={18} />
                    <input
                      autoFocus
                      placeholder={tab === 'rooms' ? 'Search rooms or guests' : 'Search tickets'}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <button className="top__cancel" onClick={closeSearch}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="icon-btn" onClick={() => setDrawer(true)} aria-label="Menu">
                    <MenuIcon size={24} />
                  </button>
                  <span className="top__brand"><BrandMark size={22} /> Stanly Ranch</span>
                  <button className="icon-btn" onClick={() => setSearching(true)} aria-label="Search">
                    <SearchIcon size={22} />
                  </button>
                </>
              )}
            </div>

            <div className="top__title">
              <span className="eyebrow">{eyebrow}</span>
              {tab === 'tickets' ? (
                <button className="top__dept" onClick={() => setDeptMenu((v) => !v)} aria-expanded={deptMenu}>
                  <h1>{dept.name}</h1>
                  <CaretIcon size={22} className={deptMenu ? 'flip' : ''} />
                </button>
              ) : (
                <h1>Rooms</h1>
              )}
            </div>

            {deptMenu && tab === 'tickets' && (
              <div className="dropdown">
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d.id}
                    className={d.id === deptId ? 'on' : ''}
                    onClick={() => {
                      setDeptId(d.id)
                      setDeptMenu(false)
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </header>

          <main className="main">
            {tab === 'tickets' ? (
              <TicketsView tickets={deptTickets} query={query} now={now} onOpen={setTicketId} />
            ) : (
              <RoomsView tickets={tickets} query={query} onOpenGuest={setGuestId} />
            )}
          </main>
        </>
      )}

      {!onDetail && (
        <nav className="tabbar">
          <button className={tab === 'rooms' ? 'on' : ''} onClick={() => switchTab('rooms')}>
            <DoorIcon size={22} />
            Rooms
          </button>
          <button className={tab === 'tickets' ? 'on' : ''} onClick={() => switchTab('tickets')}>
            <TicketsIcon size={22} />
            Tickets
          </button>
          <button className="tabbar__add" onClick={() => setCreating(true)} aria-label="New ticket">
            <PlusIcon size={24} />
          </button>
        </nav>
      )}

      {drawer && (
        <div className="overlay overlay--left" onClick={() => setDrawer(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer__head">
              <BrandMark size={40} />
              <b>Stanly Ranch</b>
              <span>Signed in as {ME}</span>
              <button className="icon-btn drawer__close" onClick={() => setDrawer(false)} aria-label="Close menu">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="drawer__label">Departments</div>
            {DEPARTMENTS.map((d) => (
              <button
                key={d.id}
                className={d.id === deptId ? 'on' : ''}
                onClick={() => {
                  setDeptId(d.id)
                  setTab('tickets')
                  setDrawer(false)
                }}
              >
                {d.name}
              </button>
            ))}
            <div className="drawer__label">Demo</div>
            <button
              onClick={() => {
                reset()
                setDrawer(false)
              }}
            >
              Reset demo data
            </button>
          </aside>
        </div>
      )}

      {creating && (
        <NewTicketSheet
          departmentId={deptId}
          onClose={() => setCreating(false)}
          onCreate={(ticket) => {
            dispatch({ type: 'create', ticket })
            setDeptId(ticket.departmentId)
            setTab('tickets')
            setCreating(false)
          }}
        />
      )}
    </div>
  )
}
