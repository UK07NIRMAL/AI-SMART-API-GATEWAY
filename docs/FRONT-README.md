# NeuroGate AI — React Frontend

> High-precision API Gateway frontend built from the **Stitch / Obsidian Nexus** design system. Connects seamlessly to a FastAPI Python backend.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Setup Instructions](#setup-instructions)
5. [Environment Variables](#environment-variables)
6. [Connecting to FastAPI Backend](#connecting-to-fastapi-backend)
7. [Pages & Routes](#pages--routes)
8. [API Service Layer](#api-service-layer)
9. [Design System](#design-system)
10. [Assumptions](#assumptions)

---

## Project Overview

NeuroGate AI is a developer-facing gateway platform for machine learning APIs. The frontend provides:

- **Landing Page** — marketing/hero with feature showcase
- **Authentication** — Login & Sign-Up with JWT support
- **Developer Dashboard** — stats, API key management, recent operations
- **API Playground** — interactive HTTP request builder
- **Activity Logs** — filterable, searchable log table with export
- **Admin Panel** — user management, model registry, system health
- **Support** — ticket management with priority/category tracking

---

## Tech Stack

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | React 18 (Vite)                     |
| Routing          | React Router v6                     |
| Styling          | Tailwind CSS v3 (custom design tokens) |
| HTTP Client      | Axios                               |
| State Management | React Context API + useState/useEffect |
| Fonts            | Manrope (headlines), Inter (UI), JetBrains Mono (code) |
| Icons            | Google Material Symbols Outlined    |
| Backend          | FastAPI (Python) — separate service |

---

## Folder Structure

```
neurogate-ai/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example                  ← copy to .env and fill values
└── src/
    ├── main.jsx                  ← app entry point
    ├── App.jsx                   ← router + route guard
    ├── context/
    │   └── AuthContext.jsx       ← global auth state (login/logout)
    ├── services/
    │   └── api.js                ← all API calls (axios instance + services)
    ├── components/
    │   ├── AppLayout.jsx         ← sidebar + mobile header wrapper
    │   ├── Sidebar.jsx           ← left navigation
    │   ├── TopNav.jsx            ← public page navigation bar
    │   ├── StatCard.jsx          ← glassmorphic metric card
    │   ├── LoadingSpinner.jsx    ← reusable loading state
    │   └── ErrorBanner.jsx       ← reusable error display
    ├── pages/
    │   ├── LandingPage.jsx       ← / (public)
    │   ├── AuthPage.jsx          ← /auth (login + register)
    │   ├── DashboardPage.jsx     ← /dashboard (protected)
    │   ├── PlaygroundPage.jsx    ← /playground (protected)
    │   ├── ActivityLogs.jsx      ← /logs (protected)
    │   ├── AdminPanel.jsx        ← /admin (protected)
    │   └── SupportPage.jsx       ← /support (protected)
    ├── assets/                   ← images, SVGs, static files
    └── styles/
        └── global.css            ← Tailwind imports + custom utilities
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd neurogate-ai
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your FastAPI server URL
```

### 3. Run Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
# Output in /dist — deploy to any static host (Vercel, Netlify, Nginx, etc.)
```

---

## Environment Variables

| Variable            | Default                   | Description                              |
|---------------------|---------------------------|------------------------------------------|
| `VITE_API_BASE_URL` | `http://localhost:8000`   | Base URL of your FastAPI backend         |
| `VITE_API_VERSION`  | `/api/v1`                 | API version prefix appended to base URL  |

All variables must be prefixed with `VITE_` to be accessible in the browser (Vite requirement).

---

## Connecting to FastAPI Backend

### CORS Setup (FastAPI)

Add the frontend origin to your FastAPI CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-production-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Expected API Endpoints

The frontend's service layer (`src/services/api.js`) expects these FastAPI routes:

#### Auth
| Method | Path              | Body / Params                         | Returns                                  |
|--------|-------------------|---------------------------------------|------------------------------------------|
| POST   | `/api/v1/auth/login`    | `{ email, password }`         | `{ access_token, token_type, user }`     |
| POST   | `/api/v1/auth/register` | `{ name, email, password }`   | `{ access_token, token_type, user }`     |
| POST   | `/api/v1/auth/logout`   | —                             | `{ message }`                            |

#### Dashboard
| Method | Path                                | Returns                                      |
|--------|-------------------------------------|----------------------------------------------|
| GET    | `/api/v1/dashboard/stats`           | `{ total_requests, success_rate, avg_latency_ms, active_keys_count }` |
| GET    | `/api/v1/dashboard/recent-operations` | `[{ event, model, timestamp_label, color }]` |

#### API Keys
| Method | Path                   | Notes                                |
|--------|------------------------|--------------------------------------|
| GET    | `/api/v1/keys`         | Returns list of key objects          |
| POST   | `/api/v1/keys`         | Create key `{ name, environment, scopes }` |
| POST   | `/api/v1/keys/:id/rotate` | Rotate a key                      |
| DELETE | `/api/v1/keys/:id`     | Delete a key                         |

#### Activity Logs
| Method | Path               | Params                              |
|--------|--------------------|-------------------------------------|
| GET    | `/api/v1/logs`     | `?page&limit&method&status&search`  |
| GET    | `/api/v1/logs/export` | Returns CSV blob                 |

#### Admin
| Method | Path                      | Notes                   |
|--------|---------------------------|-------------------------|
| GET    | `/api/v1/admin/users`     | User list               |
| PATCH  | `/api/v1/admin/users/:id` | Update user             |
| DELETE | `/api/v1/admin/users/:id` | Delete user             |
| GET    | `/api/v1/admin/models`    | ML model list           |
| GET    | `/api/v1/admin/system/health` | CPU/memory/disk/uptime |

#### Support
| Method | Path                              | Notes             |
|--------|-----------------------------------|-------------------|
| GET    | `/api/v1/support/tickets`         | List tickets      |
| POST   | `/api/v1/support/tickets`         | Create ticket     |
| GET    | `/api/v1/support/tickets/:id`     | Ticket detail     |
| POST   | `/api/v1/support/tickets/:id/messages` | Send message |

### Token Handling

The frontend stores the JWT in `localStorage` as `ng_access_token`. The Axios interceptor automatically appends it as `Authorization: Bearer <token>` on every request.

On a 401 response, the interceptor clears storage and redirects to `/auth`.

---

## Pages & Routes

| Route         | Page           | Auth Required |
|---------------|----------------|---------------|
| `/`           | Landing Page   | No            |
| `/auth`       | Login/Register | No            |
| `/dashboard`  | Dashboard      | Yes           |
| `/playground` | API Playground | Yes           |
| `/logs`       | Activity Logs  | Yes           |
| `/admin`      | Admin Panel    | Yes           |
| `/support`    | Support        | Yes           |

---

## API Service Layer

All API communication is centralised in `src/services/api.js`.

```js
import { authService, dashboardService, apiKeyService } from './services/api';

// Login
const { data } = await authService.login({ email, password });

// Fetch dashboard stats
const { data: stats } = await dashboardService.getStats();

// List API keys
const { data: keys } = await apiKeyService.listKeys();
```

The file exports named service objects: `authService`, `dashboardService`, `apiKeyService`, `logsService`, `playgroundService`, `adminService`, `supportService`.

---

## Design System

The UI implements the **Obsidian Nexus** design specification:

- **Palette** — Deep obsidian base (`#0e0e0e`) with neon accents: Primary Cyan (`#8ff5ff`), Secondary Purple (`#af88ff`), Tertiary Blue (`#69daff`)
- **Typography** — Manrope for headlines, Inter for UI text, JetBrains Mono for code
- **Surfaces** — Five-layer frosted glass hierarchy: `surface` → `surface-container-low` → `surface-container` → `surface-container-high` → `surface-container-highest`
- **No divider lines** — section boundaries are communicated through background tone shifts
- **Power Rail** — active sidebar items show a 2px left border in `primary` with a subtle glow

---

## Assumptions

1. **Auth flow** — JWT-based; tokens stored in `localStorage`. For higher security, move to `httpOnly` cookies and update the interceptor.
2. **Mock fallback** — All pages gracefully fall back to mock data when the backend is unavailable. This lets you run the UI standalone during development.
3. **Playground proxy** — The playground `execute` endpoint proxies requests server-side to avoid CORS issues. If you prefer client-side fetch, update `PlaygroundPage.jsx` to use native `fetch`.
4. **Pagination** — The logs table has UI pagination controls wired up; connect them to `logsService.getLogs({ page, limit })` when the backend is ready.
5. **OAuth** — GitHub and Google OAuth buttons are UI-only placeholders. Wire them to your OAuth callback endpoints in `authService.githubOAuth()` / `authService.googleOAuth()`.
6. **Admin role guard** — The `/admin` route is currently protected only by authentication. Add a role check in `App.jsx` `PrivateRoute` to restrict it to admins.
