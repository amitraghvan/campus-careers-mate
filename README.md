# PlaceTrack — Smart Placement Tracker 🎓

> **Your Placement Command Center** — Track, prepare, and land your dream campus placement.

## Features

- 📊 **Dashboard** — Stats, deadlines, status overview, opportunity list
- 📈 **Analytics** — Recharts-powered charts for placement insights
- 📅 **Calendar** — Deadline visualization with month navigation
- 📝 **Notes** — Interview prep & company research with categories
- 👤 **Profile** — Stats summary, data export, and management
- 🔐 **Auth** — Sign in / sign up with session persistence

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | shadcn/ui (50+ components) |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | NestJS, Prisma, PostgreSQL |
| Deploy | Vercel (frontend), Render (backend) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Backend:

```bash
cd server
npm install
npx prisma generate
npm run start:dev
```

## Deployment

- **Frontend**: Auto-deploys to Vercel on push to `main`
- **Backend**: Auto-deploys to Render on push to `main` (root dir: `server`)

## License

MIT
