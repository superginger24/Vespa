import { useEffect, useState } from 'react'
import { useWorkspace } from '../store'
import { useNow } from '../utils'
import { DeviceFrame } from './DeviceFrame'
import { DesktopApp } from './desktop/DesktopApp'
import { MobileApp } from './MobileApp'
import { ViewBar, type ViewMode } from './ViewToggle'

const MODE_KEY = 'stn-view'
const WIDE = 520

function useWide() {
  const [wide, setWide] = useState(() => window.innerWidth > WIDE)
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth > WIDE)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return wide
}

function initialMode(): ViewMode {
  const saved = localStorage.getItem(MODE_KEY)
  if (saved === 'desktop' || saved === 'mobile') return saved
  return window.innerWidth >= 1024 ? 'desktop' : 'mobile'
}

export function App() {
  const ws = useWorkspace()
  const now = useNow()
  const wide = useWide()
  const [mode, setMode] = useState(initialMode)

  const choose = (m: ViewMode) => {
    setMode(m)
    localStorage.setItem(MODE_KEY, m)
  }

  // Real phones always get the mobile layout, edge to edge.
  if (!wide) {
    return (
      <DeviceFrame>
        <MobileApp ws={ws} now={now} />
      </DeviceFrame>
    )
  }

  return (
    <>
      <ViewBar mode={mode} onChange={choose} />
      {mode === 'desktop' ? (
        <DesktopApp ws={ws} now={now} />
      ) : (
        <DeviceFrame>
          <MobileApp ws={ws} now={now} />
        </DeviceFrame>
      )}
    </>
  )
}
