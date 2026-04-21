from fastapi import Header, HTTPException

from app.db.database import SessionLocal
from app.db.models import User


def get_api_user(x_api_key: str = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key missing")

    db = SessionLocal()
    user = db.query(User).filter(User.api_key == x_api_key).first()
    db.close()

    if not user:
        raise HTTPException(status_code=403, detail="Invalid API key")

    return user
