import { initials } from '../utils'

const TONES = ['#5f7a61', '#b8643f', '#7a6a8a', '#4f7a8a', '#9a7b3c']

const toneFor = (name: string) => TONES[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % TONES.length]

export function Avatar({ name, size = 26 }: { name: string; size?: number }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: toneFor(name), fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
