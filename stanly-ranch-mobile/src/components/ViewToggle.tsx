export type ViewMode = 'desktop' | 'mobile'

interface Props {
  mode: ViewMode
  onChange: (m: ViewMode) => void
}

const MonitorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="7" y="2" width="10" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
)

/** Slim bar above the app for switching between the desktop and mobile layouts. */
export function ViewBar({ mode, onChange }: Props) {
  return (
    <div className="viewbar">
      <span className="viewbar__label">Preview as</span>
      <div className="seg viewbar__seg" role="tablist" aria-label="Layout">
        <button role="tab" aria-selected={mode === 'desktop'} className={mode === 'desktop' ? 'on' : ''} onClick={() => onChange('desktop')}>
          <MonitorIcon /> Desktop
        </button>
        <button role="tab" aria-selected={mode === 'mobile'} className={mode === 'mobile' ? 'on' : ''} onClick={() => onChange('mobile')}>
          <PhoneIcon /> Mobile
        </button>
      </div>
    </div>
  )
}
