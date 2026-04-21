import time
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.routes.auth_routes import router as auth_router
from app.api.routes.main_routes import router as main_router
from app.core.security import verify_token
from app.db import models
from app.ml.fraud import detect_fraud
from app.services.activity_logger import log_activity
from app.services.rate_limiter import is_allowed
from app.utils.logger import logger

app = FastAPI()

app.include_router(auth_router)
app.include_router(main_router)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()

    client_ip = request.client.host

    identifier = client_ip
    auth_header = request.headers.get("authorization")

    if auth_header:
        try:
            token = auth_header.split()[1]
            payload = verify_token(token)
            if payload:
                identifier = payload.get("sub")
        except:
            pass

    if not is_allowed(identifier):
        return JSONResponse(status_code=429, content={"detail": "Too many requests"})

    if detect_fraud(identifier):
        return JSONResponse(status_code=403, content={"detail": "Fraud detected"})

    endpoint = request.url.path
    log_activity(identifier, endpoint)

    logger.info(f"[{request_id}] ID: {identifier} | {request.method} {request.url}")

    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"[{request_id}] ERROR: {str(e)}")
        return JSONResponse(
            status_code=500, content={"detail": "Internal Server Error"}
        )

    process_time = time.time() - start_time

    logger.info(
        f"[{request_id}] Status: {response.status_code} | Time: {process_time:.4f}s"
    )

    return response
