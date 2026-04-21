from app.db.database import SessionLocal
from app.db.models import UserActivity


def log_activity(user: str, endpoint: str):
    db = SessionLocal()

    activity = UserActivity(user=user, endpoint=endpoint)
    db.add(activity)
    db.commit()

    db.close()
