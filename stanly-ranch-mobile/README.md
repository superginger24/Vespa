# Stanly Ranch

Mobile-first workflow management app for hotel staff, modeled on the ALICE iOS ticket list, with a Guest Memory feature that suggests conversation starters from a guest's recent activity.

## Run

```
npm install
npm run dev
```

Open http://localhost:5173. On a phone, use the Network URL Vite prints (same Wi-Fi). Data is demo data kept in `localStorage` and re-seeded each day; use menu > Reset demo data to restore it.

## Features

- Ticket list per department (Bell and Valet, Housekeeping, Concierge, Maintenance)
- MINE / ALL and OPEN / CLOSED filters, due-date sort, Today / All Days, search
- Ticket detail: accept, reassign, complete, reopen, staff notes
- Rooms tab: guests by room, with Guest Memory and open tickets
- Guest Memory: three conversation starters per guest, savable to a ticket's staff notes
- New ticket sheet (+ button)

## Structure

- `src/data.ts` demo departments, staff, guests, tickets
- `src/store.ts` ticket state and persistence
- `src/tips.ts` conversation starter generator (local stand-in for an AI service)
- `src/components/` screens and UI

## Next: real backend

`src/data.ts`, `src/store.ts` and `src/tips.ts` are the seams to replace with ALICE and AI calls. See [API_SPEC.md](./API_SPEC.md) and [BACKEND_SETUP.md](./BACKEND_SETUP.md).
