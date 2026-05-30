from app.db.database import SessionLocal
from app.db.models import UserActivity


def log_activity(
    user: str,
    endpoint: str,
    method: str,
    status_code: int,
    latency_ms: str,
):
    db = SessionLocal()

    activity = UserActivity(
        user=user,
        endpoint=endpoint,
        method=method,
        status_code=status_code,
        latency_ms=latency_ms,
    )

    db.add(activity)
    db.commit()

    db.close()
