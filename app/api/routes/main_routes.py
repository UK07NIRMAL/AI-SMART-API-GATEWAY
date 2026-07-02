import csv
import uuid
from io import StringIO

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response

from app.api.routes.dependencies.api_key import get_api_user
from app.api.routes.dependencies.auth import get_current_user
from app.core.redis import redis_client
from app.db.database import SessionLocal, engine
from app.db.models import AIRequest, User, UserActivity
from app.schemas.playground import PlaygroundRequest
from app.services.ai_logger import log_ai_request
from app.services.gemini_service import generate_response
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


@router.get("/dashboard/stats")
def dashboard_stats():
    db = SessionLocal()

    total_users = db.query(User).count()

    active_keys = db.query(User).filter(User.api_key.isnot(None)).count()

    total_requests = db.query(UserActivity).count()

    db.close()

    return {
        "total_requests": total_requests,
        "success_rate": "99.9%",
        "avg_latency_ms": "42ms",
        "active_keys_count": active_keys,
        "total_users": total_users,
    }


@router.get("/activities")
def activities():
    db = SessionLocal()

    activities = db.query(UserActivity).all()

    data = [
        {
            "user": a.user,
            "endpoint": a.endpoint,
            "timestamp": a.timestamp,
        }
        for a in activities
    ]

    db.close()

    return data


@router.get("/dashboard/recent-operations")
def recent_operations():
    db = SessionLocal()

    activities = (
        db.query(UserActivity).order_by(UserActivity.timestamp.desc()).limit(10).all()
    )

    data = [
        {
            "event": "API Request",
            "model": activity.endpoint,
            "timestamp_label": activity.timestamp.strftime("%H:%M:%S"),
            "color": "bg-primary",
        }
        for activity in activities
    ]

    db.close()

    return data


@router.get("/keys")
def list_keys():
    db = SessionLocal()

    users = db.query(User).filter(User.api_key.isnot(None)).all()

    data = [
        {
            "id": str(user.id),
            "name": f"{user.email} Key",
            "environment": "production",
            "key_prefix": user.api_key,
            "is_active": True,
        }
        for user in users
    ]

    db.close()

    return data


@router.post("/keys/{user_id}/rotate")
def rotate_key(user_id: int):
    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    user.api_key = str(uuid.uuid4())

    db.commit()

    new_key = user.api_key

    db.close()

    return {
        "message": "API key rotated successfully",
        "api_key": new_key,
    }


@router.get("/logs")
def get_logs(
    search: str = Query(None),
    method: str = Query(None),
    status: str = Query(None),
):
    db = SessionLocal()

    logs = db.query(UserActivity).order_by(UserActivity.timestamp.desc()).all()

    data = [
        {
            "id": str(log.id),
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "method": log.method,
            "endpoint": log.endpoint,
            "status": log.status_code,
            "latency": log.latency_ms,
            "ip": log.user,
        }
        for log in logs
    ]

    if search:
        data = [
            log
            for log in data
            if search.lower() in log["endpoint"].lower()
            or search.lower() in log["ip"].lower()
        ]

    if method:
        data = [log for log in data if log["method"] == method]

    if status:
        data = [log for log in data if str(log["status"]).startswith(status[0])]

    db.close()

    return data


@router.get("/logs/export")
def export_logs():
    db = SessionLocal()

    logs = db.query(UserActivity).order_by(UserActivity.timestamp.desc()).all()

    output = StringIO()

    writer = csv.writer(output)

    writer.writerow(
        [
            "timestamp",
            "method",
            "endpoint",
            "status",
            "latency",
            "ip",
        ]
    )

    for log in logs:
        writer.writerow(
            [
                log.timestamp,
                log.method,
                log.endpoint,
                log.status_code,
                log.latency_ms,
                log.user,
            ]
        )

    db.close()

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=neurogate_logs.csv"},
    )


@router.get("/admin/users")
def admin_users():
    db = SessionLocal()

    users = db.query(User).all()

    data = [
        {
            "id": str(user.id),
            "name": user.email.split("@")[0].title(),
            "email": user.email,
            "role": user.role,
            "plan": "Free",
            "status": "active",
            "joined": "2026-01-01",
        }
        for user in users
    ]

    db.close()

    return data


@router.get("/admin/models")
def admin_models():
    return [
        {
            "id": "1",
            "name": "neural-v4",
            "version": "4.2.1",
            "status": "active",
            "requests": "0",
            "accuracy": 98.2,
        }
    ]


@router.get("/admin/system/health")
def system_health():
    return {
        "cpu_percent": 34,
        "memory_percent": 58,
        "disk_percent": 22,
        "uptime_days": 47,
        "requests_per_second": 284,
    }


@router.post("/playground/execute")
def execute_playground(
    req: PlaygroundRequest,
    current_user=Depends(get_current_user),
):

    prompt = req.body.get("input", {}).get("prompt") if req.body else ""

    ai_response = generate_response(prompt)

    log_ai_request(
        user=current_user["sub"],
        prompt=prompt,
        response=ai_response,
        model="gemini-2.5-flash",
        status="success",
    )

    return {"status": 200, "response": {"output": ai_response}}


@router.get("/playground/history")
def get_playground_history():

    db = SessionLocal()

    history = db.query(AIRequest).order_by(AIRequest.timestamp.desc()).limit(20).all()

    result = []

    for item in history:
        result.append(
            {
                "id": item.id,
                "user": item.user,
                "prompt": item.prompt,
                "model": item.model,
                "status": item.status,
                "timestamp": item.timestamp,
            }
        )

    db.close()

    return result
