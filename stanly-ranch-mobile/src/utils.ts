import { ME } from './data'
import type { Note } from './types'
import { useEffect, useState } from 'react'

export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export function formatRemaining(iso: string, now: number) {
  const mins = Math.round((new Date(iso).getTime() - now) / 60_000)
  const abs = Math.abs(mins)
  const late = mins < 0 ? ' late' : ''
  if (abs >= 1440) return `${Math.floor(abs / 1440)}d${late}`
  if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m${late}`
  return `${abs}m${late}`
}

export const uid = () => Math.random().toString(36).slice(2, 10)

export const STATUS_LABEL = { new: 'New', work: 'In progress', closed: 'Done' } as const

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const makeNote = (text: string, source: Note['source']): Note => ({
  id: uid(),
  author: ME,
  at: new Date().toISOString(),
  text,
  source,
})
