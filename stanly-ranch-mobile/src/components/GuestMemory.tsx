import { useMemo, useState } from 'react'
import { generateTips } from '../tips'
import type { Guest } from '../types'
import { SparkIcon } from './icons'

interface Props {
  guest: Guest
  /** When provided, tips can be saved as a staff note on that ticket. */
  onSaveNote?: (text: string) => void
  saveHint?: string
}

export function GuestMemory({ guest, onSaveNote, saveHint }: Props) {
  const tips = useMemo(() => generateTips(guest), [guest])
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const save = (id: string, text: string) => {
    onSaveNote?.(`Conversation starter: ${text}`)
    setSaved((s) => new Set(s).add(id))
  }

  return (
    <section className="memory">
      <h3 className="section-title">
        <SparkIcon size={18} /> Guest Memory
      </h3>

      <div className="memory__meta">
        <b>{guest.name}</b>
        {guest.vip && <span className="vip">VIP</span>}
        <span>Room {guest.room}</span>
      </div>

      {guest.preferences.length > 0 && (
        <div className="pills">
          {guest.preferences.map((p) => (
            <span key={p} className="pill">{p}</span>
          ))}
        </div>
      )}

      <h4 className="subhead">Conversation starters</h4>
      {saveHint && <p className="muted">{saveHint}</p>}
      {tips.map((tip) => (
        <div key={tip.id} className="tip">
          <span className="tip__cat">{tip.category}</span>
          <p className="tip__text">"{tip.text}"</p>
          <p className="tip__why">Based on: {tip.basedOn}</p>
          {onSaveNote && (
            <button className="btn btn--ghost" disabled={saved.has(tip.id)} onClick={() => save(tip.id, tip.text)}>
              {saved.has(tip.id) ? 'Saved to staff notes' : 'Save to staff notes'}
            </button>
          )}
        </div>
      ))}

      <h4 className="subhead">Recent activity</h4>
      <ul className="timeline">
        {[...guest.activity]
          .sort((a, b) => b.at.localeCompare(a.at))
          .map((a) => (
            <li key={a.at + a.text}>
              <span className="timeline__time">
                {new Date(a.at).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
              </span>
              {a.text}
            </li>
          ))}
      </ul>
    </section>
  )
}
