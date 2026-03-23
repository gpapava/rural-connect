# RURAL-CONNECT

**Distance Counseling Platform for NEET Youth**

RURAL-CONNECT is a web-based platform developed as part of an **Erasmus+ project**, designed to provide remote career counseling services to young people who are Not in Education, Employment, or Training (NEET) — particularly those living in rural areas with limited access to in-person support services.

The platform connects NEET users with qualified career counselors, provides structured e-learning modules, supports digital portfolio building, and links users to national labor market resources across participating countries.

---

## Features

- **Dashboard** — Personalized overview showing upcoming sessions, e-learning progress, portfolio status, and quick-access tools
- **Distance Counseling Session** — Real-time chat between NEET user and counselor, with session notes, action plans, and shared file management
- **Digital Portfolio Builder** — Users build and export a professional portfolio (PDF/CV), with counselor feedback integration
- **E-Library & Modules** — Structured learning modules (IT Skills, Soft Skills, Social Innovation, etc.) with progress tracking
- **Labor Market Links** — Curated links to national employment agencies filtered by country
- **Multilingual Support** — Full UI translation in 7 languages: English, Turkish, Latvian, Greek, Spanish, Italian, Norwegian
- **Role-based Access** — Three roles: NEET User, Counselor, and Admin

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MySQL |
| ORM | [Prisma](https://www.prisma.io/) |
| Authentication | [NextAuth.js v5](https://authjs.dev/) |
| Internationalization | [next-intl](https://next-intl-docs.vercel.app/) |
| Real-time Chat | [Socket.io](https://socket.io/) |
| Icons | [Lucide React](https://lucide.dev/) |

---

## Project Structure

```
rural-connect/
├── messages/               # Translation files (en, tr, lv, el, es, it, no)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Demo data seeder
├── src/
│   ├── app/
│   │   ├── [locale]/       # Locale-based routing
│   │   │   ├── dashboard/
│   │   │   ├── counseling/
│   │   │   ├── portfolio/
│   │   │   ├── library/
│   │   │   ├── labor-market/
│   │   │   └── auth/login/
│   │   └── api/            # API routes (auth, socket, portfolio, sessions)
│   ├── components/         # Page components (Dashboard, Counseling, Portfolio, etc.)
│   ├── lib/                # Auth config, Prisma client, utilities
│   ├── types/              # TypeScript type augmentations
│   ├── i18n.ts             # Locale configuration
│   └── middleware.ts       # Auth + i18n routing middleware
├── server.ts               # Socket.io standalone server
└── .env.example
```

---

## Database Models

- **User** — Supports three roles: `NEET_USER`, `COUNSELOR`, `ADMIN`
- **CounselingSession** — Links a NEET user and a counselor with scheduling, notes, and action plan
- **Message** — Chat messages tied to a counseling session
- **SharedFile** — Files exchanged during a session
- **PortfolioEntry** — User's digital portfolio with summary, target sector, and skills
- **Qualification** — Training and education entries within a portfolio
- **Module** — E-learning module definitions
- **UserModuleProgress** — Tracks per-user progress across modules
- **LaborMarketLink** — Employment agency links organized by country

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/gpapava/rural-connect.git
cd rural-connect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and AUTH_SECRET
```

### Database Setup

```bash
# Push schema to your MySQL database
npm run db:push

# Seed with demo data
npm run db:seed
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Demo Accounts

After seeding, the following accounts are available for testing:

| Role | Email | Password |
|---|---|---|
| Admin | admin@ruralconnect.eu | admin123 |
| Counselor | counselor@ruralconnect.eu | counselor123 |
| NEET User | user@ruralconnect.eu | neet123 |

---

## Supported Languages

| Code | Language |
|---|---|
| `en` | English |
| `tr` | Turkish |
| `lv` | Latvian |
| `el` | Greek |
| `es` | Spanish |
| `it` | Italian |
| `no` | Norwegian |

---

## Deployment

The platform is designed to be deployed on a **VPS** (e.g., Hostinger VPS) using Node.js, PM2, and Nginx as a reverse proxy.

```bash
# Build for production
npm run build

# Start with PM2
pm2 start npm --name "rural-connect" -- start
```

---

## License

This project was developed for the **RURAL-CONNECT Erasmus+ project**. All rights reserved.
