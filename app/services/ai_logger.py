from app.db.database import SessionLocal
from app.db.models import AIRequest


def log_ai_request(
    user: str,
    prompt: str,
    response: str,
    model: str,
    status: str,
):
    db = SessionLocal()

    request = AIRequest(
        user=user,
        prompt=prompt,
        response=response,
        model=model,
        status=status,
    )

    db.add(request)
    db.commit()
    db.close()
