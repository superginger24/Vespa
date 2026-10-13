import type { ActivityItem, Guest, Tip } from './types'

const hoursSince = (iso: string) => Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 3600_000))

const ago = (iso: string) => {
  const h = hoursSince(iso)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

const TEMPLATES: Record<string, { label: string; build: (first: string, a: ActivityItem) => string }> = {
  dining: { label: 'Dining', build: (n, a) => `${n}, how was ${a.topic}?` },
  activity: { label: 'Activity', build: (n, a) => `${n}, I heard about ${a.topic}. How did it go?` },
  spa: { label: 'Spa', build: (n, a) => `Looking forward to ${a.topic}, ${n}?` },
  arrival: { label: 'Arrival', build: (n, a) => `${n}, how has the stay been since ${a.topic}?` },
  request: { label: 'Request', build: (n, a) => `${n}, I wanted to follow up on ${a.topic}. Is everything set?` },
}

/**
 * Local stand-in for the AI service: builds up to three openers from the
 * guest's recent activity and profile. Swap for a backend call when ready.
 */
export function generateTips(guest: Guest): Tip[] {
  const first = guest.name.split(' ')[0]
  const recent = [...guest.activity].sort((a, b) => b.at.localeCompare(a.at))
  const seen = new Set<string>()
  const tips: Tip[] = []

  for (const a of recent) {
    if (seen.has(a.category) || tips.length >= 3) continue
    seen.add(a.category)
    const tpl = TEMPLATES[a.category]
    tips.push({
      id: `${guest.id}-${a.category}`,
      category: tpl.label,
      text: tpl.build(first, a),
      basedOn: `${a.text} (${ago(a.at)})`,
    })
  }

  for (const pref of guest.preferences) {
    if (tips.length >= 3) break
    tips.push({
      id: `${guest.id}-pref-${tips.length}`,
      category: 'Preference',
      text: `${first}, we have noted: ${pref.toLowerCase()}. Anything else we can set up for you?`,
      basedOn: `Guest profile: ${pref}`,
    })
  }

  return tips
}
