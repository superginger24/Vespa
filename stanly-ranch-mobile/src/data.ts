import type { Department, Guest, HkRoom, Ticket } from './types'

export const ME = 'Fernando Perez'

export const STAFF = ['Fernando Perez', 'Calvin Snider', 'Maria Lopez', 'Devon Clarke']

export const DEPARTMENTS: Department[] = [
  { id: 'bell', name: 'Bell & Valet' },
  { id: 'hk', name: 'Housekeeping' },
  { id: 'concierge', name: 'Concierge' },
  { id: 'maint', name: 'Maintenance' },
]

export const TICKET_TYPES: Record<string, string[]> = {
  bell: ['Golf Cart Ride', 'Luggage Assistance', 'Valet Retrieval', 'Package Delivery'],
  hk: ['Turndown Service', 'Extra Towels', 'Room Refresh', 'Amenity Delivery'],
  concierge: ['Dinner Reservation', 'Activity Booking', 'Transportation', 'Special Occasion'],
  maint: ['AC Not Cooling', 'Light Out', 'Plumbing', 'TV / Wi-Fi Issue'],
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400_000).toISOString()

export const GUESTS: Guest[] = [
  {
    id: 'g1',
    name: 'Kristin Dahill',
    room: '57B',
    arrival: daysFromNow(-1),
    departure: daysFromNow(3),
    vip: true,
    preferences: ['Oat milk cortado', 'Prefers quiet seating', 'Anniversary trip'],
    stayNotes: [
      { text: '5th anniversary. Champagne and a handwritten card in room on arrival.', source: 'OPERA reservation' },
      { text: 'Returning guest, 3rd stay. Always asks for the room away from the road.', source: 'OPERA profile' },
    ],
    activity: [
      { at: hoursAgo(26), text: 'Arrived by car from Napa after a long drive', topic: 'the long drive down from Napa', category: 'arrival' },
      { at: hoursAgo(22), text: 'Dinner at the Ranch Kitchen, ordered the wood-fired trout', topic: 'the wood-fired trout at the Ranch Kitchen', category: 'dining' },
      { at: hoursAgo(8), text: 'Morning yoga on the meadow lawn', topic: 'yoga on the meadow lawn', category: 'activity' },
      { at: hoursAgo(5), text: 'Booked a couples massage for tomorrow at 2 PM', topic: "tomorrow's couples massage at 2 PM", category: 'spa' },
      { at: hoursAgo(1), text: 'Requested a golf cart to the Barn for lunch', topic: 'lunch at the Barn', category: 'request' },
    ],
  },
  {
    id: 'g2',
    name: 'Allison Karp',
    room: '42A',
    arrival: daysFromNow(0),
    departure: daysFromNow(2),
    preferences: ['Traveling with two kids', 'Early riser', 'Allergic to shellfish'],
    stayNotes: [
      { text: 'SHELLFISH ALLERGY (guest and one child). Alert kitchen on every dining booking.', source: 'OPERA reservation' },
      { text: 'Two cribs not needed. Kids are 6 and 9. Requested extra towels for the pool.', source: 'Front desk' },
    ],
    activity: [
      { at: hoursAgo(3), text: 'Arrived this morning from San Francisco with two kids', topic: 'the trip in from San Francisco with the kids', category: 'arrival' },
      { at: hoursAgo(2), text: "Kids joined the s'mores fire pit sign-up", topic: "the s'mores fire pit", category: 'activity' },
      { at: hoursAgo(1), text: 'Asked for a shellfish-free dinner menu', topic: "tonight's shellfish-free dinner", category: 'request' },
    ],
  },
  {
    id: 'g3',
    name: 'Ryan Heath',
    room: '4013',
    arrival: daysFromNow(-3),
    departure: daysFromNow(1),
    vip: true,
    preferences: ['Golf enthusiast', 'Old fashioned, no garnish', 'Likes early tee times'],
    stayNotes: [
      { text: 'Group of four, golf weekend. Billing split across two folios.', source: 'OPERA reservation' },
      { text: 'Checking out tomorrow. Wants luggage staged at the front by 10 AM.', source: 'Front desk' },
    ],
    activity: [
      { at: hoursAgo(70), text: 'Arrived with a group of four for a golf weekend', topic: 'the golf weekend with your group', category: 'arrival' },
      { at: hoursAgo(48), text: 'Played the back nine at sunrise', topic: 'the sunrise back nine', category: 'activity' },
      { at: hoursAgo(24), text: 'Dinner at the Barn, ordered the dry-aged ribeye', topic: 'the dry-aged ribeye at the Barn', category: 'dining' },
      { at: hoursAgo(4), text: 'Hot stone massage at the spa', topic: 'the hot stone massage', category: 'spa' },
    ],
  },
  {
    id: 'g4',
    name: 'Priya Natarajan',
    room: '210',
    arrival: daysFromNow(-1),
    departure: daysFromNow(4),
    preferences: ['Vegetarian', 'Works remotely mornings', 'Loves hiking'],
    stayNotes: [
      { text: 'Vegetarian. Extended stay for remote work, needs a quiet room and strong Wi-Fi.', source: 'OPERA reservation' },
    ],
    activity: [
      { at: hoursAgo(20), text: 'Arrived and asked about local hiking trails', topic: 'getting settled in and finding the trails', category: 'arrival' },
      { at: hoursAgo(9), text: 'Took the sunrise ridge hike', topic: 'the sunrise ridge hike', category: 'activity' },
      { at: hoursAgo(2), text: 'Lunch at the Garden Cafe, ordered the harvest bowl', topic: 'the harvest bowl at the Garden Cafe', category: 'dining' },
    ],
  },
  {
    id: 'g5',
    name: 'Margaret Ellison',
    room: '62A',
    arrival: daysFromNow(0),
    departure: daysFromNow(5),
    vip: true,
    preferences: ['Prefers still water', 'Uses a cane, avoid stairs', 'Birdwatching'],
    stayNotes: [
      { text: 'Mobility: uses a cane. Ground-floor cottage assigned. Golf cart for all transfers.', source: 'OPERA reservation' },
      { text: '70th birthday on Friday. Family dinner for 8 at the Barn is booked.', source: 'OPERA profile' },
    ],
    activity: [
      { at: hoursAgo(2), text: 'Arrived by private car and asked for a bird guide', topic: 'arriving this morning', category: 'arrival' },
      { at: hoursAgo(1), text: 'Requested still water and tea in the room', topic: 'your tea setup', category: 'request' },
    ],
  },
  {
    id: 'g6',
    name: 'Theo Brandt',
    room: '44A',
    arrival: daysFromNow(-2),
    departure: daysFromNow(1),
    preferences: ['Craft cocktails', 'Photographer', 'Late checkout'],
    stayNotes: [
      { text: 'Late checkout approved until 2 PM.', source: 'OPERA reservation' },
    ],
    activity: [
      { at: hoursAgo(40), text: 'Arrived with camera gear and asked about sunset spots', topic: 'finding a good sunset spot', category: 'arrival' },
      { at: hoursAgo(18), text: 'Cocktails at the Barn bar, tried the smoked old fashioned', topic: 'the smoked old fashioned at the Barn bar', category: 'dining' },
      { at: hoursAgo(6), text: 'Sunrise photo walk along the vineyard', topic: 'the sunrise photo walk', category: 'activity' },
    ],
  },
  {
    id: 'g7',
    name: 'Sofia Marchetti',
    room: '4011',
    arrival: daysFromNow(-1),
    departure: daysFromNow(2),
    preferences: ['Pilates', 'Gluten free', 'Traveling with a small dog'],
    stayNotes: [
      { text: 'Pet in room (small dog, Luna). Pet fee on folio. Dog-friendly turndown only.', source: 'OPERA reservation' },
      { text: 'Gluten free. Confirm with kitchen on every order.', source: 'OPERA profile' },
    ],
    activity: [
      { at: hoursAgo(21), text: 'Arrived with a small dog named Luna', topic: 'getting Luna settled in', category: 'arrival' },
      { at: hoursAgo(7), text: 'Pilates class in the studio', topic: 'the Pilates class', category: 'activity' },
    ],
  },
  {
    id: 'g8',
    name: 'Daniel Okafor',
    room: '31A',
    arrival: daysFromNow(-4),
    departure: daysFromNow(0),
    preferences: ['Business travel', 'Quiet room', 'Early checkout'],
    stayNotes: [
      { text: 'Departing today. Car to the airport at 3 PM. Needs a receipt emailed.', source: 'Front desk' },
    ],
    activity: [
      { at: hoursAgo(90), text: 'Arrived for a three-day offsite', topic: 'the offsite', category: 'arrival' },
      { at: hoursAgo(30), text: 'Dinner with colleagues at the Ranch Kitchen', topic: 'the team dinner at the Ranch Kitchen', category: 'dining' },
    ],
  },
]

const inMin = (m: number) => new Date(Date.now() + m * 60_000).toISOString()

interface T {
  id: string
  title: string
  description: string
  guestId: string
  dept: string
  status: Ticket['status']
  assignee: string | null
  due: string
  code?: string
  notes?: Ticket['notes']
}

const guestOf = (id: string) => GUESTS.find((g) => g.id === id)!

const ticket = (t: T): Ticket => ({
  id: t.id,
  title: t.title,
  description: t.description,
  room: guestOf(t.guestId).room,
  guestId: t.guestId,
  guestName: guestOf(t.guestId).name,
  departmentId: t.dept,
  status: t.status,
  assignee: t.assignee,
  dueAt: t.due,
  code: t.code ?? '',
  notes: t.notes ?? [],
})

export function seedTickets(): Ticket[] {
  return [
    ticket({ id: 't1', title: 'Golf Cart Ride', description: 'Pick up From:: 57B, Drop Off At:: front of the Barn restaurant', guestId: 'g1', dept: 'bell', status: 'work', assignee: 'Fernando Perez', due: inMin(31), code: 'NG2' }),
    ticket({ id: 't2', title: 'Luggage Assistance', description: 'Move from:: 42A, Move to:: Front Desk for early departure', guestId: 'g2', dept: 'bell', status: 'work', assignee: 'Calvin Snider', due: inMin(45), code: 'NG2' }),
    ticket({
      id: 't3', title: 'Golf Cart Ride', description: 'Pick up From:: Villa, Drop Off At:: Spa entrance', guestId: 'g3', dept: 'bell', status: 'new', assignee: null, due: inMin(12),
      notes: [{ id: 'n1', author: 'Maria Lopez', at: new Date().toISOString(), text: 'Guest prefers the cart waiting at the villa gate.', source: 'staff' }],
    }),
    ticket({ id: 't9', title: 'Luggage Assistance', description: 'Move from:: Front Drive, Move to:: 62A. Guest uses a cane, please assist.', guestId: 'g5', dept: 'bell', status: 'new', assignee: null, due: inMin(25), code: 'NG1' }),
    ticket({ id: 't10', title: 'Valet Retrieval', description: 'Bring vehicle to the front. Black Land Cruiser.', guestId: 'g6', dept: 'bell', status: 'work', assignee: 'Calvin Snider', due: inMin(75) }),
    ticket({ id: 't11', title: 'Golf Cart Ride', description: 'Pick up From:: 4011, Drop Off At:: Pilates studio. Guest has a small dog.', guestId: 'g7', dept: 'bell', status: 'new', assignee: null, due: inMin(105) }),
    ticket({ id: 't12', title: 'Package Delivery', description: 'Deliver package from front desk to 31A before departure.', guestId: 'g8', dept: 'bell', status: 'new', assignee: null, due: inMin(140) }),
    ticket({ id: 't14', title: 'Luggage Assistance', description: 'Stage luggage at the front by 10 AM tomorrow for early checkout.', guestId: 'g3', dept: 'bell', status: 'new', assignee: null, due: inMin(180) }),
    ticket({ id: 't4', title: 'Valet Retrieval', description: 'Bring vehicle to the front. Silver Range Rover.', guestId: 'g4', dept: 'bell', status: 'new', assignee: null, due: daysFromNow(1) }),
    ticket({ id: 't5', title: 'Package Delivery', description: 'Deliver package from front desk to room.', guestId: 'g2', dept: 'bell', status: 'closed', assignee: 'Fernando Perez', due: inMin(-90) }),
    ticket({ id: 't13', title: 'Golf Cart Ride', description: 'Pick up From:: 210, Drop Off At:: Garden Cafe', guestId: 'g4', dept: 'bell', status: 'closed', assignee: 'Fernando Perez', due: inMin(-40) }),
    ticket({ id: 't6', title: 'Turndown Service', description: 'Evening turndown, extra pillows requested.', guestId: 'g1', dept: 'hk', status: 'new', assignee: null, due: inMin(240) }),
    ticket({ id: 't15', title: 'Extra Towels', description: 'Four extra pool towels for two kids.', guestId: 'g2', dept: 'hk', status: 'work', assignee: 'Maria Lopez', due: inMin(20) }),
    ticket({ id: 't7', title: 'AC Not Cooling', description: 'Guest reports bedroom is warm.', guestId: 'g4', dept: 'maint', status: 'work', assignee: 'Devon Clarke', due: inMin(45), code: 'NG1' }),
    ticket({ id: 't8', title: 'Dinner Reservation', description: 'Table for 2 at the Barn, 7:30 PM, quiet corner. Anniversary.', guestId: 'g1', dept: 'concierge', status: 'work', assignee: 'Maria Lopez', due: inMin(200) }),
    ticket({ id: 't16', title: 'Special Occasion', description: 'Birthday cake and flowers for Friday dinner. Family of 8.', guestId: 'g5', dept: 'concierge', status: 'new', assignee: null, due: inMin(300) }),
  ]
}

export const HK_TARGET = 7.5

export const HK_ATTENDANTS = ['Maria Lopez', 'Rosa Vega', 'Jamal Brooks', 'Tessa Nguyen', 'Luis Ortega']

const r = (room: string, attendant: string, status: HkRoom['status'], credit: number, section: string): HkRoom => ({
  room,
  attendant,
  status,
  credit,
  section,
})

export function seedRooms(): HkRoom[] {
  return [
    r('57B', 'Maria Lopez', 'dirty', 1.5, 'Cottage, Zone 3'),
    r('62A', 'Maria Lopez', 'clean', 1, 'Cottage, Zone 3'),
    r('12A', 'Maria Lopez', 'inspected', 1, 'Cottage, Zone 1'),
    r('14B', 'Maria Lopez', 'inspected', 1.25, 'Cottage, Zone 1'),
    r('19C', 'Maria Lopez', 'dirty', 1, 'Cottage, Zone 1'),
    r('42A', 'Rosa Vega', 'clean', 1.5, 'Villa, Zone 2'),
    r('40B', 'Rosa Vega', 'inspected', 1, 'Villa, Zone 2'),
    r('44A', 'Rosa Vega', 'inspected', 1.25, 'Villa, Zone 2'),
    r('45A', 'Rosa Vega', 'dirty', 1, 'Villa, Zone 2'),
    r('38A', 'Rosa Vega', 'skip', 0.75, 'Villa, Zone 2'),
    r('210', 'Jamal Brooks', 'dirty', 1.5, 'Main House, Zone 5'),
    r('212', 'Jamal Brooks', 'clean', 1, 'Main House, Zone 5'),
    r('214', 'Jamal Brooks', 'inspected', 1, 'Main House, Zone 5'),
    r('216', 'Jamal Brooks', 'inspected', 1.25, 'Main House, Zone 5'),
    r('218', 'Jamal Brooks', 'dirty', 1, 'Main House, Zone 5'),
    r('4013', 'Tessa Nguyen', 'inspected', 1.5, 'Palomino House'),
    r('4011', 'Tessa Nguyen', 'clean', 1, 'Palomino House'),
    r('4015', 'Tessa Nguyen', 'dirty', 1.25, 'Palomino House'),
    r('4017', 'Tessa Nguyen', 'inspected', 1, 'Palomino House'),
    r('31A', 'Luis Ortega', 'inspected', 1, 'Cottage, Zone 7'),
    r('33A', 'Luis Ortega', 'clean', 1.25, 'Cottage, Zone 7'),
    r('35A', 'Luis Ortega', 'inspected', 1, 'Cottage, Zone 7'),
    r('37A', 'Luis Ortega', 'dirty', 1, 'Cottage, Zone 7'),
    r('39A', 'Luis Ortega', 'skip', 0.75, 'Cottage, Zone 7'),
  ]
}
