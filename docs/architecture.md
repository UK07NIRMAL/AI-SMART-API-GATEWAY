                    ┌─────────────────┐
                    │ React Frontend  │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ FastAPI API Gateway │
                  └─────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ JWT Auth │ │ Middleware │ │ ML Fraud │
│ API Keys │ │ Logging │ │ Detection │
└─────────────┘ └─────────────┘ └─────────────┘
│
┌─────────────┴─────────────┐
▼ ▼
┌─────────────┐ ┌─────────────┐
│ PostgreSQL │ │ Redis │
│ Users/Logs │ │ Rate Limit │
└─────────────┘ └─────────────┘
│
▼
┌───────────────────┐
│ AI Model Layer │
├───────────────────┤
│ Gemini API │
│ OpenAI API │
│ Groq API │
└───────────────────┘

# Request Flow

1. Client sends request from React Frontend.
2. FastAPI Gateway receives request.
3. Middleware processes request.
4. JWT / API Key authentication is validated.
5. Redis rate limiting is applied.
6. Fraud detection service evaluates request.
7. Business logic executes.
8. Data is stored/retrieved from PostgreSQL.
9. AI requests are forwarded to Gemini/OpenAI/Groq.
10. Response is returned to the client.
