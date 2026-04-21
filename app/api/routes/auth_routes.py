import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import SessionLocal
from app.db.models import User
from app.utils.response import success_response

router = APIRouter(prefix="/auth")


class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
def signup(data: SignupRequest):
    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(data.password)
    api_key = str(uuid.uuid4())

    new_user = User(email=data.email, password=hashed_pw, api_key=api_key)
    db.add(new_user)
    db.commit()

    db.close()

    return success_response({"message": "User created", "api_key": api_key})


@router.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user.password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({"sub": user.email, "role": user.role})

    db.close()

    return success_response({"access_token": token})
