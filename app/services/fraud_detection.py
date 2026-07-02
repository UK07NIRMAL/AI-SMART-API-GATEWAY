from app.ml.fraud import detect_fraud


def check_user_activity(user: str):
    return detect_fraud(user)