import { useMemo, useState } from 'react'
import { ChevronRightIcon } from '../icons'
import { sameDay } from '../../utils'

interface Props {
  selected: Date | null
  today: Date
  /** Days that have tickets, as Date.toDateString() values. */
  marked: Set<string>
  onSelect: (d: Date) => void
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function MiniCalendar({ selected, today, marked, onSelect }: Props) {
  const [view, setView] = useState(() => new Date((selected ?? today).getFullYear(), (selected ?? today).getMonth(), 1))

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1)
    const start = new Date(first)
    start.setDate(1 - first.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [view])

  const shift = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1))

  return (
    <div className="cal">
      <div className="cal__head">
        <button className="cal__nav cal__nav--prev" onClick={() => shift(-1)} aria-label="Previous month">
          <ChevronRightIcon size={16} />
        </button>
        <b>{view.toLocaleDateString([], { month: 'short', year: 'numeric' })}</b>
        <button className="cal__nav" onClick={() => shift(1)} aria-label="Next month">
          <ChevronRightIcon size={16} />
        </button>
      </div>
      <div className="cal__grid">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="cal__dow">{w}</span>
        ))}
        {cells.map((d) => {
          const out = d.getMonth() !== view.getMonth()
          const cls = [
            'cal__day',
            out && 'cal__day--out',
            sameDay(d, today) && 'cal__day--today',
            selected && sameDay(d, selected) && 'cal__day--sel',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button key={d.toISOString()} className={cls} onClick={() => onSelect(d)}>
              {d.getDate()}
              {marked.has(d.toDateString()) && <i />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
