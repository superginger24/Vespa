import { useEffect, useState, type ReactNode } from 'react'
import { useNow } from '../utils'

const W = 393
const H = 852
const BEZEL = 12
export const VIEWBAR = 52

function useFit() {
  const [fit, setFit] = useState({ framed: false, scale: 1 })
  useEffect(() => {
    const update = () => {
      const framed = window.innerWidth > 520
      const scale = Math.min(
        1,
        (window.innerHeight - VIEWBAR - 24) / (H + BEZEL * 2),
        (window.innerWidth - 32) / (W + BEZEL * 2),
      )
      setFit({ framed, scale })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return fit
}

function StatusBar() {
  const now = useNow(10_000)
  const time = new Date(now).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
  return (
    <div className="statusbar" aria-hidden="true">
      <span className="statusbar__time">{time}</span>
      <span className="statusbar__icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1 4.2a10 10 0 0 1 14 0M3.5 7a6.3 6.3 0 0 1 9 0" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x=".5" y=".5" width="22" height="12" rx="3.8" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="17" height="9" rx="2.5" fill="currentColor" />
          <path d="M24.5 4.5v4c.9-.3 1.6-1.1 1.6-2s-.7-1.7-1.6-2z" fill="currentColor" opacity=".5" />
        </svg>
      </span>
    </div>
  )
}

/** Wraps the app in an iPhone on desktop; renders edge-to-edge on an actual phone. */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { framed, scale } = useFit()

  if (!framed) {
    return <div className="screen screen--native">{children}</div>
  }

  return (
    <div className="stage">
      <div className="device" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <i className="device__btn device__btn--action" />
        <i className="device__btn device__btn--up" />
        <i className="device__btn device__btn--down" />
        <i className="device__btn device__btn--power" />
        <div className="screen screen--framed">
          <div className="island" />
          <StatusBar />
          {children}
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  )
}
