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
    activity: [
      { at: hoursAgo(26), text: 'Arrived by car from Napa after a long drive', topic: "the long drive down from Napa", category: 'arrival' },
      { at: hoursAgo(22), text: 'Dinner at the Ranch Kitchen, ordered the wood-fired trout', topic: "the wood-fired trout at the Ranch Kitchen", category: 'dining' },
      { at: hoursAgo(8), text: 'Morning yoga on the meadow lawn', topic: "yoga on the meadow lawn", category: 'activity' },
      { at: hoursAgo(5), text: 'Booked a couples massage for tomorrow at 2 PM', topic: "tomorrow's couples massage at 2 PM", category: 'spa' },
      { at: hoursAgo(1), text: 'Requested a golf cart to the Barn for lunch', topic: "lunch at the Barn", category: 'request' },
    ],
  },
  {
    id: 'g2',
    name: 'Allison Karp',
    room: '42A',
    arrival: daysFromNow(0),
    departure: daysFromNow(2),
    preferences: ['Traveling with two kids', 'Early riser', 'Allergic to shellfish'],
    activity: [
      { at: hoursAgo(3), text: 'Arrived this morning from San Francisco with two kids', topic: "the trip in from San Francisco with the kids", category: 'arrival' },
      { at: hoursAgo(2), text: 'Kids joined the s\'mores fire pit sign-up', topic: "the s'mores fire pit", category: 'activity' },
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
    activity: [
      { at: hoursAgo(70), text: 'Arrived with a group of four for a golf weekend', topic: "the golf weekend with your group", category: 'arrival' },
      { at: hoursAgo(48), text: 'Played the back nine at sunrise', topic: "the sunrise back nine", category: 'activity' },
      { at: hoursAgo(24), text: 'Dinner at the Barn, ordered the dry-aged ribeye', topic: "the dry-aged ribeye at the Barn", category: 'dining' },
      { at: hoursAgo(4), text: 'Hot stone massage at the spa', topic: "the hot stone massage", category: 'spa' },
    ],
  },
  {
    id: 'g4',
    name: 'Priya Natarajan',
    room: '210',
    arrival: daysFromNow(-1),
    departure: daysFromNow(4),
    preferences: ['Vegetarian', 'Works remotely mornings', 'Loves hiking'],
    activity: [
      { at: hoursAgo(20), text: 'Arrived and asked about local hiking trails', topic: "getting settled in and finding the trails", category: 'arrival' },
      { at: hoursAgo(9), text: 'Took the sunrise ridge hike', topic: "the sunrise ridge hike", category: 'activity' },
      { at: hoursAgo(2), text: 'Lunch at the Garden Cafe, ordered the harvest bowl', topic: "the harvest bowl at the Garden Cafe", category: 'dining' },
    ],
  },
]

const inMin = (m: number) => new Date(Date.now() + m * 60_000).toISOString()

export function seedTickets(): Ticket[] {
  return [
    {
      id: 't1',
      title: 'Golf Cart Ride',
      description: 'Pick up From:: 57B, Drop Off At:: front of the Barn restaurant',
      room: '57B',
      guestId: 'g1',
      guestName: 'Kristin Dahill',
      departmentId: 'bell',
      status: 'work',
      assignee: 'Fernando Perez',
      dueAt: inMin(31),
      code: 'NG2',
      notes: [],
    },
    {
      id: 't2',
      title: 'Luggage Assistance',
      description: 'Move from:: 42A, Move to:: Front Desk for early departure',
      room: '42A',
      guestId: 'g2',
      guestName: 'Allison Karp',
      departmentId: 'bell',
      status: 'work',
      assignee: 'Calvin Snider',
      dueAt: inMin(15),
      code: 'NG2',
      notes: [],
    },
    {
      id: 't3',
      title: 'Golf Cart Ride',
      description: 'Pick up From:: Villa, Drop Off At:: Spa entrance',
      room: '4013',
      guestId: 'g3',
      guestName: 'Ryan Heath',
      departmentId: 'bell',
      status: 'new',
      assignee: null,
      dueAt: inMin(6),
      code: '',
      notes: [
        {
          id: 'n1',
          author: 'Maria Lopez',
          at: new Date().toISOString(),
          text: 'Guest prefers the cart waiting at the villa gate.',
          source: 'staff',
        },
      ],
    },
    {
      id: 't4',
      title: 'Valet Retrieval',
      description: 'Bring vehicle to the front. Silver Range Rover.',
      room: '210',
      guestId: 'g4',
      guestName: 'Priya Natarajan',
      departmentId: 'bell',
      status: 'new',
      assignee: null,
      dueAt: daysFromNow(1),
      code: '',
      notes: [],
    },
    {
      id: 't5',
      title: 'Package Delivery',
      description: 'Deliver package from front desk to room.',
      room: '42A',
      guestId: 'g2',
      guestName: 'Allison Karp',
      departmentId: 'bell',
      status: 'closed',
      assignee: 'Fernando Perez',
      dueAt: inMin(-90),
      code: '',
      notes: [],
    },
    {
      id: 't6',
      title: 'Turndown Service',
      description: 'Evening turndown, extra pillows requested.',
      room: '57B',
      guestId: 'g1',
      guestName: 'Kristin Dahill',
      departmentId: 'hk',
      status: 'new',
      assignee: null,
      dueAt: inMin(120),
      code: '',
      notes: [],
    },
    {
      id: 't7',
      title: 'AC Not Cooling',
      description: 'Guest reports bedroom is warm.',
      room: '210',
      guestId: 'g4',
      guestName: 'Priya Natarajan',
      departmentId: 'maint',
      status: 'work',
      assignee: 'Devon Clarke',
      dueAt: inMin(45),
      code: 'NG1',
      notes: [],
    },
    {
      id: 't8',
      title: 'Dinner Reservation',
      description: 'Table for 2 at the Barn, 7:30 PM, quiet corner. Anniversary.',
      room: '57B',
      guestId: 'g1',
      guestName: 'Kristin Dahill',
      departmentId: 'concierge',
      status: 'work',
      assignee: 'Maria Lopez',
      dueAt: inMin(200),
      code: '',
      notes: [],
    },
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
