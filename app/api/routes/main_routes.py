from fastapi import APIRouter, Depends, HTTPException

from app.api.routes.dependencies.api_key import get_api_user
from app.api.routes.dependencies.auth import get_current_user
from app.core.redis import redis_client
from app.db.database import engine
from app.utils.logger import logger
from app.utils.response import success_response

router = APIRouter()


@router.get("/")
def home():
    return success_response({"message": "AI API Gateway Running"})


@router.get("/test-db")
def test_db():
    return success_response({"status": str(engine)})


@router.get("/log")
def log_test():
    logger.info("Log working")
    return success_response({"status": "logged"})


@router.get("/profile")
def profile(user=Depends(get_current_user)):
    return success_response({"message": "Access granted", "user": user})


@router.get("/admin")
def admin_route(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    return success_response({"message": "Welcome admin"})


@router.get("/secure-data")
def secure_data(user=Depends(get_api_user)):
    return success_response({"message": f"Hello {user.email}"})


@router.get("/redis-test")
def redis_test():
    redis_client.set("test", "working")
    return success_response({"redis": redis_client.get("test")})
