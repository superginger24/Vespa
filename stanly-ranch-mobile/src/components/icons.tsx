import type { ReactNode } from 'react'

interface P {
  size?: number
  className?: string
}

const svg = (children: ReactNode, { size = 24, className }: P) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const MenuIcon = (p: P) => svg(<path d="M3 6h18M3 12h18M3 18h18" />, p)
export const SearchIcon = (p: P) => svg(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>, p)
export const CaretIcon = (p: P) => svg(<path d="m6 9 6 6 6-6" fill="currentColor" />, p)
export const ArrowUpIcon = (p: P) => svg(<path d="M12 20V5M5 12l7-7 7 7" />, p)
export const ArrowDownIcon = (p: P) => svg(<path d="M12 4v15M5 12l7 7 7-7" />, p)
export const PlusIcon = (p: P) => svg(<path d="M12 5v14M5 12h14" strokeWidth="2.5" />, p)
export const CloseIcon = (p: P) => svg(<path d="M6 6l12 12M18 6 6 18" />, p)
export const BackIcon = (p: P) => svg(<path d="M15 5l-7 7 7 7" />, p)
export const NoteIcon = (p: P) =>
  svg(<><path d="M5 3h10l4 4v14H5z" /><path d="M9 12h6M9 16h6" /></>, p)
export const DoorIcon = (p: P) =>
  svg(<><path d="M6 21V4l10-2v19" /><path d="M3 21h18" /><circle cx="13" cy="12" r=".8" fill="currentColor" /></>, p)
export const TicketsIcon = (p: P) =>
  svg(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h6" /></>, p)
export const SparkIcon = (p: P) =>
  svg(<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />, p)

export const DepartmentIcon = ({ id }: { id: string }) => {
  const paths: Record<string, ReactNode> = {
    bell: <><rect x="6" y="8" width="12" height="12" rx="1.5" /><path d="M9 8V5h6v3M9 12v4M15 12v4" /></>,
    hk: <><path d="M4 18h16M5 18a7 7 0 0 1 14 0M12 8V6" /><circle cx="12" cy="5" r="1" /></>,
    concierge: <><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    maint: <><path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9z" /></>,
  }
  return svg(paths[id] ?? paths.bell, { size: 22 })
}

export const ChevronRightIcon = (p: P) => svg(<path d="m9 5 7 7-7 7" />, p)
export const ClockIcon = (p: P) => svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, p)

export const BrandMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="16" fill="#46604a" />
    <circle cx="32" cy="26" r="9" fill="#e9c46a" />
    <path d="M6 50c8-12 16-16 26-16s18 4 26 16z" fill="#f6f1e7" />
    <path d="M6 50c10-6 18-8 26-8s16 2 26 8v8H6z" fill="#b8643f" />
  </svg>
)
