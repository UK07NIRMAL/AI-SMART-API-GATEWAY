# 🚀 NeuroGate AI — Smart API Gateway (Backend)

NeuroGate AI is a production-style backend API gateway built with FastAPI. It provides authentication, API key management, request monitoring, rate limiting, activity logging, and machine learning-based fraud detection.

The project is designed as a scalable backend foundation for AI-powered applications and API services.

---

# ✨ Features

## Authentication & Security

- JWT Authentication
- Secure Password Hashing
- Role-Based Access Control (RBAC)
- API Key Authentication
- Protected Routes

## Monitoring & Observability

- Activity Logging
- Request Tracking
- Dashboard Statistics
- Recent Operations Monitoring
- CSV Log Export

## Performance & Reliability

- Redis-Based Rate Limiting
- Request Middleware Pipeline
- Structured Logging
- Centralized Error Handling

## Machine Learning

- Isolation Forest Based Fraud Detection
- Suspicious Request Detection
- Fraud Monitoring Pipeline

## Administration

- User Management
- System Health Monitoring
- API Key Rotation
- Administrative Endpoints

---

# 🏗 Tech Stack

## Backend

- FastAPI
- Python

## Database

- PostgreSQL
- SQLAlchemy ORM

## Caching & Rate Limiting

- Redis

## Machine Learning

- Scikit-Learn
- Isolation Forest

## Authentication

- JWT
- Passlib

---

# 📁 Project Structure

```text
app/
├── api/
│   ├── routes/
│   └── dependencies/
├── core/
├── db/
├── ml/
├── services/
├── utils/
└── main.py
```

---

# ⚙️ Request Flow

```text
Client Request
      │
      ▼
Middleware
      │
      ▼
Rate Limiter (Redis)
      │
      ▼
Authentication
      │
      ▼
Fraud Detection
      │
      ▼
Business Logic
      │
      ▼
Database / Response
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd AI-SMART-API-GATEWAY
```

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 🔧 Environment Variables

Create a `.env` file from `.env.example`.

```bash
cp .env.example .env
```

Example `.env.example`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/neurogate

SECRET_KEY=your_secret_key
ALGORITHM=HS256

REDIS_HOST=localhost
REDIS_PORT=6379
```

---

# 🗄 Database Setup

Make sure PostgreSQL is running and update the database URL inside your `.env` file.

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/neurogate
```

---

# 🔴 Redis Setup

Ensure Redis is running locally before starting the server.

Default configuration:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

Verify Redis connection:

```bash
redis-cli ping
```

Expected output:

```text
PONG
```

---

# ▶️ Run Server

```bash
uvicorn main:app --reload
```

Server URL:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 📜 License
