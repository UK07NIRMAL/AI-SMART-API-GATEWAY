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

| Layer            | Technology                                             |
| ---------------- | ------------------------------------------------------ |
| Framework        | React 18 (Vite)                                        |
| Routing          | React Router v6                                        |
| Styling          | Tailwind CSS v3 (custom design tokens)                 |
| HTTP Client      | Axios                                                  |
| State Management | React Context API + useState/useEffect                 |
| Fonts            | Manrope (headlines), Inter (UI), JetBrains Mono (code) |
| Icons            | Google Material Symbols Outlined                       |
| Backend          | FastAPI (Python) — separate service                    |

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
