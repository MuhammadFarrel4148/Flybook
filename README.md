# Flybook

**Flybook** is a flight ticket booking web application built as a fullstack portfolio project. It demonstrates a decoupled Next.js + Express.js architecture, end-to-end type safety, and a complete user flow from flight search to a digital boarding pass — designed to be showcased to recruiters and hiring teams.

> **Status:** Planning complete (MVP v1.0, "Approved for Development"). Documentation is finalized; implementation has not started yet.

## Key Features (MVP)

- **Authentication** — Google OAuth and manual email/password sign-up/login, with "Remember Me"
- **Flight Search** — search by route, date, and passenger count, with cheapest-price sorting
- **Interactive Seat Selection** — visual seat map (red = occupied, grey = available, green = selected) with passenger data entry (name, NIK)
- **Payment Simulation** — simplified price × passenger-count calculation (no tax/fees, no real payment gateway)
- **My Tickets** — booking history with a digital E-Boarding Pass

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Lucide React |
| Data Fetching | TanStack Query v5 |
| Validation | Zod (shared frontend/backend schemas) |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL + Prisma ORM (via Docker Compose) |
| Auth | JWT (HttpOnly cookie) + Google OAuth |
| Testing | Vitest (frontend unit tests), Vitest + Supertest (backend unit & integration tests) |
| CI/CD | GitHub Actions |

## Planned Project Structure

The layout below is the target monorepo structure defined in `Architecture.md`; it has not been scaffolded yet.

```
flybook/
├── apps/
│   ├── frontend/     # Next.js app (App Router)
│   └── backend/      # Express.js + Prisma API
├── .github/
│   └── workflows/    # CI/CD pipelines
├── docker-compose.yml
├── Architecture.md
├── PRD.md
├── Rules.md
└── Schema.md
```