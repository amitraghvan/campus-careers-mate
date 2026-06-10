# 🎓 Campus Careers Mate

An AI-powered personal career and academic assistant designed to bridge the gap between academic learning and career readiness for university students. Campus Careers Mate integrates study planners, Kanban application trackers, AI-powered resume builders, and real-time peer networking into a single, cohesive ecosystem.

---

## 🚀 Key Features

*   **AI Resume Builder & Hub**: Multiple resume templates with AI-driven content suggestions and professional, industry-compliant PDF export.
*   **Intelligent Study Planner**: Adaptive scheduling and calendar integration with automated workload balancing.
*   **Opportunities Pipeline**: Kanban-style CRM tracking for job and internship applications.
*   **Peer Connect**: Real-time peer-to-peer messaging and networking powered by Socket.io.
*   **Unified Dashboard**: High-level learning analytics and real-time visualization of academic progress.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Authentication**: [Clerk React](https://clerk.com/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)

### Backend
*   **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
*   **Database**: PostgreSQL managed via [Prisma ORM](https://www.prisma.io/)
*   **Real-time Engine**: [Socket.io](https://socket.io/) (WebSockets)
*   **Caching & Broker**: [Redis](https://redis.io/)
*   **AI Engine**: [Groq SDK](https://groq.com/)
*   **Security & Protection**: Helmet, Rate Limiter (Nest Throttler), CORS controls, and Double-Submit Cookie CSRF protection.

---

## 📂 Project Structure

```text
campus-careers-mate-1/
├── server/                     # NestJS Backend API
│   ├── prisma/                 # Database Schema & Seed scripts
│   ├── src/
│   │   ├── modules/            # Domain-specific NestJS modules (ai, auth, chat, resume, etc.)
│   │   ├── common/             # Intercepts, guards, middleware, and helpers
│   │   └── main.ts             # API entrypoint, CORS, security, Swagger docs
│   └── package.json
├── src/                        # Vite + React Frontend
│   ├── components/             # Reusable UI controls and layout components
│   ├── features/               # Core application modules (dashboard, planner, network, etc.)
│   ├── hooks/                  # Global React hooks
│   ├── pages/                  # Page-level routable views
│   └── main.tsx                # App entrypoint
├── SRS.md                      # Software Requirements Specification (SRS)
├── SECURITY_HARDENING.md       # Security Hardening & Audit Guide
├── package.json                # Root package workspace scripts
└── README.md                   # This project guide
```

---

## 🔧 Getting Started & Local Setup

### Prerequisites
- Node.js (v18+)
- npm or bun
- Docker (optional, for launching local database/Redis services)

### 1. Configure Environment Variables
Create `.env` files in both the root directory and the `/server` directory:

#### Frontend (`.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
```

#### Backend (`server/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/campus_careers_mate?schema=public"
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
GROQ_API_KEY=your_groq_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### 2. Setup the Database & Cache (Docker)
A `docker-compose.yml` is provided in the `/server` directory to spin up PostgreSQL and Redis:
```bash
cd server
npm run docker:up
```

### 3. Install Dependencies
Install dependencies at the root and server levels:
```bash
# Root (Frontend and workspace scripts)
npm install

# Server (Backend NestJS)
cd server
npm install
```

### 4. Run Database Migrations
Run Prisma migrations and seed the database:
```bash
cd server
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
```

### 5. Running the Application
You can run both frontend and backend development servers simultaneously using the root workspace helper script:
```bash
npm run dev:all
```
- Frontend will be served at `http://localhost:5173`
- Backend API will be served at `http://localhost:3000` (Swagger docs available at `http://localhost:3000/api`)

---

## 🧪 Testing

### Frontend Tests
Run Vitest unit and integration tests:
```bash
npm run test
```

### Backend Tests
Run Jest unit and E2E tests:
```bash
cd server
npm run test       # Unit tests
npm run test:e2e   # End-to-End tests
```